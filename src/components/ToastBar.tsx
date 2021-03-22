import classNames from "classnames";
import { create } from "nano-css";
import { addon as addonKeyframes } from "nano-css/addon/keyframes";
import { addon as addonRule } from "nano-css/addon/rule";
import React, { CSSProperties, useEffect } from "react";
import { useToastful } from "../hooks/use_toast";
import { useStore } from "../store";
import { Toast, ToastKind } from "../types";
import styles from "./toast_bar.css";

const nano = create({
  h: React.createElement,
});
addonKeyframes(nano);
addonRule(nano);

const enterKeyframes = (centered: boolean) =>
  nano.keyframes?.({
    "0%": {
      transform: `translate3d(${centered ? "-50%" : "0"}, -100%, 0) scale(0.6)`,
      opacity: "0.5",
    },
    "100%": {
      transform: `translate3d(${centered ? "-50%" : "0"}, 0, 0) scale(1);`,
      opacity: "1",
    },
  });

const exitKeyframes = (centered: boolean, factor: number, offset: number) =>
  nano.keyframes?.({
    "0%": {
      transform: `translate3d(${centered ? "-50%" : "0"}, ${factor *
        offset}px, -1px) scale(1);`,
      opacity: "1",
    },
    "100%": {
      transform: `translate3d(${centered ? "-50%" : "0"}, ${factor *
        offset}px, -1px) scale(.5);`,
      opacity: "0",
    },
  });

const getAnimations = (toast: Toast, offset: number) => {
  const top = toast.position.includes("top");
  const centered = toast.position === "top" || toast.position === "bottom";
  const factor = top ? 1 : -1;

  if (toast.height === 0) {
    return { opacity: 0 };
  }

  return {
    animation: toast.visible
      ? `${enterKeyframes(
          centered
        )} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`
      : `${exitKeyframes(
          centered,
          factor,
          offset
        )} 0.8s forwards cubic-bezier(.06,.71,.55,1)`,
  };
};

const getPosition = (toast: Toast, offset: number): CSSProperties => {
  const top = toast.position.includes("top");
  const centered = toast.position === "top" || toast.position === "bottom";
  const factor = top ? 1 : -1;

  const verticalPositioning = top ? { top: "1em" } : { bottom: "1em" };
  const horizontalPositioning = toast.position.includes("left")
    ? { left: "1em" }
    : centered
    ? {
        left: "50%",
        width: "auto",
        justifyContent: "center",
      }
    : { right: "1em" };

  return {
    position: "fixed",
    transition: "all 230ms cubic-bezier(.21, 1.02, .73, 1)",
    transform: `translateY(${offset * factor}px)`,
    ...verticalPositioning,
    ...horizontalPositioning,
  };
};

const iconPaths: Record<ToastKind, string> = {
  success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  failure:
    "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  warning:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
};

export const ToastBar = ({
  toast,
  renderToast,
}: {
  toast: Toast;
  renderToast?: React.ReactNode;
}) => {
  const store = useStore.getState();
  const { eventHandlers, offset, toastRef, setToastRef } = useToastful({
    toast,
  });

  // Set the height after render so we can calculate the correct translation offset
  useEffect(() => {
    if (toastRef) {
      const { height } = toastRef.getBoundingClientRect();
      store.setToastHeight(toast, height);
    }
  }, [toastRef]);

  // On mount, establish a timeout so we can dismiss the toast after a given duration
  useEffect(() => {
    const timeout = setTimeout(toast.dismiss, toast.duration);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const positionStyle = getPosition(toast, offset);

  return (
    <div
      style={{
        display: "flex",
        zIndex: toast.visible ? 9999 : undefined,
        ...positionStyle,
      }}
    >
      <div
        {...eventHandlers}
        className={classNames(toast.kind && styles[toast.kind], {
          [styles.default]: !renderToast,
          [styles.clickable]: !!toast.onClick,
        })}
        ref={setToastRef}
        style={{ ...getAnimations(toast, offset) }}
      >
        {!!renderToast ? (
          <>{renderToast}</>
        ) : (
          <>
            {toast.kind && (
              <svg
                className={classNames(styles.icon, styles[toast.kind])}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={iconPaths[toast.kind]}
                />
              </svg>
            )}
            {toast.output}
          </>
        )}
      </div>
    </div>
  );
};
