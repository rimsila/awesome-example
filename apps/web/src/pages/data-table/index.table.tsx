import { ActionType, ProColumns } from "@ant-design/pro-components";

import { Form } from "antd";
import { useRef } from "react";
import { useReactive } from "ahooks";
import DataTable, { State } from "./table";

const Page = () => {
  const tblRef = useRef<ActionType>();
  const tblState = useReactive<State>({
    openCrudModal: false,
    crudType: "table",
  });
  const [tblForm] = Form.useForm<GithubIssueItem>();

  type GithubIssueItem = {
    url: string;
    id: number;
    number: number;
    title: string;
    labels: {
      name: string;
      color: string;
    }[];
    state: string;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at?: string;
  };

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: "序号",
      dataIndex: "index",
      width: 64,
      valueType: "indexBorder",
    },
    {
      title: "标题",
      dataIndex: "title",
      copyable: true,
      ellipsis: true,
      search: false,
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: (_, type) => (type === "table" ? "状态" : "列表状态"),
      dataIndex: "state",
      initialValue: "all",
      filters: true,
      onFilter: true,
      valueType: "select",
      valueEnum: {
        all: { text: "全部", status: "Default" },
        open: {
          text: "未解决",
          status: "Error",
        },
        closed: {
          text: "已解决",
          status: "Success",
        },
      },
    },
    {
      title: "排序方式",
      key: "direction",
      hideInTable: true,
      hideInDescriptions: true,
      dataIndex: "direction",
      filters: true,
      onFilter: true,
      valueType: "select",
      valueEnum: {
        asc: "正序",
        desc: "倒序",
      },
    },
  ];

  return (
    <>
      <DataTable<GithubIssueItem>
        actionRef={tblRef}
        crudProps={{
          form: tblForm,
          detailUrl: "https://proapi.azurewebsites.net/github/issues",
          editUrl: "https://proapi.azurewebsites.net/github/issues",
          listUrl: "https://proapi.azurewebsites.net/github/issues",
        }}
        columns={columns}
        state={tblState}
      />
    </>
  );
};
export default Page;
