import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface NotifyOptions {
  msg: string;
  theme?: "light" | "dark";
}

const defaultOptions: ToastOptions = {
  position: toast.POSITION.TOP_CENTER,
  autoClose: 2000,
};

const notifySuccess = ({ msg, theme = "light" }: NotifyOptions): void => {
  toast.success(msg, {
    ...defaultOptions,
    theme,
  });
};

const notifyError = ({ msg, theme = "light" }: NotifyOptions): void => {
  toast.error(msg, {
    ...defaultOptions,
    theme,
  });
};

const notifyWarning = ({ msg, theme = "light" }: NotifyOptions): void => {
  toast.warning(msg, {
    ...defaultOptions,
    theme,
    autoClose: false,
  });
};

const notifyInfo = ({ msg, theme = "light" }: NotifyOptions): void => {
  toast.info(msg, {
    ...defaultOptions,
    theme,
  });
};

export { notifyError, notifyInfo, notifySuccess, notifyWarning };
