export type ToastPosition =
  | "bottom"
  | "bottom_left"
  | "bottom_right"
  | "top"
  | "top_left"
  | "top_right";

export type ToastKind = "success" | "failure" | "warning" | "loading";

export type ToastfulOptions = {
  /**
   * ID of an existing toast, useful for upserting.
   *
   * @default undefined
   */
  id?: string;
  /**
   * Whether the toast should dismiss itself on click.
   *
   * @default false
   */
  dismissOnClick?: boolean;
  /**
   * How long the toast should last for until it is dismissed.
   *
   * @default Infinity
   */
  duration?: number;
  /**
   * Whether a toast can be dragged to dismiss.
   *
   * @default false
   */
  draggable?: boolean;
  /**
   * The position to render the toast at.
   *
   * @see ToastPosition
   * @default top
   */
  position?: ToastPosition;
  /**
   * Whether the toast is initially visible or not.
   *
   * @default true
   */
  visible?: boolean;
  /**
   * Classnames to pass to the toast container. Useful for custom styling.
   *
   * @default undefined
   */
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
