import EditFilled from "@ant-design/icons/EditFilled";
import EyeFilled from "@ant-design/icons/EyeFilled";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import DownOutlined from "@ant-design/icons/DownOutlined";

import {
  ActionType,
  BetaSchemaForm as SchemaForm,
  ProDescriptions,
  ProTable,
  TableDropdown,
  ProColumns,
} from "@ant-design/pro-components";
import {
  Button,
  Modal,
  Popconfirm,
  Row,
  message,
  theme,
  Skeleton,
  Space,
  Dropdown,
} from "antd";
import { MutableRefObject, Ref, useMemo, useRef } from "react";
import { useLockFn, useMemoizedFn } from "ahooks";
import { IDataTable } from "./type";
import Print from "@/utils/print";

const DataTable = <
  TData extends Record<any, any>,
  TDataList,
  TEditData = Record<any, any>,
  TDetail = any
>(
  props: IDataTable.PageProps<TData, TDataList, TEditData, TDetail>
) => {
  const {
    toolBarProps,
    state,
    crudProps,
    columns,
    columnsOptions,
    axios,
    ...tblProProps
  } = props;
  const listActionRef = tblProProps.actionRef as MutableRefObject<ActionType>;

  const {
    actionsRender = [],
    actionColProps = {},
    resDetailFieldKey = ["data"],
    resListFiledKey = ["data"],
    listTotal,
    listResponse,
    listConfigs,
    editResponse,
    editConfigs,
    deleteUrl,
    crudId = "id",
    onModeChange,
    addConfigs,
    viewConfigs,
  } = crudProps || {};

  const detailRef = useRef<ActionType>();
  const { token } = theme.useToken();

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

  const setCrudMode = useMemoizedFn(
    (type: IDataTable.CrudType | "reset", row: Partial<TData>) => {
      state.row = row;

      if (type === "view") {
        detailRef.current?.reload();
      }
      if (type === "reset") {
        state.openCrudModal = false;
        state.row = {};
        state.crudType = "table";
        crudProps.form.resetFields();
      } else {
        state.openCrudModal = true;
        state.crudType = type;
      }
      // callback fn every mode change
      onModeChange?.(state);
    }
  );

  const onClickEdit = useMemoizedFn((row: TData) => {
    setCrudMode("edit", row);
    if (editConfigs) {
      state.loadingEdit = true;
      axios
        .request({ method: "get", ...editConfigs(row) })
        .then((res) => {
          const getRes = editResponse?.(res) as any;
          console.log("getRes", getRes);
          crudProps.form.setFieldsValue(getRes);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          state.loadingEdit = false;
        });
    } else {
      crudProps.form.setFieldsValue(editResponse?.(row as any) as any);
    }
  });

  const onClickDelete = (row: TEditData) => {
    if (deleteUrl) {
      state.loadingDelete = true;
      axios
        .delete(deleteUrl(row))
        .then(() => {
          message.success("Delete operation successfully");
        })
        .catch((err) => {
          console.error(err);
          const errMsg = err.message || "Delete operation failed";
          message.error(errMsg);
        })
        .finally(() => {
          listActionRef.current.reload();
          state.loadingDelete = false;
        });
    }
  };

  const getColumns = useMemo(() => {
    const allCols = [
      ...columns.map((colItem) => ({ ...colItem, ...columnsOptions })),
      {
        fixed: "right",
        title: "Actions",
        align: "center",
        width: 110,
        hideInReport: true,
        valueType: "option",
        className: "print:hidden block",
        render: (_, row) => {
          return [
            <Button
              shape="circle"
              key="view"
              size="small"
              onClick={() => setCrudMode("view", row)}
            >
              <EyeFilled style={{ color: token.colorInfo, fontSize: 20 }} />
            </Button>,
            <Button
              type="primary"
              shape="circle"
              key="edit"
              size="small"
              loading={
                state.loadingEdit && row?.[crudId] === state?.row?.[crudId]
              }
              onClick={() => onClickEdit(row)}
            >
              <EditFilled style={{ color: "white", fontSize: 15 }} />
            </Button>,
            <TableDropdown
              key="more"
              menus={[
                {
                  disabled: state.loadingDelete,
                  key: "delete",
                  name: (
                    <Popconfirm
                      title="Are you sure to delete?"
                      onConfirm={() => onClickDelete(row as any)}
                    >
                      <DeleteOutlined
                        style={{
                          color: token.colorError,
                          fontSize: token.fontSizeLG,
                        }}
                      />
                    </Popconfirm>
                  ),
                },
              ]}
            />,
            ...actionsRender,
          ].filter(Boolean);
        },
        ...actionColProps,
      },
    ] as IDataTable.CustomColumns<TData, "text">[];

    if (state.openReport) {
      return allCols?.filter((i) => !i.hideInReport);
    }
    return allCols;
  }, [columns, columnsOptions]);

  const onFinishAddOrEdit = useMemoizedFn(async (values: TEditData) => {
    const isAddMode = state.crudType === "add";
    if (addConfigs && isAddMode) {
      state.loadingAdd = true;
      const getConfigs = addConfigs(values);
      axios
        .request({
          method: "post",
          params: { ...values },
          ...getConfigs,
        })
        .catch(console.error)
        .finally(() => {
          listActionRef.current.reload();
          state.loadingAdd = false;
          setCrudMode("reset", {});
        });
    }
    // edit mode
    else {
      state.loadingEditSubmit = true;
      axios
        .request({
          method: "put",
          ...editConfigs(state.row as any, values),
        })
        .catch(console.error)
        .finally(() => {
          listActionRef.current.reload();
          state.loadingEditSubmit = false;
          setCrudMode("reset", {});
        });
    }
  });

  const requestView = useLockFn(async (...args) => {
    const response = await axios(viewConfigs(state?.row, args));
    const getRes = resDetailFieldKey.reduce(
      (obj, level) => obj[level],
      response.data
    );
    return {
      data: getRes || [],
      success: true,
    };
  });

  return (
    <>
      {(isAddMode || (isEditMode && !state.loadingEdit)) && (
        <SchemaForm<TEditData>
          onFinish={onFinishAddOrEdit}
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
        width="60%"
        title="View Mode"
        onCancel={() => setCrudMode("reset", {})}
      >
        <ProDescriptions
          actionRef={detailRef}
          columns={columns as any}
          title="columns"
          request={requestView}
        />
      </Modal>

      <ProTable<TData>
        id="data-table"
        search={{
          labelWidth: "auto",
        }}
        beforeSearchSubmit={(params) => {
          const { pageSize, _timestamp, ...filter } = params || {};
          state.filter = { ...(filter as TData) };
          listActionRef.current?.reload();
        }}
        columns={getColumns}
        request={async (params, ...args) => {
          const response = await axios.request(
            listConfigs({ ...params, ...state.filter }, ...args)
          );
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
        options={{
          fullScreen: true,
          setting: { draggable: true },
        }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: true }}
        rowKey="id"
        dateFormatter="string"
        headerTitle="Data Table"
        toolBarRender={() =>
          [
            <Dropdown
              key="export"
              onOpenChange={(open) => {
                state.openReport = false;
              }}
              menu={{
                items: [
                  {
                    key: "1",
                    label: "Excel",
                  },
                  {
                    label: "PDF",
                    key: "2",
                  },
                  {
                    label: "PDF (Print)",
                    key: "3",
                    onClick: () => {
                      state.openReport = true;
                      setTimeout(() => {
                        Print(document.getElementById("data-table"));
                      }, 500);
                    },
                  },
                ],
              }}
              trigger={["click"]}
            >
              <Button>
                <Space>
                  Export
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>,
            <Button
              key={"crud"}
              type="primary"
              onClick={() => {
                if (toolBarProps?.onAddClick) {
                  toolBarProps?.onAddClick();
                } else {
                  setCrudMode("add", {});
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
