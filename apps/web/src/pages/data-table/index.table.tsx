import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Form } from "antd";
import { useRef } from "react";
import { useReactive } from "ahooks";
import DataTable from "./table";
import { IDataTable, LiteralUnion } from "./type";
import { axiosInstance } from "../../utils/request";

const Page = () => {
  const tblRef = useRef<ActionType>();
  const tblState = useReactive<IDataTable.State<IDataTable.Data>>({
    openCrudModal: false,
    crudType: "table",
    row: {},
    filter: {},
  });
  const [editForm] = Form.useForm<IDataTable.Data>();

  const columns: Array<
    Omit<ProColumns<IDataTable.Data[]>, "dataIndex"> & {
      dataIndex: LiteralUnion<keyof IDataTable.Data, string>;
    }
  > = [
    {
      title: "ID",
      dataIndex: "id",
      width: 64,
      hideInForm: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      formItemProps: {
        rules: [{ required: true }],
      },
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

  return (
    <>
      <DataTable<
        IDataTable.Data[],
        IDataTable.RootObject,
        IDataTable.EditObject
      >
        axios={axiosInstance}
        actionRef={tblRef}
        columns={columns}
        state={tblState}
        crudProps={{
          form: editForm,
          listResponse: (res) => ({
            data: res?.data?.data || [],
            total: res?.data.meta.pagination.total,
          }),
          listConfigs: ({ pageSize, current, ...filter }) => ({
            url: "/users",
            params: {
              per_page: pageSize,
              page: current,
              ...filter,
            },
          }),
          addConfigs: (params) => {
            return {
              url: "/users",
              params,
            };
          },
          editConfigs: (row, data) => {
            return {
              url: `/users/${row.id}`,
              data,
            };
          },
          editResponse: (res) => res.data.data,
          deleteUrl: ({ id }) => `/users/${id}`,
          viewConfigs: (row) => ({
            url: `/users/${row?.id}`,
          }),
        }}
      />
    </>
  );
};
export default Page;
