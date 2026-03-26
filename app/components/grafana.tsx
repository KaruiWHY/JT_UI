"use client";

import { useMemo, useState } from "react";
import { useAppConfig } from "../store/config";
import { IconButton } from "./button";

const DEFAULT_GRAFANA_URL = "http://192.168.1.37:3000/";

function normalizeUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return DEFAULT_GRAFANA_URL;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `http://${trimmed}`;
}

export function GrafanaPage() {
  const config = useAppConfig();
  const [inputUrl, setInputUrl] = useState(config.grafanaConfig.url);

  const iframeUrl = useMemo(() => {
    return normalizeUrl(config.grafanaConfig.url);
  }, [config.grafanaConfig.url]);

  const saveUrl = () => {
    const nextUrl = normalizeUrl(inputUrl);
    config.update((state) => {
      state.grafanaConfig.url = nextUrl;
    });
    setInputUrl(nextUrl);
  };

  const resetUrl = () => {
    config.update((state) => {
      state.grafanaConfig.url = DEFAULT_GRAFANA_URL;
    });
    setInputUrl(DEFAULT_GRAFANA_URL);
  };

  const openInNewTab = () => {
    window.open(iframeUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        height: "100%",
        padding: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          value={inputUrl}
          onChange={(e) => setInputUrl(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveUrl();
            }
          }}
          placeholder="Grafana URL，例如 http://localhost:3000"
          style={{
            flex: 1,
            minWidth: 260,
            height: 38,
            borderRadius: 10,
            border: "1px solid var(--border-in-light)",
            background: "var(--white)",
            color: "var(--black)",
            padding: "0 12px",
            outline: "none",
          }}
        />

        <IconButton text="保存" onClick={saveUrl} bordered />
        <IconButton text="重置" onClick={resetUrl} bordered />
        <IconButton text="新窗口打开" onClick={openInNewTab} bordered />
      </div>

      <div
        style={{
          height: "100%",
          minHeight: 300,
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid var(--border-in-light)",
          background: "var(--white)",
        }}
      >
        <iframe
          src={iframeUrl}
          title="Grafana Dashboard"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            background: "var(--white)",
          }}
        />
      </div>
    </div>
  );
}
