import { ToastKind } from ".";
declare type ToastKindWithoutLoading = Exclude<ToastKind, "loading">;
export declare const iconPaths: Record<ToastKindWithoutLoading, string>;
export {};
