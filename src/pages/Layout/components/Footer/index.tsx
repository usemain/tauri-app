import React, { useCallback } from "react";
import { Layout, Modal, Tooltip } from "@arco-design/web-react";
import { IconMoonFill, IconSunFill } from "@arco-design/web-react/icon";
import { Keys } from "../../../../constants/keywords";
import { COMMAND } from "../../../../constants/command";
import { invoke } from "@tauri-apps/api/core";
import styles from "./index.module.css";
import useSysStore from "../../../../store/sys";
import usePlatformKeys from "../../../../hooks/useKeyWords";

type FooterProps = {
  isDark: boolean;
};

const Footer: React.FC<FooterProps> = React.memo(({ isDark }) => {
  const sysStore = useSysStore();

  const setTheme = useCallback(() => {
    if (sysStore.platform === "windows") {
      Modal.confirm({
        title: "提示",
        content: "切换主题后需要重新启动!",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          invoke(COMMAND.SET_THEME, {
            theme: isDark ? "light" : "dark",
          });
        },
      });
      return;
    }
    const theme = isDark ? "light" : "dark";
    sysStore.setTheme(theme);
  }, [isDark]);

  return (
    <Layout.Footer>
      <div className={styles.footerContainer}>
        <span className={styles.copyrightText}>Copyright © 2024</span>
        <div onClick={setTheme}>
          <Tooltip
            position="tr"
            trigger="hover"
            content={`快捷键 ${usePlatformKeys(Keys.ALT_T)}`}
          >
            {isDark ? (
              <IconMoonFill
                fontSize={15}
                style={{
                  color: "#ffffff",
                }}
              />
            ) : (
              <IconSunFill
                fontSize={15}
                style={{
                  color: "#ffffff",
                }}
              />
            )}
          </Tooltip>
        </div>
      </div>
    </Layout.Footer>
  );
});

export default Footer;
