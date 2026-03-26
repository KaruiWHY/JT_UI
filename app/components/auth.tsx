import styles from "./auth.module.scss";
import { IconButton } from "./button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { getClientConfig } from "../config/client";
import { PasswordInput } from "./ui-lib";
import { LoginRequest } from "../types/auth";

export function AuthPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getClientConfig()?.isApp) {
      navigate(Path.Settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("请输入用户名和密码");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        } as LoginRequest),
      });

      const data = await response.json();

      if (data.success) {
        // 存储登录信息到本地存储
        localStorage.setItem("userSession", JSON.stringify({
          token: data.token,
          user: data.user
        }));
        navigate(Path.Chat);
      } else {
        setError(data.error || "登录失败");
      }
    } catch (err) {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["auth-page"]}>
      <div className={styles["auth-logo"]}>
        <img src="/big-ferrosemi-en&cn-blue.svg" alt="Logo" style={{ width: "100px", height: "100px" }} />
      </div>

      <div className={styles["auth-title"]}>用户登录</div>
      <div className={styles["auth-tips"]}>请输入您的用户名和密码</div>

      {error && <div className={styles["auth-error"]}>{error}</div>}

      <PasswordInput
        style={{ marginTop: "3vh", marginBottom: "3vh" }}
        aria-label="用户名"
        value={username}
        type="text"
        placeholder="用户名"
        onChange={(e) => {
          setUsername(e.currentTarget.value);
          setError("");
        }}
      />

      <PasswordInput
        style={{ marginTop: "3vh", marginBottom: "3vh" }}
        aria-label="密码"
        value={password}
        type="password"
        placeholder="密码"
        onChange={(e) => {
          setPassword(e.currentTarget.value);
          setError("");
        }}
      />

      <div className={styles["auth-actions"]}>
        <IconButton
          text={loading ? "登录中..." : "登录"}
          type="primary"
          onClick={handleLogin}
          disabled={loading}
        />
      </div>
    </div>
  );
}
