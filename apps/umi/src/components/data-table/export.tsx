import {
  DrawerForm,
  LightFilter,
  ModalForm,
  ProForm,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  QueryFilter,
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
  Typography,
  Popover,
  Form,
  Row,
  Col,
  notification,
} from "antd";
import { MutableRefObject, useMemo, useRef } from "react";
import { useLockFn, useMemoizedFn } from "ahooks";
import { IDataTable } from "./type";
import DataTbl from ".";
import Print from "@/utils/print";
import { useMediaQuery } from "@/hooks/useMediaQr";
import {
  CloseCircleOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FilterOutlined,
} from "@ant-design/icons";

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

function TblExportDropdown(props: DataTableExport & { onItemClick?: any }) {
  const { state, crudProps, axios, onItemClick } = props;
  const { listProps, exportProps } = crudProps || {};
  const { listConfigs } = listProps || {};
  const { exportResponseData } = exportProps || {};

  return (
    <Dropdown
      key="export"
      onOpenChange={(open) => {
        state.openExport = false;
        if (open) {
          state.openExport = false;
        } else {
          state.openExport = true;
        }
      }}
      menu={
        { items: [] } || {
          onClick: onItemClick,
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
        }
      }
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

export default function TblExport(props: DataTableExport) {
  const { state, crudProps, axios } = props;
  const { listProps, exportProps } = crudProps || {};
  const { listConfigs } = listProps || {};
  const { exportResponseData } = exportProps || {};
  const [form] = Form.useForm();

  return (
    <Space>
      <LightFilter
        form={form}
        footerRender={(onConfirm, onClear) => {
          const handleSubmit = (key: any) => {
            state.exportType = key;
            form.validateFields().then(() => {
              onConfirm?.();
            });
          };
          return (
            <div className="flex justify-between w-full">
              <Button
                onClick={onClear}
                shape="round"
                danger
                icon={<CloseCircleOutlined />}
              >
                Clear
              </Button>
              <Space size="small">
                <Button onClick={() => handleSubmit("pdf")} shape="round">
                  PDF
                </Button>
                <Button onClick={() => handleSubmit("csv")} shape="round">
                  CSV
                </Button>
                <Button onClick={() => handleSubmit("xslx")} shape="round">
                  Excel
                </Button>
              </Space>
            </div>
          );
        }}
        collapseLabel={
          <Button
            onClick={() => {
              state.exportType = undefined;
            }}
            icon={<DownloadOutlined />}
          >
            Export
          </Button>
        }
        initialValues={{
          sex: "man",
        }}
        collapse
        onFinish={async (values) => {
          console.log(values);
          if (state.exportType === "pdf") {
            // alert("PDF export");
            state.openReport = true;
            setTimeout(() => {
              Print(document.getElementById("data-table"));
            }, 500);
          } else if (state.exportType === "xslx") {
            const response = await axios.get("/users", {
              params: {
                per_page: 100,
                ...values,
              },
            });
            const getVal = exportResponseData?.(response);
            // state.dataSource = getVal?.data || [];
            if (Array.isArray(getVal?.data)) {
              exportTableToXLSX(getVal?.data, exportProps?.filename);
              notification.success({
                message: "Exported",
                description: "Operation was successfully",
              });
            }
          } else if (state.exportType === "csv") {
            alert("csv export");
          }
        }}
      >
        <ProFormDatePicker name="birth" label="创建时间" width={"100%"} />
        <ProFormDatePicker name="birth" label="创建时间" width={"100%"} />
        <ProFormRadio.Group
          name="freq"
          label="查询频度"
          rules={[{ required: true }]}
          options={[
            {
              value: "weekly",
              label: "每周",
            },
            {
              value: "quarterly",
              label: "每季度",
            },
            {
              value: "monthly",
              label: "每月",
            },
            {
              value: "yearly",
              label: "每年",
            },
          ]}
        />
        <ProFormText hidden name="exportType" label="Export Type" />
      </LightFilter>
    </Space>
  );
}
