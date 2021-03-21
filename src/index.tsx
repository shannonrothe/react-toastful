import * as React from "react";
import { v4 } from "uuid";
import create from "zustand";
import { ToastBar } from "./components/ToastBar";
import { Toast, ToastfulOptions, ToastInstance } from "./types";

const useStore = create<{
  toasts: Toast[];
  dismiss: (id: string) => void;
  toggle: (id: string) => void;
  addToast: (
    output: string | JSX.Element,
    options?: ToastfulOptions
  ) => ToastInstance;
  setToastHeight: (toast: Toast, height: number) => void;
}>((set, get) => ({
  toasts: [],
  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, visible: false } : t
      ),
    })),
  toggle: (id) =>
    set((state) => ({
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, visible: !t.visible } : t
      ),
    })),
  addToast: (output: string | JSX.Element, options?: ToastfulOptions) => {
    const { dismiss, toggle } = get();
    const id = v4();
    const toast: Toast = {
      id,
      dismiss: () => dismiss(id),
      duration: options?.duration ?? Infinity,
      height: 0,
      onClick: options?.dismissOnClick ? () => dismiss(id) : undefined,
      output,
      position: options?.position ?? "top",
      swipeToDismiss: options?.swipeToDismiss,
      toggle: () => toggle(id),
      visible: options?.visible ?? true,
      kind: options?.kind,
    };
    set((state) => ({ toasts: [...state.toasts, toast] }));
    return {
      dismiss: toast.dismiss,
      toggle: toast.toggle,
    };
  },
  setToastHeight: (toast: Toast, height: number) =>
    set((state) => ({
      toasts: [
        ...state.toasts.map((t) => (t.id === toast.id ? { ...t, height } : t)),
      ],
    })),
}));

const GUTTER = 8;

export type ToastfulProps = {
  children?: (output: string | JSX.Element) => React.ReactNode;
};

export const Toastful = ({ children }: ToastfulProps) => {
  const { visibleToasts, setToastHeight } = useStore((state) => ({
    visibleToasts: state.toasts.filter((t) => t.visible),
    setToastHeight: state.setToastHeight,
  }));

  const calculateOffset = (toast: Toast) => {
    const visibleToastsAtPosition = visibleToasts.filter(
      (t) => t.visible && t.position === toast.position
    );
    const index = visibleToastsAtPosition.findIndex((t) => t.id === toast.id);
    const includeGutter = index > 0;
    const gutterSpacing = includeGutter ? GUTTER : 0;

    return toast.height ? index * (toast.height + gutterSpacing) : GUTTER;
  };

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        display: "flex",
      }}
    >
      {visibleToasts.map((toast) => (
        <ToastBar
          key={toast.id}
          toast={toast}
          renderToast={children && children(toast.output)}
          onHeightComputed={(height) => setToastHeight(toast, height)}
          offset={calculateOffset(toast)}
        />
      ))}
    </div>
  );
};

export const toastful = (
  output: string | JSX.Element,
  options?: ToastfulOptions
) => useStore.getState().addToast(output, options);
