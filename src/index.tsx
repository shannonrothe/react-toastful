import { setup } from "goober";
import * as React from "react";
import { ToastBar } from "./components/toast-bar";
import { ToastfulActionType, toastStore } from "./store";
import type { ToastfulOptions, ToastKind, ToastOutput, ToastPosition } from './types';
import { Toast } from "./types";
import { nextId } from "./utils";

setup(React.createElement);

type ToastfulProps = {
  defaultStyle?: boolean;
};

const buildToast = (
  output: ToastOutput,
  kind?: ToastKind,
  options?: ToastfulOptions
): Toast => {
  return {
    createdAt: Date.now(),
    dismissOnClick: options?.dismissOnClick,
    duration: options?.duration,
    kind,
    output,
    position: options?.position ?? "top",
    visible: options?.visible ?? true,
    className: options?.className,
    ...options,
    id: options?.id ?? nextId(),
  };
};

const defaultDurations: Record<ToastKind, number> = {
  success: 2000,
  failure: 4000,
  warning: 3000,
  loading: Infinity,
};

export const Toastful = ({ defaultStyle }: ToastfulProps) => {
  const { toasts, dispatch } = toastStore((state) => ({
    toasts: state.toasts.map(toast => ({
      ...toast,
      duration: toast.duration ?? (toast.kind && defaultDurations[toast.kind]) ?? Infinity,
    })),
    dispatch: state.dispatch,
  }));

  const handleCalculateHeight = (id: string, height: number) => dispatch({ type: ToastfulActionType.UPDATE_HEIGHT, id, height });

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        display: "flex",
      }}
    >
      {toasts.map((toast) => (
        <ToastBar
          defaultStyle={defaultStyle}
          key={toast.id}
          onCalculateHeight={handleCalculateHeight}
          toast={toast}
        />
      ))}
    </div>
  );
};

type ToastFactory = (
  output: ToastOutput,
  options?: ToastfulOptions
) => string;

const createToast = (kind?: ToastKind): ToastFactory => (output, options) => {
  const toast = buildToast(output, kind, options);
  toastStore.getState().dispatch({
    type: ToastfulActionType.UPSERT_TOAST,
    toast,
  });

  return toast.id;
}

const toastful = (
  output: ToastOutput,
  options?: ToastfulOptions
): string => createToast()(output, options);

toastful.success = createToast("success");
toastful.failure = createToast("failure");
toastful.warning = createToast("warning");

export type PromiseToastOutput = {
  loading: ToastOutput;
  success: ToastOutput;
  failure: ToastOutput;
};

toastful.loading = createToast('loading');

toastful.promise = <T, >(promise: Promise<T>, outputs: PromiseToastOutput, options?: ToastfulOptions) => {
  const id = toastful.loading(outputs.loading, { ...options });

  promise.then((p) => {
    toastful.success(outputs.success, {
      id,
      ...options,
    })

    return p;
  }).catch((p) => {
    toastful.failure(outputs.failure, {
      id,
      ...options,
    });

    return p;
  })

  return promise;
}

toastful.dismiss = (id: string) => toastStore.getState().dispatch({ type: ToastfulActionType.DISMISS_TOAST, id });

export { toastful };
export { ToastfulOptions, ToastPosition, ToastfulProps, ToastKind };

