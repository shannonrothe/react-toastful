import React, { DOMAttributes, useEffect, useRef } from "react";
import { ToastfulActionType, toastStore } from "../store";
import { Toast } from "../types";

export const useToastful = ({ toast }: { toast: Toast }) => {
  const { dispatch } = toastStore.getState();
  const { id } = toast;
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number>();

  const pauseToast = () =>
    toastStore.getState().dispatch({
      type: ToastfulActionType.PAUSE_TOAST,
      toast,
      pausedAt: Date.now(),
    });
  const resumeToast = () => {
    if (!toast.pausedAt) {
      return;
    }

    const remaining = toast.duration - (toast.pausedAt - toast.createdAt);
    if (remaining <= 0) {
      dispatch({ type: ToastfulActionType.DISMISS_TOAST, id });
      return;
    }

    timeoutRef.current = setTimeout(() => {
      dispatch({ type: ToastfulActionType.DISMISS_TOAST, id });
    }, remaining);
  };

  useEffect(() => {
    if (toast.duration === Infinity) {
      return;
    }

    // Set initial timeout for the duration specified
    timeoutRef.current = setTimeout(() => {
      dispatch({ type: ToastfulActionType.DISMISS_TOAST, id });
    }, toast.duration);
  }, []);

  useEffect(() => {
    if (!toast.pausedAt || toast.duration === Infinity) {
      return;
    }

    // If `pausedAt` changes, we need to check the remaining time
    const timeRemaining = toast.duration - (toast.pausedAt - toast.createdAt);

    // If there's less than 0ms remaining, dismiss and clear the timeout
    if (timeRemaining <= 0) {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      toastStore
        .getState()
        .dispatch({ type: ToastfulActionType.DISMISS_TOAST, id });
      return;
    }

    // Otherwise, check if there's an existing timer. If there is, remove it, otherwise
    // establish a new timer for the time remaining
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    } else {
      timeoutRef.current = setTimeout(() => {
        toastStore
          .getState()
          .dispatch({ type: ToastfulActionType.DISMISS_TOAST, id });
      }, timeRemaining);
    }
  }, [toast.pausedAt]);

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

  if (toast.duration !== Infinity) {
    eventHandlers.onMouseEnter = pauseToast;
    eventHandlers.onMouseLeave = resumeToast;
  }

  return {
    eventHandlers,
    offset,
    ref,
  };
};
