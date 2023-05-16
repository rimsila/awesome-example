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
} from "@ant-design/pro-components";
import { Button, FormInstance, Modal } from "antd";
import { useMemo, useRef } from "react";
import axios from "axios";

type ToolBarProps<TData> = {
  onAddClick?: (v?: TData) => void;
};

type CrudType = "view" | "edit" | "table" | "add";

export type State<TState = Record<string, any>> = {
  openCrudModal?: boolean;
  loadingEdit?: boolean;
  crudType: CrudType;
} & TState;

export type PageProps<TData, TDetail = any> = {
  state: State;
  crudProps: {
    form: FormInstance<TData>;
    editUrl?: string;
    detailUrl?: string;
    listUrl?: string;
    actionsRender?: any[];
    actionColProps?: ProColumns<TData, "text">;
  };
  toolBarProps?: ToolBarProps<TData>;
} & React.ComponentProps<typeof ProTable<TData>>;

const DataTable = <TData extends any, TDetail = unknown>(
  props: PageProps<TData, TDetail>
) => {
  const { toolBarProps, state, crudProps, columns, ...tblProProps } = props;

  const { actionsRender = [], actionColProps = {} } = crudProps || {};
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
    }
  }, [state.openCrudModal, state.crudType]);

  const setCrudTypeAndModal = (type: CrudType | "reset") => {
    if (type === "reset") {
      state.openCrudModal = false;
      state.crudType = "table";
    } else {
      state.openCrudModal = true;
      state.crudType = type;
    }
  };

  const onClickEdit = (row: any) => {
    setCrudTypeAndModal("edit");
    if (crudProps.editUrl) {
      state.loadingEdit = true;
      axios
        .get(crudProps.editUrl)
        .then((res) => {
          const getInd = (res?.data?.data ?? ([] as any[])).findIndex(
            (item) => item.id === row.id
          );
          crudProps.form.setFieldsValue(res?.data?.data[getInd] || {});
        })
        .catch(console.error)
        .finally(() => {
          state.loadingEdit = false;
        });
    } else {
      crudProps.form.setFieldsValue(row);
    }
  };

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
    ] as typeof columns
  }, [columns]);

  return (
    <>
      {(isAddMode || isEditMode) && (
        <SchemaForm<TData>
          form={crudProps.form}
          columns={columns as any}
          loading={state.loadingEdit}
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
          request={async (params = {}) =>
            (
              await axios(crudProps.detailUrl, {
                params,
              })
            ).data.data
          }
        />
      </Modal>

      <ProTable<TData>
        search={{
          labelWidth: "auto",
        }}
        columns={getColumns as any}
        request={async (params = {}) =>
          (
            await axios(crudProps?.listUrl, {
              params,
            })
          ).data
        }
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