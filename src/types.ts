export type ToastPosition =
  | "bottom"
  | "bottom_left"
  | "bottom_right"
  | "top"
  | "top_left"
  | "top_right";

export type ToastKind = "success" | "failure" | "warning";
export type ToastfulOptions = {
  id?: string;
  dismissOnClick?: boolean;
  duration?: number;
  draggable?: boolean;
  position?: ToastPosition;
  visible?: boolean;
  className?: string;
};

export type ToastOutput = string | JSX.Element | ((t: Toast) => JSX.Element);

export type Toast = {
  createdAt: number;
  dismissOnClick?: boolean;
  duration: number;
  draggable: boolean;
  height?: number;
  id: string;
  kind?: ToastKind;
  output: ToastOutput;
  pausedAt?: number;
  position: ToastPosition;
  visible: boolean;
  className?: string;
};
