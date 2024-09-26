import React, { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout, Modal } from "@arco-design/web-react";
import { ITheme } from "../../typings/types";
import { useHotkeys } from "react-hotkeys-hook";
import { Keys } from "../../constants/keywords";
import { invoke } from "@tauri-apps/api/core";
import { COMMAND } from "../../constants/command";
import useSysStore from "../../store/sys";
import styles from "./index.module.css";
import Home from "../Home";
import Settings from "../Settings";
import Footer from "./components/Footer";
import Header from "./components/Header";


const Index: React.FC = () => {
  const sysStore = useSysStore();
  const [isChangingTheme, setIsChangingTheme] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      invoke(COMMAND.GET_THEME)
        .then((res) => {
          sysStore.setTheme(res as ITheme);
        })
        .catch(() => {
          const res = localStorage.getItem("theme");
          if (res) {
            sysStore.setTheme(res as ITheme);
          } else {
            sysStore.setTheme("auto");
          }
        });
    }, 1500);
  }, []);

  const theme = useMemo(() => {
    return sysStore.theme;
  }, [sysStore.theme]);

  useHotkeys(Keys.ALT_T, () => {
    if (sysStore.platform === "windows") {
      if (isChangingTheme) return;
      setIsChangingTheme(true);
      Modal.confirm({
        title: "提示",
        content: "切换主题后应用需要重新启动!",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          invoke(COMMAND.SET_THEME, {
            theme: sysStore.theme === "dark" ? "light" : "dark",
          });
        },
        onCancel() {
          setIsChangingTheme(false);
        },
      });
      return;
    }
    sysStore.toogleTheme();
  });

  return (
    <>
      {theme === undefined ? (
        <div className={styles.dot_container}>
          <div className={styles.dot_spinner}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={styles.dot_spinner_dot} />
            ))}
          </div>
        </div>
      ) : (
        <Layout className={styles.container}>
          <Header isDark={theme === "dark"} />
          <Layout>
            <Layout.Content>
              <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout.Content>
          </Layout>
          <Footer isDark={theme === "dark"} />
        </Layout>
      )}
    </>
  );
};

export default Index;
