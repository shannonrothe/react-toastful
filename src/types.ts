export type ToastPosition =
  | "bottom"
  | "bottom_left"
  | "bottom_right"
  | "top"
  | "top_left"
  | "top_right";

export type ToastKind = "success" | "failure" | "warning";
export interface ToastfulOptions {
  dismissOnClick?: boolean;
  duration?: number;
  kind?: ToastKind;
  position?: ToastPosition;
  swipeToDismiss?: boolean;
  visible?: boolean;
}

export type Toast = {
  dismiss(): void;
  duration: number;
  height: number;
  id: string;
  onClick?(): void;
  output: string | JSX.Element;
  position: ToastPosition;
  swipeToDismiss?: boolean;
  toggle(): void;
  visible: boolean;
  kind?: ToastKind;
};

export type ToastInstance = Pick<Toast, "dismiss" | "toggle">;
