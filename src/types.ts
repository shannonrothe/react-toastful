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
  draggable?: boolean;
  position?: ToastPosition;
  visible?: boolean;
}

export type Toast = {
  createdAt: number;
  dismiss(): void;
  dismissOnClick?: boolean;
  duration: number;
  draggable: boolean;
  height: number;
  id: string;
  output: string | JSX.Element;
  pausedAt?: number;
  position: ToastPosition;
  toggle(): void;
  visible: boolean;
  kind?: ToastKind;
};

export type ToastInstance = Pick<Toast, "dismiss" | "toggle">;
