import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";

import styles from "./home.module.scss";

import { IconButton } from "./button";
import SettingsIcon from "../icons/settings.svg";
import ChatGptIcon from "../icons/chatgpt.svg";
import AddIcon from "../icons/add.svg";
import McpIcon from "../icons/mcp.svg";
import DragIcon from "../icons/drag.svg";
import DiscoveryIcon from "../icons/discovery.svg";

import Locale from "../locales";

import { useAppConfig, useChatStore, useAccessStore } from "../store";

import {
  DEFAULT_SIDEBAR_WIDTH,
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  NARROW_SIDEBAR_WIDTH,
  Path,
} from "../constant";

import { useNavigate } from "react-router-dom";
import { isIOS, useMobileScreen } from "../utils";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { isMcpEnabled } from "../mcp/actions";

const DEFAULT_OPENCLAW_URL = "http://localhost:18789/openclaw/";

function normalizeOpenclawUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return DEFAULT_OPENCLAW_URL;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `http://${trimmed}`;
}

const DISCOVERY = [
  { name: Locale.Plugin.Name, path: Path.Plugins },
  { name: "Stable Diffusion", path: Path.Sd },
  { name: Locale.SearchChat.Page.Title, path: Path.SearchChat },
];

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
  loading: () => null,
});

export function useHotKey() {
  const chatStore = useChatStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey) {
        if (e.key === "ArrowUp") {
          chatStore.nextSession(-1);
        } else if (e.key === "ArrowDown") {
          chatStore.nextSession(1);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
}

export function useDragSideBar() {
  const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x);

  const config = useAppConfig();
  const startX = useRef(0);
  const startDragWidth = useRef(config.sidebarWidth ?? DEFAULT_SIDEBAR_WIDTH);
  const lastUpdateTime = useRef(Date.now());

  const toggleSideBar = () => {
    config.update((config) => {
      if (config.sidebarWidth < MIN_SIDEBAR_WIDTH) {
        config.sidebarWidth = DEFAULT_SIDEBAR_WIDTH;
      } else {
        config.sidebarWidth = NARROW_SIDEBAR_WIDTH;
      }
    });
  };

  const onDragStart = (e: MouseEvent) => {
    // Remembers the initial width each time the mouse is pressed
    startX.current = e.clientX;
    startDragWidth.current = config.sidebarWidth;
    const dragStartTime = Date.now();

    const handleDragMove = (e: MouseEvent) => {
      if (Date.now() < lastUpdateTime.current + 20) {
        return;
      }
      lastUpdateTime.current = Date.now();
      const d = e.clientX - startX.current;
      const nextWidth = limit(startDragWidth.current + d);
      config.update((config) => {
        if (nextWidth < MIN_SIDEBAR_WIDTH) {
          config.sidebarWidth = NARROW_SIDEBAR_WIDTH;
        } else {
          config.sidebarWidth = nextWidth;
        }
      });
    };

    const handleDragEnd = () => {
      // In useRef the data is non-responsive, so `config.sidebarWidth` can't get the dynamic sidebarWidth
      window.removeEventListener("pointermove", handleDragMove);
      window.removeEventListener("pointerup", handleDragEnd);

      // if user click the drag icon, should toggle the sidebar
      const shouldFireClick = Date.now() - dragStartTime < 300;
      if (shouldFireClick) {
        toggleSideBar();
      }
    };

    window.addEventListener("pointermove", handleDragMove);
    window.addEventListener("pointerup", handleDragEnd);
  };

  const isMobileScreen = useMobileScreen();
  const shouldNarrow =
    !isMobileScreen && config.sidebarWidth < MIN_SIDEBAR_WIDTH;

  useEffect(() => {
    const barWidth = shouldNarrow
      ? NARROW_SIDEBAR_WIDTH
      : limit(config.sidebarWidth ?? DEFAULT_SIDEBAR_WIDTH);
    const sideBarWidth = isMobileScreen ? "100vw" : `${barWidth}px`;
    document.documentElement.style.setProperty("--sidebar-width", sideBarWidth);
  }, [config.sidebarWidth, isMobileScreen, shouldNarrow]);

  return {
    onDragStart,
    shouldNarrow,
  };
}

