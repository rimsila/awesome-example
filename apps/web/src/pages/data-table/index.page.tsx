import { PageContainer } from "@ant-design/pro-components";
import dynamic from "next/dynamic";
const DataTable = dynamic(() => import("./index.table"), { ssr: false });

const IndexPage = () => {
  return <PageContainer>
    <DataTable />
  </PageContainer>
};

export default IndexPage;
