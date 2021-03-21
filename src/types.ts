export type ToastPosition =
  | "bottom"
  | "bottom_left"
  | "bottom_right"
  | "top"
  | "top_left"
  | "top_right";

export interface ToastfulOptions {
  position?: ToastPosition;
  visible?: boolean;
  dismissOnClick?: boolean;
  duration?: number;
}

export type Toast = {
  id: string;
  output: string | JSX.Element;
  height: number;
  dismiss(): void;
  toggle(): void;
  onClick?(): void;
  position?: ToastPosition;
  duration?: number;
  visible: boolean;
};

export type ToastInstance = {
  dismiss(): void;
  toggle(): void;
};
