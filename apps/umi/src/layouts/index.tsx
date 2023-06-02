import { Link, Outlet } from "umi";
import styles from "./index.less";
import enUSIntl from "antd/lib/locale/en_US";
import { ConfigProvider } from "antd";

export default function Layout() {
  return (
    <ConfigProvider locale={enUSIntl}>
      <div className={styles.navs}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/docs">Data Table</Link>
          </li>
          <li>
            <a href="https://github.com/umijs/umi">Github</a>
          </li>
        </ul>
        <Outlet />
      </div>
    </ConfigProvider>
  );
}
