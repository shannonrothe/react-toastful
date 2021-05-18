import create from "zustand";
import { Toast } from "./types";

export enum ToastfulActionType {
  ADD_TOAST,
  UPDATE_TOAST,
  UPSERT_TOAST,
  DISMISS_TOAST,
  REMOVE_TOAST,
  PAUSE_TOAST,
  UPDATE_HEIGHT,
}

type ToastfulAction =
  | {
      type: ToastfulActionType.ADD_TOAST;
      toast: Toast;
    }
  | { type: ToastfulActionType.UPDATE_TOAST; toast: Partial<Toast> }
  | { type: ToastfulActionType.UPSERT_TOAST; toast: Toast }
  | { type: ToastfulActionType.DISMISS_TOAST; id: string }
  | { type: ToastfulActionType.REMOVE_TOAST; id: string }
  | { type: ToastfulActionType.PAUSE_TOAST; toast: Toast; pausedAt: number }
  | { type: ToastfulActionType.UPDATE_HEIGHT; id: string; height: number };

type ToastState = {
  toasts: Toast[];
  dispatch: (action: ToastfulAction) => any;
};
interface State {
  toasts: Toast[];
}

const queueForRemoval = (id: string) =>
  setTimeout(() => {
    toastStore
      .getState()
      .dispatch({ type: ToastfulActionType.REMOVE_TOAST, id });
  }, 1000);

const reducer = (state: ToastState, action: ToastfulAction): State => {
  switch (action.type) {
    case ToastfulActionType.ADD_TOAST:
      return { toasts: [...state.toasts, action.toast] };
    case ToastfulActionType.UPDATE_TOAST:
      return {
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    case ToastfulActionType.UPSERT_TOAST:
      return state.toasts.find((t) => t.id === action.toast.id)
        ? reducer(state, {
            type: ToastfulActionType.UPDATE_TOAST,
            toast: action.toast,
          })
        : reducer(state, {
            type: ToastfulActionType.ADD_TOAST,
            toast: action.toast,
          });
    case ToastfulActionType.DISMISS_TOAST:
      queueForRemoval(action.id);

      return {
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, visible: false } : t
        ),
      };
    case ToastfulActionType.REMOVE_TOAST:
      return {
        toasts: state.toasts.filter((t) => t.id !== action.id),
      };
    case ToastfulActionType.UPDATE_HEIGHT:
      return {
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, height: action.height } : t
        ),
      };
    case ToastfulActionType.PAUSE_TOAST:
      return {
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, pausedAt: action.pausedAt } : t
        ),
      };
  }
};

export const toastStore = create<ToastState>((set) => ({
  toasts: [],
  dispatch: (args) => set((state) => reducer(state, args)),
}));
