import { Toast } from "./types";

export const nextId = (() => {
  let id = 0;
  return () => {
    return (++id).toString();
  };
})();

export const resolveToastOutput = (toast: Toast) =>
  typeof toast.output === "function" ? toast.output(toast) : toast.output;
