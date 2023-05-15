import { EditFilled, EyeFilled, PlusOutlined } from "@ant-design/icons";

import {
  ActionType,
  BetaSchemaForm as SchemaForm,
  ProColumns,
  ProDescriptions,
  ProTable,
  TableDropdown,
} from "@ant-design/pro-components";
import {
  Button,
  FormInstance,
  Modal,
} from "antd";
import { useRef } from "react";
import axios from "axios";
import { useCreation, useReactive } from "ahooks";

type ToolBarProps<TData> = {
  onAddClick?: (v: TData) => void;
};
type CrudType = 'view' | "edit" | 'table' | 'add'

export type TblState<TState = Record<string, any>> = {
  openCrudModal?: boolean;
  loadingEdit?: boolean;
  crudType: CrudType
} & TState;

type PageProps<TData, TState> = {
  tblState: ReturnType<typeof useReactive<TblState<TState>>>;
  crudProps: {
    form: FormInstance<TData>;
    editUrl?: string
    detailUrl?: string
    listUrl?: string
    actionsRender?: any[]
    actionColProps?: ProColumns<TData, "text">
  };
  toolBarProps?: ToolBarProps<TData>;
} & React.ComponentProps<typeof ProTable<TData>>;

const DataTable = <TData extends any, TState = any, TDetail = unknown>(
  props: PageProps<TData, TState>
) => {
  const { toolBarProps, tblState, crudProps, columns, ...tblProProps } =
    props;

  const { actionsRender = [], actionColProps = {} } = crudProps || {}
  const isAddMode = useCreation(() => {
    return tblState.openCrudModal && tblState.crudType === 'add'
  }, [tblState.openCrudModal, tblState.crudType])

  const isViewMode = useCreation(() => {
    return tblState.openCrudModal && tblState.crudType === 'view'
  }, [tblState.openCrudModal, tblState.crudType])
  const isEditMode = useCreation(() => {
    return tblState.openCrudModal && tblState.crudType === 'edit'
  }, [tblState.openCrudModal, tblState.crudType])
  const detailRef = useRef<ActionType>();

  const setCrudType = (type: CrudType | 'reset') => {

    if (type === 'reset') {
      tblState.openCrudModal = false;
      tblState.crudType = 'table'

    } else {
      tblState.openCrudModal = true;
      tblState.crudType = type
    }
  }

  const onClickEdit = (row: any) => {
    setCrudType('edit')
    if (crudProps.editUrl) {
      tblState.loadingEdit = true
      axios.get(crudProps.editUrl).then((res) => {
        const getInd = (res?.data?.data ?? [] as any[]).findIndex((item) => item.id === row.id)
        crudProps.form.setFieldsValue(res?.data?.data[getInd] || {})
        console.log('edit url', res.data);
      }).catch(console.error).finally(() => {
        tblState.loadingEdit = false
      })
    } else {
      crudProps.form.setFieldsValue(row)
    }
  }

  const getColumns = useCreation(() => {
    return [...columns,
    {
      fixed: 'right',
      title: "Actions",
      align: 'center',
      width: 110,
      valueType: "option",
      dataIndex: "id",
      render: (text, row) => [
        <Button shape="circle" key="view" size="small" onClick={() => setCrudType('view')}>
          <EyeFilled style={{ color: '#1677ff', fontSize: 20 }} />
        </Button>
        ,
        <Button type="primary" shape="circle" key="edit" size="small" onClick={() => onClickEdit(row)}>
          <EditFilled style={{ color: 'white', fontSize: 15 }} />
        </Button>
        ,
        <TableDropdown
          key="more"
          menus={[
            { key: "delete", name: "Delete" },
          ]}
        />,
        ...actionsRender
      ].filter(Boolean),
      ...actionColProps

    }]
  }, [columns])


  return (
    <>
      {(isAddMode || isEditMode) && <SchemaForm<TData>
        form={crudProps.form}
        columns={columns as any}
        loading={tblState.loadingEdit}
        layoutType="ModalForm"
        open={tblState.openCrudModal}
        modalProps={{
          onCancel(_) {
            tblState.openCrudModal = false
          }
        }}
      />}
      <Modal open={isViewMode} title="View Mode" onCancel={() => setCrudType('reset')}>
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
          labelWidth: 'auto',
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
                  setCrudType('add')
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

export default DataTable