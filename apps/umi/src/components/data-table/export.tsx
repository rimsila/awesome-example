import {
  LightFilter,
  ProFormDateTimePicker,
  ProFormSelect,
} from "@ant-design/pro-components";
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
} from "@ant-design/pro-components";
import {
  Button,
  Modal,
  Popconfirm,
  message,
  theme,
  Space,
  Dropdown,
  notification,
  Typography,
} from "antd";
import { MutableRefObject, useMemo, useRef } from "react";
import { useLockFn, useMemoizedFn } from "ahooks";
import { IDataTable } from "./type";
import DataTbl from ".";
import Print from "@/utils/print";
import { useMediaQuery } from "@/hooks/useMediaQr";

type DataTable = React.ComponentProps<typeof DataTbl>;
type DataTableExport = DataTable;

function convertToCSV(tableData: object[]): string {
  const headers = Object.keys(tableData[0]).join(",") + "\n";
  const rows = tableData
    .map((row) => {
      return Object.values(row)
        .map((value) => (typeof value === "string" ? `"${value}"` : value))
        .join(",");
    })
    .join("\n");

  return headers + rows;
}

function csvToBlob(csvData: string): Blob {
  const BOM = "\uFEFF";
  const csvBlob = new Blob([BOM + csvData], {
    type: "text/csv;charset=utf-8;",
  });
  return csvBlob;
}

function downloadBlobAsXLSX(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName + ".xlsx";
  link.click();
  URL.revokeObjectURL(url);
}

function exportTableToXLSX(tableData: object[], fileName = "file"): void {
  const csvData = convertToCSV(tableData);
  const blob = csvToBlob(csvData);
  downloadBlobAsXLSX(blob, fileName);
}

function TblExportDropdown(props: DataTableExport) {
  const { state, crudProps, axios } = props;
  const { listProps, exportProps } = crudProps || {};
  const { listConfigs } = listProps || {};
  const { exportResponseData } = exportProps || {};

  return (
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
            onClick: async () => {
              const response = await axios.request(
                listConfigs?.({
                  ...state.filter,
                  pageSize: 100,
                })
              );
              const getVal = exportResponseData?.(response);
              // state.dataSource = getVal?.data || [];
              if (Array.isArray(getVal?.data)) {
                exportTableToXLSX(getVal?.data, exportProps?.filename);
              }
            },
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
    </Dropdown>
  );
}

function TblExportFilter(props: DataTableExport) {
  return (
    <LightFilter
      initialValues={{
        sex: "man",
      }}
      collapse
      onFinish={async (values) => console.log(values)}
    >
      <ProFormSelect
        name="sex"
        label="性别"
        showSearch
        valueEnum={{
          man: "男",
          woman: "女",
        }}
      />
      <ProFormDateTimePicker name="time" label="时间" />
    </LightFilter>
  );
}

export default function TblExport(props: DataTableExport) {
  const { exportProps } = props.crudProps || {};
  return (
    <>
      {exportProps?.hasFilter ? (
        <TblExportFilter {...props} />
      ) : (
        <TblExportDropdown {...props} />
      )}
    </>
  );
}
