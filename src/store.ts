import { v4 } from "uuid";
import create from "zustand";
import { Toast, ToastfulOptions, ToastInstance } from "./types";

export const useStore = create<{
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
      draggable: options?.draggable ?? false,
      duration: options?.duration ?? Infinity,
      height: 0,
      onClick: options?.dismissOnClick ? () => dismiss(id) : undefined,
      output,
      position: options?.position ?? "top",
      swipeToDismiss: options?.swipeToDismiss,
      toggle: () => toggle(id),
      visible: options?.visible ?? true,
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
