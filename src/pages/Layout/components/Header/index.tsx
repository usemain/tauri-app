import { Layout } from "@arco-design/web-react";
import React, { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.css";

type HeaderProps = {
  isDark: boolean;
};

type MenuItem = "home" | "settings";

type MenuItemType = {
  label: string;
  key: MenuItem;
};

const menuData: MenuItemType[] = [
  {
    label: "首页",
    key: "home",
  },
  {
    label: "设置",
    key: "settings",
  },
];

const Header: React.FC<HeaderProps> = React.memo(({ isDark }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const setMenuTextActiveColor = useCallback(
    (isActive: boolean) => {
      if (isActive) {
        return isDark ? "#3c7eff" : "#0e5df6";
      }
      return isDark ? "#929292" : "#4e5969";
    },
    [isDark]
  );

  const active = useMemo(() => {
    const path = location.pathname.split("/")[1];
    return path === "" ? "home" : path;
  }, [location.pathname]);

  const onClickMenuItem = useCallback((e: MenuItem) => {
    navigate(e);
  }, []);

  return (
    <Layout className={styles.layoutContainer}>
      <div
        data-tauri-drag-region
        className={styles.menuContainer}
        style={{
          background: isDark ? "#0b0b0b" : "#e1e5ec",
        }}
      >
        {menuData.map((item, index) => (
          <div
            key={index}
            onClick={() => onClickMenuItem(item.key)}
            className={styles.menuItem}
            style={{
              color: setMenuTextActiveColor(active === item.key),
              background:
                active === item.key
                  ? isDark
                    ? "#1e1e1e"
                    : "#ffffff"
                  : "transparent",
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </Layout>
  );
});

export default Header;
