import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { Toast, ToastKind } from "../types";
import styles from "./toast_bar.css";

const getTransformStyle = ({ position = "top" }: Toast) => {
  const top = position.includes("top");
  const centered = position === "top" || position === "bottom";
  const startAnimationClasses = top
    ? centered
      ? styles.fromTopCentered
      : styles.fromTop
    : centered
    ? styles.fromBottomCentered
    : styles.fromBottom;

  const activeAnimationClasses = top
    ? centered
      ? styles.toTopCentered
      : styles.toTop
    : centered
    ? styles.toBottomCentered
    : styles.toBottom;

  return {
    appear: classNames(styles.hidden, startAnimationClasses),
    appearActive: classNames(styles.visible, activeAnimationClasses),
    enter: classNames(styles.hidden, startAnimationClasses),
    enterActive: classNames(styles.visible, activeAnimationClasses),
    exit: classNames(styles.hidden, activeAnimationClasses),
    exitActive: classNames(styles.visible, startAnimationClasses),
  };
};

const iconPaths: Record<ToastKind, string> = {
  success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  failure:
    "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  warning:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
};

const KindIcon = ({ kind }: { kind?: ToastKind }) => {
  if (!kind) {
    return null;
  }

  return (
    <svg
      className={classNames(styles.icon, !!kind && styles[kind])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={iconPaths[kind]}
      />
    </svg>
  );
};
const MAX_SWIPE_DELTA = 100;

export const DefaultToastBar = ({
  children,
  toast,
  onHeightComputed,
  offset,
  applyDefault,
}: {
  children?: React.ReactNode;
  toast: Toast;
  onHeightComputed: (height: number) => void;
  offset: number;
  applyDefault: boolean;
}) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const handlers = useSwipeable({
    onSwiping: (event) => {
      if (!ref || ["Up", "Down"].includes(event.dir)) {
        return;
      }

      const factor = event.dir === "Right" ? 1 : -1;
      ref.style.setProperty(
        "--transX",
        `${factor * Math.min(event.absX, MAX_SWIPE_DELTA)}px`
      );
      ref.style.opacity = `${1 - event.absX / MAX_SWIPE_DELTA}`;
    },
    onSwiped: (event) => {
      if (!ref || ["Up", "Down"].includes(event.dir)) {
        return;
      }

      const outsideSwipeRestore =
        event.dir === "Right"
          ? event.absX >= MAX_SWIPE_DELTA
          : event.deltaX <= MAX_SWIPE_DELTA * -1;
      if (outsideSwipeRestore) {
        toast.dismiss();
      } else {
        ref.style.setProperty(
          "--transX",
          toast.position === "top" || toast.position === "bottom" ? "-50%" : "0"
        );
        ref.style.opacity = "1";
      }
    },
    trackTouch: true,
    trackMouse: false,
  });

  const composedRef = (el: HTMLDivElement | null) => {
    handlers.ref(el);
    setRef(el);
  };

  const { position = "top" } = toast;
  const top = position.includes("top");
  const centered = position === "top" || position === "bottom";
  const factor = top ? 1 : -1;

  const verticalPositioning = top ? { top: "1em" } : { bottom: "1em" };
  const horizontalPositioning = position.includes("left")
    ? { left: "1em" }
    : centered
    ? {
        left: "50%",
        width: "auto",
        "--transX": "-50%",
        justifyContent: "center",
      }
    : { right: "1em" };

  useEffect(() => {
    if (ref) {
      const { height } = ref.getBoundingClientRect();
      onHeightComputed(height);
    }
  }, [ref]);

  useEffect(() => {
    if (toast.duration === Infinity) {
      return;
    }

    const timeout = setTimeout(toast.dismiss, toast.duration);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const toastStyles: any = {
    display: "flex",
    position: "fixed",
    "--transY": `${factor * offset}px`,
    ...verticalPositioning,
    ...horizontalPositioning,
  };

  return (
    <CSSTransition
      in={toast.visible}
      appear={true}
      mountOnEnter={true}
      unmountOnExit={true}
      classNames={getTransformStyle(toast)}
      timeout={parseInt(styles.transitionDurationMs, 10)}
    >
      <div
        {...handlers}
        ref={composedRef}
        onClick={toast.onClick}
        className={classNames(
          styles.toastBar,
          toast.kind && styles[toast.kind],
          {
            [styles.default]: applyDefault,
            [styles.clickable]: !!toast.onClick,
            [styles.withIcon]: !!toast.kind,
          }
        )}
        style={toastStyles}
      >
        {!!toast.kind && <KindIcon kind={toast.kind} />}
        {children}
      </div>
    </CSSTransition>
  );
};

export const ToastBar = ({
  toast,
  onHeightComputed,
  offset,
  renderToast,
}: {
  toast: Toast;
  onHeightComputed: (height: number) => void;
  offset: number;
  renderToast?: React.ReactNode;
}) => {
  return (
    <DefaultToastBar
      toast={toast}
      applyDefault={!renderToast}
      onHeightComputed={onHeightComputed}
      offset={offset}
    >
      {!!renderToast ? <>{renderToast}</> : <span>{toast.output}</span>}
    </DefaultToastBar>
  );
};
