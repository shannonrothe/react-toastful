import { Toast } from "./types";
export declare enum ToastfulActionType {
    ADD_TOAST = 0,
    UPDATE_TOAST = 1,
    UPSERT_TOAST = 2,
    DISMISS_TOAST = 3,
    REMOVE_TOAST = 4,
    PAUSE_TOAST = 5,
    UPDATE_HEIGHT = 6
}
declare type ToastfulAction = {
    type: ToastfulActionType.ADD_TOAST;
    toast: Toast;
} | {
    type: ToastfulActionType.UPDATE_TOAST;
    toast: Partial<Toast>;
} | {
    type: ToastfulActionType.UPSERT_TOAST;
    toast: Toast;
} | {
    type: ToastfulActionType.DISMISS_TOAST;
    id: string;
} | {
    type: ToastfulActionType.REMOVE_TOAST;
    id: string;
} | {
    type: ToastfulActionType.PAUSE_TOAST;
    toast: Toast;
    pausedAt: number;
} | {
    type: ToastfulActionType.UPDATE_HEIGHT;
    id: string;
    height: number;
};
declare type ToastState = {
    toasts: Toast[];
    dispatch: (action: ToastfulAction) => any;
};
export declare const toastStore: import("zustand").UseStore<ToastState>;
export {};
