import { ActionType, ProColumns } from "@ant-design/pro-components";

import { Form } from "antd";
import { useEffect, useRef } from "react";
import { useReactive } from "ahooks";
import DataTable from "./table";
import { IDataTable, LiteralUnion } from "./type";

const Page = () => {
  const tblRef = useRef<ActionType>();
  const tblState = useReactive<IDataTable.State<IDataTable.Data>>({
    openCrudModal: false,
    crudType: "table",
    row: {},
  });
  const [editForm] = Form.useForm<IDataTable.Data>();

  const columns: Array<
    Omit<ProColumns<IDataTable.Data>, "dataIndex"> & {
      dataIndex: LiteralUnion<keyof IDataTable.Data, string>;
    }
  > = [
    {
      title: "ID",
      dataIndex: "id",
      width: 64,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  console.log("state", tblState);

  return (
    <>
      <DataTable<
        IDataTable.Data[],
        IDataTable.RootObject,
        IDataTable.EditObject
      >
        actionRef={tblRef}
        crudProps={{
          form: editForm,
          onModeChange(row) {},
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
            return res.data.data;
          },
        }}
        columns={columns}
        state={tblState}
      />
    </>
  );
};
export default Page;
