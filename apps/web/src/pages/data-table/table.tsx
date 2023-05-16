import EditFilled from "@ant-design/icons/EditFilled";
import EyeFilled from "@ant-design/icons/EyeFilled";
import PlusOutlined from "@ant-design/icons/PlusOutlined";

import {
  ActionType,
  BetaSchemaForm as SchemaForm,
  ProColumns,
  ProDescriptions,
  ProTable,
  TableDropdown,
  RequestData,
} from "@ant-design/pro-components";
import { Button, FormInstance, Modal } from "antd";
import { useMemo, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import { useMemoizedFn } from "ahooks";

type ToolBarProps<TData> = {
  onAddClick?: (v?: TData) => void;
};

type CrudType = "view" | "edit" | "table" | "add";

export type State<TEditData> = {
  openCrudModal?: boolean;
  loadingEdit?: boolean;
  crudType: CrudType;
  row?: Partial<TEditData>;
};

export type PageProps<
  TData,
  TDataList,
  TEditData = Record<any, any>,
  TDetail = any
> = {
  state: State<TData>;
  crudProps: {
    form: FormInstance<TEditData>;
    editUrl?: (row: TEditData) => string;
    detailUrl?: string;
    listUrl?: string;
    actionsRender?: any[];
    actionColProps?: ProColumns<TData, "text">;
    resDetailFieldKey?: string[];
    resListFiledKey?: string[];
    listTotal?: number;
    listResponse?: (res?: AxiosResponse<TDataList, any>) => RequestData<any>;
    editResponse?: (res?: AxiosResponse<TEditData, any>) => any;
    detailResponse?: (res?: AxiosResponse<TDetail, any>) => Partial<TDetail>;
  };
  toolBarProps?: ToolBarProps<TData>;
} & React.ComponentProps<typeof ProTable<TData>>;

const DataTable = <
  TData,
  TDataList,
  TEditData = Record<any, any>,
  TDetail = any
>(
  props: PageProps<TData, TDataList, TEditData, TDetail>
) => {
  const { toolBarProps, state, crudProps, columns, ...tblProProps } = props;

  const {
    actionsRender = [],
    actionColProps = {},
    resDetailFieldKey = ["data"],
    resListFiledKey = ["data"],
    listTotal,
    listResponse,
    editResponse,
    editUrl,
  } = crudProps || {};
  const detailRef = useRef<ActionType>();

  const { isEditMode, isViewMode, isAddMode } = useMemo(() => {
    const openCrudModal = state.openCrudModal;
    const crudType = state.crudType;
    const modes = {
      edit: openCrudModal && crudType === "edit",
      view: openCrudModal && crudType === "view",
      add: openCrudModal && crudType === "add",
    };
    return {
      isEditMode: modes.edit,
      isViewMode: modes.view,
      isAddMode: modes.add,
    };
  }, [state.openCrudModal, state.crudType]);

  const setCrudTypeAndModal = (type: CrudType | "reset", row = {}) => {
    state.row = row;
    if (type === "reset") {
      state.openCrudModal = false;
      state.crudType = "table";
    } else {
      state.openCrudModal = true;
      state.crudType = type;
    }
  };

  const onClickEdit = useMemoizedFn((row: TData) => {
    setCrudTypeAndModal("edit", row);
    if (editUrl(row as any)) {
      state.loadingEdit = true;
      axios
        .get(editUrl(row as any))
        .then((res) => {
          const getRes = editResponse(res) as any;
          console.log("getRes", getRes);
          crudProps.form.setFieldsValue(getRes);
        })
        .catch(console.error)
        .finally(() => {
          state.loadingEdit = false;
        });
    } else {
      crudProps.form.setFieldsValue(editResponse(row as any) as any);
    }
  });

  const getColumns = useMemo(() => {
    return [
      ...columns,
      {
        fixed: "right",
        title: "Actions",
        align: "center",
        width: 110,
        valueType: "option",
        dataIndex: "id",
        render: (text, row) =>
          [
            <Button
              shape="circle"
              key="view"
              size="small"
              onClick={() => setCrudTypeAndModal("view")}
            >
              <EyeFilled style={{ color: "#1677ff", fontSize: 20 }} />
            </Button>,
            <Button
              type="primary"
              shape="circle"
              key="edit"
              size="small"
              loading={state.loadingEdit}
              onClick={() => onClickEdit(row)}
            >
              <EditFilled style={{ color: "white", fontSize: 15 }} />
            </Button>,
            <TableDropdown
              key="more"
              menus={[{ key: "delete", name: "Delete" }]}
            />,
            ...actionsRender,
          ].filter(Boolean),
        ...actionColProps,
      },
    ] as typeof columns;
  }, [columns]);

  return (
    <>
      {(isAddMode || (isEditMode && !state.loadingEdit)) && (
        <SchemaForm<TData>
          form={crudProps.form as any}
          columns={columns as any}
          layoutType="ModalForm"
          open={state.openCrudModal}
          modalProps={{
            onCancel(_) {
              state.openCrudModal = false;
            },
          }}
        />
      )}
      <Modal
        open={isViewMode}
        title="View Mode"
        onCancel={() => setCrudTypeAndModal("reset")}
      >
        <ProDescriptions
          actionRef={detailRef}
          columns={columns as any}
          title="columns"
          request={async (params = {}) => {
            const response = await axios(crudProps.detailUrl, { params });
            console.log("response", response);
            return resDetailFieldKey.reduce(
              (obj, level) => obj[level],
              response.data
            );
          }}
        />
      </Modal>

      <ProTable<TData>
        search={{
          labelWidth: "auto",
        }}
        columns={getColumns as any}
        request={async (params = {}) => {
          const response = await axios(crudProps.listUrl, { params });
          if (listResponse) {
            const getVal = listResponse?.(response);
            return getVal;
          }
          const getRes = resListFiledKey.reduce(
            (obj, level) => obj[level],
            response
          );
          console.log("list response", getRes);
          return {
            data: getRes || [],
            success: true,
            total: listTotal,
          };
        }}
        pagination={{
          pageSize: 20,
        }}
        rowKey="id"
        dateFormatter="string"
        headerTitle="Data Table"
        toolBarRender={() =>
          [
            <Button
              key={"crud"}
              type="primary"
              onClick={() => {
                if (toolBarProps?.onAddClick) {
                  toolBarProps?.onAddClick();
                } else {
                  setCrudTypeAndModal("add");
                }
              }}
              icon={<PlusOutlined />}
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

export default DataTable;
