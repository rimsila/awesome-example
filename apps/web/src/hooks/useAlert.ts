import { useUpdateEffect } from "ahooks";
import { Modal, ModalFuncProps } from "antd";
import { useEffect } from "react";

export const useAlert = (isShow: boolean, opt: ModalFuncProps = {}) => {
  useEffect(() => {
    isShow && Modal[opt.type ?? "info"](opt);
  }, [isShow]);
};
