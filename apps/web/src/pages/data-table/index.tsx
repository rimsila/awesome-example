import dynamic from "next/dynamic";

const ComponentWithNoSSR = dynamic(() => import("./table"), {
  ssr: false,
});
export default ComponentWithNoSSR;
