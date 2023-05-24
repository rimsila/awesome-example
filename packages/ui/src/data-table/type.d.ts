import {
  FormInstance,
  ParamsType,
  ProColumns,
  ProTable,
  ProTableProps,
  RequestData,
} from "@ant-design/pro-components";
import { AxiosRequestConfig, AxiosResponse } from "axios";

export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

export type LiteralUnion<LiteralType, BaseType extends Primitive> =
  | LiteralType
  | (BaseType & Record<never, never>);

export declare namespace IDataTable {
  type ToolBarProps<TData> = {
    onAddClick?: (v?: TData) => void;
  };

  type CrudType = "view" | "edit" | "table" | "add";

  export type State<TEditData> = {
    openCrudModal?: boolean;
    loadingEditSubmit?: boolean;
    loadingEdit?: boolean;
    loadingDelete?: boolean;
    loadingAdd?: boolean;
    crudType: CrudType;
    row?: Partial<TEditData>;
    filter?: Partial<TEditData>;
  };

  export type PageProps<
    TData extends Record<any, any>,
    TDataList,
    TEditData = Record<any, any>,
    TDetail = any
  > = {
    state: State<TData>;
    crudProps: {
      form: FormInstance<TEditData>;
      viewConfigs?: (
        row: TEditData,
        params: ParamsType & {
          pageSize?: number;
          current?: number;
          keyword?: string;
        }
      ) => Partial<AxiosResponse<TDataList, any>["config"]>;
      editConfigs?: (
        row: TEditData,
        values?: TEditData
      ) => Partial<AxiosResponse<TDataList, any>["config"]>;
      addConfigs?: (
        values: TEditData
      ) => Partial<AxiosResponse<TDataList, any>["config"]>;
      deleteUrl?: (row: TEditData) => string;
      detailUrl?: string;
      listUrl?: string;
      actionsRender?: any[];
      actionColProps?: ProColumns<TData, "text">;
      resDetailFieldKey?: string[];
      resListFiledKey?: string[];
      listTotal?: number;
      listResponse?: (res?: AxiosResponse<TDataList, any>) => RequestData<any>;
      listConfigs?: (
        params: ParamsType & {
          pageSize?: number;
          current?: number;
          keyword?: string;
        },
        sort: Record<string, SortOrder>,
        filter: Record<string, (string | number)[]>
      ) => Partial<AxiosResponse<TDataList, any>["config"]>;
      editResponse?: (res?: AxiosResponse<TEditData, any>) => any;
      detailResponse?: (res?: AxiosResponse<TDetail, any>) => Partial<TDetail>;
      /**
       * use for unique ID
       */
      crudId?: string;
      onModeChange?: (state: State<TData>) => void;
    };
    toolBarProps?: ToolBarProps<TData>;
    axios: import("axios").AxiosStatic | import("axios").AxiosInstance;
    columnsOptions?: ProColumns<TData, "text">;
  } & React.ComponentProps<typeof ProTable<TData>>;

  interface Link {
    previous?: any;
    current: string;
    next: string;
  }

  interface Pagination {
    total: number;
    pages: number;
    page: number;
    limit: number;
    links: Link;
  }

  interface Meta {
    pagination: Pagination;
  }

  interface Data {
    id: number;
    name: string;
    email: string;
    gender: string;
    status: string;
  }

  interface RootObject {
    meta: Meta;
    data: Data[];
  }
  interface EditObject {
    meta: Meta;
    data: Data;
  }
}
