import React, { DOMAttributes, useEffect, useRef } from "react";
import { ToastfulActionType, toastStore } from "../store";
import { Toast } from "../types";

export const useToastful = ({ toast }: { toast: Toast }) => {
  const { dispatch } = toastStore.getState();
  const { id } = toast;
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (
      !toast.duration ||
      toast.duration === Infinity ||
      toast.kind === "loading"
    ) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      dispatch({ type: ToastfulActionType.DISMISS_TOAST, id });
    }, toast.duration);
  }, [toast.duration, id, toast.kind]);

  const visibleToasts = toastStore.getState().toasts.filter((t) => t.visible);
  const offset = React.useCallback(() => {
    const visibleToastsAtPosition = visibleToasts.filter(
      (t) => t.visible && t.position === toast.position
    );
    const index = visibleToastsAtPosition.findIndex((t) => t.id === id);
    const includeMargin = index > 0;
    const gutterSpacing = includeMargin ? 8 : 0;

    return toast.height ? index * (toast.height + gutterSpacing) : 8;
  }, [visibleToasts, toast])();

  const eventHandlers: DOMAttributes<HTMLElement> = {
    onClick: toast.dismissOnClick
      ? () => {
          toastStore
            .getState()
            .dispatch({ type: ToastfulActionType.DISMISS_TOAST, id });
        }
      : undefined,
  };

  return {
    eventHandlers,
    offset,
    ref,
  };
};
