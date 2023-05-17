import { useRouter } from "next/router";
import "../styles/globals.css";
import "antd/dist/reset.css";
import { ConfigProvider } from 'antd';

import type { AppProps } from "next/app";
import classNames from "classnames";
import enUSIntl from 'antd/lib/locale/en_US';
import km_KHIntl from 'antd/lib/locale/km_KH';

const intlMap = {
  enUSIntl,
  km_KHIntl
};

const IconBack = () => {
  const { back, pathname } = useRouter();
  if (pathname === "/") return <div />;
  return (
    <svg
      onClick={back}
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 bg-red-50 rounded-md cursor-pointer hover:opacity-80"
      viewBox="0 0 24 24"
    >
      <path d="M20.29 11H7.707l3.147-3.146a.999.999 0 0 0-1.414-1.414l-4.242 4.242a.999.999 0 0 0 0 1.414l4.242 4.243a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L7.707 13h12.583c.553 0 1-.448 1-1s-.447-1-1-1z" />
    </svg>
  );
};

const Header = ({ title }: { title: any }) => {
  return (
    <div className="flex items-center justify-between bg-pink-200 p-4">
      <IconBack />
      <div className="flex flex-col text-center justify-center">
        <h1 className="flex-1 text-xl font-bold text-center m-0">
          {`Awesome App ${title && `- ${title}`}`}
        </h1>
        <p className="m-0 text-xs text-gray-600">
          (All in one React collection demo)
        </p>
      </div>
      <div />
    </div>
  );
};

export default function MyApp({ Component, ...rest }: AppProps) {
  const { title = "", pageFull } = (rest?.router as any).state?.query || {};

  const clsWrapper = classNames(
    "flex flex-col h-screen w-full mx-auto bg-white",
    pageFull != "1" && "max-w-xl"
  );

  return (
    <ConfigProvider locale={intlMap['enUSIntl']}>
      <div className={clsWrapper}>
        <Header title={title} />
        <Component {...rest} />
      </div>
    </ConfigProvider>
  );
}