export function SideBarContainer(props: {
  children: React.ReactNode;
  onDragStart: (e: MouseEvent) => void;
  shouldNarrow: boolean;
  className?: string;
}) {
  const isMobileScreen = useMobileScreen();
  const isIOSMobile = useMemo(
    () => isIOS() && isMobileScreen,
    [isMobileScreen],
  );
  const { children, className, onDragStart, shouldNarrow } = props;
  return (
    <div
      className={clsx(styles.sidebar, className, {
        [styles["narrow-sidebar"]]: shouldNarrow,
      })}
      style={{
        // #3016 disable transition on ios mobile screen
        transition: isMobileScreen && isIOSMobile ? "none" : undefined,
      }}
    >
      {children}
      <div
        className={styles["sidebar-drag"]}
        onPointerDown={(e) => onDragStart(e as any)}
      >
        <DragIcon />
      </div>
    </div>
  );
}

export function SideBarHeader(props: {
  title?: string | React.ReactNode;
  subTitle?: string | React.ReactNode;
  logo?: React.ReactNode;
  children?: React.ReactNode;
  shouldNarrow?: boolean;
}) {
  const { title, subTitle, logo, children, shouldNarrow } = props;
  return (
    <Fragment>
      <div
        className={clsx(styles["sidebar-header"], {
          [styles["sidebar-header-narrow"]]: shouldNarrow,
        })}
        data-tauri-drag-region
      >
        <div className={styles["sidebar-title-container"]}>
          <div className={styles["sidebar-title"]} data-tauri-drag-region>
            {title}
          </div>
          <div className={styles["sidebar-sub-title"]}>{subTitle}</div>
        </div>
        <div className={clsx(styles["sidebar-logo"], "no-dark")}>{logo}</div>
      </div>
      {children}
    </Fragment>
  );
}

export function SideBarBody(props: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  const { onClick, children } = props;
  return (
    <div className={styles["sidebar-body"]} onClick={onClick}>
      {children}
    </div>
  );
}

export function SideBarTail(props: {
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}) {
  const { primaryAction, secondaryAction } = props;

  return (
    <div className={styles["sidebar-tail"]}>
      <div className={styles["sidebar-actions"]}>{primaryAction}</div>
      <div className={styles["sidebar-actions"]}>{secondaryAction}</div>
    </div>
  );
}

