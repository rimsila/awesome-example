import {
  FormInstance,
  ProColumns,
  ProTable,
  RequestData,
} from "@ant-design/pro-components";
import { AxiosResponse } from "axios";

export type Primitive =
	| null
	| undefined
	| string
	| number
	| boolean
	| symbol
	| bigint;
  
export type LiteralUnion<
	LiteralType,
	BaseType extends Primitive,
> = LiteralType | (BaseType & Record<never, never>);

declare namespace IDataTable {
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
    TData extends Record<any, any>,
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
      /**
       * use for unique ID
       */
      crudId?: string;
      onModeChange?: (row: Partial<TData>) => void;
    };
    toolBarProps?: ToolBarProps<TData>;
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
