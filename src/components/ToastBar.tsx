import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { Toast } from "../types";
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
        ref={setRef}
        onClick={toast.onClick}
        className={classNames(styles.toastBar, {
          [styles.default]: applyDefault,
          [styles.clickable]: !!toast.onClick,
        })}
        style={toastStyles}
      >
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
