import dynamic from "next/dynamic";

const DataTable = dynamic(() => import("./index.table"), { ssr: false });

const IndexPage = () => {
  return <DataTable />;
};

export default IndexPage;