export function SideBar(props: { className?: string }) {
  useHotKey();
  const { onDragStart, shouldNarrow } = useDragSideBar();
  const [showDiscoverySelector, setshowDiscoverySelector] = useState(false);
  const navigate = useNavigate();
  const config = useAppConfig();
  const chatStore = useChatStore();
  const accessStore = useAccessStore();
  const [mcpEnabled, setMcpEnabled] = useState(false);
  const isAdmin = accessStore.isAdmin();

  const openOpenclaw = () => {
    const targetUrl = normalizeOpenclawUrl(
      config.openclawConfig?.url ?? DEFAULT_OPENCLAW_URL,
    );
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const checkMcpStatus = async () => {
      const enabled = await isMcpEnabled();
      setMcpEnabled(enabled);
    };
    checkMcpStatus();
  }, []);

  return (
    <SideBarContainer
      onDragStart={onDragStart}
      shouldNarrow={shouldNarrow}
      {...props}
    >
      <SideBarHeader
        title="普惠 AI 一体机"
        subTitle="控制系统"
        logo={<ChatGptIcon />}
        shouldNarrow={shouldNarrow}
      >
        {/* 顶部仅保留基础功能按钮，保持简洁 */}
        <div className={styles["sidebar-header-bar"]}>
          {/* <IconButton
            icon={<MaskIcon />}
            text={shouldNarrow ? undefined : Locale.Mask.Name}
            className={styles["sidebar-bar-button"]}
            onClick={() => navigate(Path.Masks)}
            shadow  
          /> */}
          <IconButton
            icon={<SettingsIcon />}
            text={shouldNarrow ? undefined : "设置"}
            className={styles["sidebar-bar-button"]}
            onClick={() => navigate(Path.Settings)}
            shadow
          />
        </div>
      </SideBarHeader>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* 固定导航项 */}
        <div className={styles["sidebar-nav"]}>
          {/* --- 新增：演示功能长条按钮组 --- */}
          <div
            className={styles["sidebar-actions"]}
            style={{
              padding: "10px 20px",
              gap: "8px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <IconButton
              icon={<DiscoveryIcon />}
              text={shouldNarrow ? undefined : "产品主页"}
              onClick={() => navigate(Path.ProductHome)}
              className={styles["sidebar-bar-button"]}
              shadow
            />
            {/* <IconButton
              icon={<ChatGptIcon />}
              text={shouldNarrow ? undefined : "模型状态"}
              onClick={() => navigate(Path.ModelStatus)}
              className={styles["sidebar-bar-button"]}
              shadow
            /> */}
            <IconButton
              icon={<McpIcon />}
              text={shouldNarrow ? undefined : "推理服务"}
              onClick={() => navigate(Path.Inference)}
              className={styles["sidebar-bar-button"]}
              shadow
            />
            {isAdmin && (
              <>
                <IconButton
                  icon={<AddIcon />}
                  text={shouldNarrow ? undefined : "模型监控"}
                  onClick={() => navigate(Path.Dashboard)}
                  className={styles["sidebar-bar-button"]}
                  shadow
                />
                <IconButton
                  icon={<DiscoveryIcon />}
                  text={shouldNarrow ? undefined : "实时指标"}
                  onClick={() => navigate(Path.Grafana)}
                  className={styles["sidebar-bar-button"]}
                  shadow
                />
                <IconButton
                  icon={<SettingsIcon />}
                  text={shouldNarrow ? undefined : "用户管理"}
                  onClick={() => navigate(Path.UserManagement)}
                  className={styles["sidebar-bar-button"]}
                  shadow
                />
              </>
            )}
            <IconButton
              icon={<McpIcon />}
              text={shouldNarrow ? undefined : "Openclaw"}
              onClick={openOpenclaw}
              className={styles["sidebar-bar-button"]}
              shadow
            />
            <IconButton
              icon={<DragIcon />}
              text={shouldNarrow ? undefined : "样机展示"}
              onClick={() => navigate(Path.Showcase)}
              className={styles["sidebar-bar-button"]}
              shadow
            />
          </div>

          {/* 分割线 */}
          <div
            style={{
              height: "1px",
              background: "var(--border-in-light)",
              margin: "10px 20px",
              opacity: 0.5,
            }}
          />
        </div>

        {/* 可滚动聊天列表 */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <SideBarBody
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                navigate(Path.Home);
              }
            }}
          >
            {/* 聊天列表区 */}
            <ChatList narrow={shouldNarrow} />
          </SideBarBody>
        </div>
      </div>

      {/* 自定义底部布局，不使用SideBarTail */}
      <div
        style={{
          paddingTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "20px 10px 10px 10px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* 新建对话按钮 - 独占一行，居中，宽度增加，高度增加，文字加大加粗 */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <IconButton
            icon={<AddIcon />}
            text={shouldNarrow ? undefined : "新建对话"}
            onClick={() => {
              chatStore.newSession();
              navigate(Path.Chat);
            }}
            shadow
            style={{
              width: "80%",
              height: "48px",
              fontSize: "16px",
              fontWeight: "600",
            }}
          />
        </div>

        {/* 用户信息和登出按钮 - 同一行左右排布，固定宽度 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* 用户信息框 - 固定宽度，居中显示 */}
          <div
            style={{
              background: "white",
              borderRadius: "10px",
              padding: "10px 15px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
              width: "calc(100% - 90px)", // 总宽度减去登出按钮宽度和间距
              marginRight: "10px",
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "var(--text-color-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "center",
              }}
            >
              {accessStore.userSession?.user?.username}
              {accessStore.userSession?.user?.role === "admin" && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--primary)",
                    marginLeft: "4px",
                  }}
                >
                  管理员
                </span>
              )}
            </div>
          </div>

          {/* 登出按钮 - 靠右对齐，固定宽度 */}
          <IconButton
            icon={<SettingsIcon />}
            text={shouldNarrow ? undefined : "登出"}
            onClick={() => {
              accessStore.logout();
              navigate(Path.Auth);
            }}
            shadow
            style={{ width: "80px", flexShrink: 0 }}
          />
        </div>
      </div>
    </SideBarContainer>
  );
}
