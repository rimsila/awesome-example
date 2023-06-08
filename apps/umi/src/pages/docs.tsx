import { ActionType } from "@ant-design/pro-components";
import { Form } from "antd";
import { useRef } from "react";
import { useReactive } from "ahooks";
import DataTable from "@/components/data-table";
import { axiosInstance } from "@/utils/request";
import { IDataTable, LiteralUnion } from "@/components/data-table/type";

const Page = () => {
  const tblRef = useRef<ActionType>();
  const tblState = useReactive<IDataTable.State<IDataTable.Data>>({
    openCrudModal: false,
    crudType: "table",
    row: {},
  });
  const [editForm] = Form.useForm<IDataTable.Data>();

  const columns: Array<
    Omit<IDataTable.CustomColumns<IDataTable.Data, "id">, "dataIndex"> & {
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
      formItemProps: {
        rules: [{ required: true }],
      },
      valueEnum: {
        male: {
          text: "Male",
          status: "male",
        },
        female: {
          text: "Female",
          status: "female",
        },
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      formItemProps: {
        rules: [{ required: true }],
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      formItemProps: {
        rules: [{ required: true }],
      },
      valueEnum: {
        active: {
          text: "Active",
          status: "active",
        },
        inactive: {
          text: "Inactive",
          status: "inactive",
        },
      },
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
          // addEditProps
          addEditProps: {
            title: "Create User",
            addConfigs: (params) => {
              return {
                url: "/users",
                params,
              };
            },
            editTitle: `Edit user: ${tblState?.row?.name}`,
            editConfigs: (row, data) => {
              return {
                url: `/users/${row.id}`,
                data,
              };
            },
            editResponse: (res) => res.data.data,
          },
          // view props
          detailProp: {
            detailTitle: `Detail user: ${tblState?.row?.name}`,
            viewConfigs: (row) => ({
              url: `/users/${row?.id}`,
            }),
          },
          exportProps: {
            filename: "user_report",
            exportResponseData: (res) => ({
              data: res?.data?.data || [],
              total: res?.data.meta.pagination.total,
            }),
          },
          listProps: {
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
          },
          deleteUrl: ({ id }) => `/users/${id}`,
        }}
      />
    </>
  );
};
export default Page;
