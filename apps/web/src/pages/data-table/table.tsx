import { PlusOutlined } from "@ant-design/icons";

import {
  ActionType,
  BetaSchemaForm as SchemaForm,
  ProColumns,
  ProForm,
  ProFormInstance,
} from "@ant-design/pro-components";
import {
  ProCard,
  ProDescriptions,
  ProTable,
  TableDropdown,
} from "@ant-design/pro-components";
import {
  Button,
  Form,
  FormInstance,
  message,
  Modal,
  Space,
  Tabs,
  Tag,
} from "antd";
import { useRef, useState } from "react";
import axios from "axios";
import { NamePath } from "antd/es/form/interface";
import { useReactive } from "ahooks";

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
  {
    title: "标签",
    dataIndex: "labels",
    width: 120,
    render: (_, row) => (
      <Space>
        {row.labels.map(({ name, color }) => (
          <Tag color={color} key={name}>
            {name}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: "option",
    valueType: "option",
    dataIndex: "id",
    render: (text, row) => [
      <a href={row.url} key="show" target="_blank" rel="noopener noreferrer">
        查看
      </a>,
      <TableDropdown
        key="more"
        onSelect={(key) => message.info(key)}
        menus={[
          { key: "copy", name: "复制" },
          { key: "delete", name: "删除" },
        ]}
      />,
    ],
  },
];


type ListProps = {
  url: string;
  baseURL?: string;
};

type ToolBarProps<TData> = {
  onAddClick?: (v: TData) => void;
};

export type TblState<TState = Record<string, any>> = {
  openCrudModal: boolean;
} & TState;

type PageProps<TData, TState> = {
  tblState: TblState<TState>;
  listProps: ListProps;
  crudProps: {
    form: FormInstance<TData>;
  };
  toolBarProps?: ToolBarProps<TData>;
} & React.ComponentProps<typeof ProTable<TData>>;

const DataTable = <TData extends any, TState = any>(
  props: PageProps<TData, TState>
) => {
  const { listProps, toolBarProps, tblState, crudProps, ...tblProProps } =
    props;
  console.log("tblState", tblState);
  const crudFromValues = crudProps?.form?.getFieldsValue();

  return (
    <>
      {tblState.openCrudModal && (
        <SchemaForm<TData>
          form={crudProps.form}
          open={true}
          modalProps={{
            onCancel: () => (tblState.openCrudModal = false),
          }}
          layoutType="ModalForm"
          columns={tblProProps.columns as any}
        />
      )}
      <ProTable<TData>
        request={async (params = {}) =>
          (
            await axios(listProps?.url, {
              params,
            })
          ).data
        }
        pagination={{
          pageSize: 5,
        }}
        rowKey="id"
        dateFormatter="string"
        headerTitle="查询 Table"
        toolBarRender={() =>
          [
            <Button
              key={"crud"}
              onClick={() => {
                if (toolBarProps?.onAddClick) {
                  toolBarProps?.onAddClick(crudFromValues);
                } else {
                  tblState.openCrudModal = true;
                  console.log("dd");
                  crudProps?.form.setFieldsValue(crudFromValues);
                }
              }}
            >
              Add
            </Button>,
          ].filter(Boolean)
        }
        {...tblProProps}
      />
    </>
  );
};

const Page = () => {
  const tblRef = useRef<ActionType>();
  const tblState = useReactive<TblState>({ openCrudModal: false });
  const [tblForm] = Form.useForm<GithubIssueItem>();

  return (
    <>
      <DataTable<GithubIssueItem>
        actionRef={tblRef}
        crudProps={{
          form: tblForm,
        }}
        columns={columns}
        listProps={{
          url: "https://proapi.azurewebsites.net/github/issues",
        }}
        tblState={tblState}
      />
    </>
  );
};
export default Page;
