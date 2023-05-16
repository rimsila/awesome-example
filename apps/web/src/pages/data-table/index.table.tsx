import { ActionType, ProColumns } from "@ant-design/pro-components";

import { Form } from "antd";
import { useEffect, useRef } from "react";
import { useReactive } from "ahooks";
import DataTable, { State } from "./table";

interface Link {
  previous?: any;
  current: string;
  next: string;
}

interface Pagination {
  total: number;
  pages: number;
  page: number;
  limit: number;
  links: Link;
}

interface Meta {
  pagination: Pagination;
}

interface Data {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}

interface RootObject {
  meta: Meta;
  data: Data[];
}
interface EditObject {
  meta: Meta;
  data: Data;
}

const Page = () => {
  const tblRef = useRef<ActionType>();
  const tblState = useReactive<State<Data>>({
    openCrudModal: false,
    crudType: "table",
    row: {},
  });
  const [editForm] = Form.useForm<Data>();

  const columns: ProColumns<Data[]>[] = [
    {
      title: "ID",
      dataIndex: "id",
      width: 64,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
  ];

  console.log("state", tblState);

  return (
    <>
      <DataTable<Data[], RootObject, EditObject>
        actionRef={tblRef}
        crudProps={{
          form: editForm,
          listResponse(res) {
            return {
              data: res?.data?.data || [],
              success: true,
            };
          },
          detailUrl: "https://proapi.azurewebsites.net/github/issues",
          editUrl: ({ id }) => `https://gorest.co.in/public/v1/users/${id}`,
          listUrl: "https://gorest.co.in/public/v1/users",
          editResponse(res) {
            console.log("editResponse", res.data.data);
            return  res.data.data
          },
        }}
        columns={columns}
        state={tblState}
      />
    </>
  );
};
export default Page;
