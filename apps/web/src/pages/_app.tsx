import { useRouter } from "next/router";
import "../styles/globals.css";
import 'antd/dist/reset.css'

import type { AppProps } from "next/app";

const IconBack = () => {
  const { back, pathname } = useRouter();
  if (pathname === "/") return null;
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

export default function MyApp({ Component, ...rest }: AppProps) {
  const { title = "" } = (rest?.router as any).state?.query || {};

  return (
    <div className="flex flex-col h-screen w-full max-w-xl mx-auto bg-white">
      <div className="flex items-center bg-pink-200 p-4">
        <IconBack />
        <h1 className="flex-1 text-xl font-bold text-center">
          {`Awesome App ${title && `- ${title}`}`}
        </h1>
      </div>
      <Component {...rest} />
    </div>
  );
}
