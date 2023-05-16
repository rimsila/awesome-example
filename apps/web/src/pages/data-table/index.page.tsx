import dynamic from "next/dynamic";

const DataTable = dynamic(() => import("./index.table"));

const IndexPage = () => {
  return <DataTable />;
};

export default IndexPage;
