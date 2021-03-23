import * as React from "react";
import { ToastBar } from "./components/ToastBar";
import { useStore } from "./store";
import {
  ToastfulOptions,
  ToastInstance,
  ToastKind,
  ToastPosition
} from "./types";

export type ToastfulProps = {
  children?: (output: string | JSX.Element) => React.ReactNode;
};

export const Toastful = ({ children }: ToastfulProps) => {
  const { toasts } = useStore(state => ({
    toasts: state.toasts
  }));

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        display: "flex"
      }}
    >
      {toasts.map(toast => (
        <ToastBar
          key={toast.id}
          toast={toast}
          renderToast={children && children(toast.output)}
        />
      ))}
    </div>
  );
};

export const toastful = (
  output: string | JSX.Element,
  options?: ToastfulOptions
) => useStore.getState().addToast(output, options);

export { ToastfulOptions, ToastInstance, ToastPosition, ToastKind };
