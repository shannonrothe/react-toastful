import { css, keyframes, setup } from "goober";
import React, { useCallback } from "react";
import { useToastful } from "../hooks/use_toast";
import { useStore } from "../store";
import { Toast, ToastKind } from "../types";

enum Color {
  GREEN = "#34d399",
  RED = "#dc2626",
  YELLOW = "#f59e0b"
}

const iconPaths: Record<ToastKind, string> = {
  success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  failure:
    "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  warning:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
};

setup(React.createElement);

const enterKeyframes = (factor: number) =>
  keyframes({
    "0%": {
      transform: `translate3d(0, ${factor * -80}px, 0) scale(0.6)`,
      opacity: "0.5"
    },
    "100%": {
      transform: `translate3d(0, 0, 0) scale(1);`,
      opacity: "1"
    }
  });

const exitKeyframes = (factor: number) =>
  keyframes({
    "0%": {
      transform: `translate3d(0, 0, -1px) scale(1);`,
      opacity: "1"
    },
    "100%": {
      transform: `translate3d(0, ${factor * -130}px, -1px) scale(.5);`,
      opacity: "0"
    }
  });

const getAnimations = (toast: Toast) => {
  const top = toast.position.includes("top");
  const centered = toast.position === "top" || toast.position === "bottom";
  const factor = top ? 1 : -1;

  return toast.height === 0
    ? { opacity: 0 }
    : {
        animation: toast.visible
          ? `${enterKeyframes(
              factor
            )} 0.15s forwards cubic-bezier(.35,.2,.58,.91)`
          : `${exitKeyframes(
              factor
            )} 0.8s forwards cubic-bezier(.2,.69,.88,.64)`
      };
};

const classNames = (
  ...classes: (string | { [key: string]: boolean | undefined })[]
) => {
  const truthyClasses = [];

  for (const c of classes) {
    if (typeof c === "string") {
      truthyClasses.push(c);
    } else if (typeof c === "object") {
      if (c.toString !== Object.prototype.toString) {
        truthyClasses.push(c);
      } else {
        for (const key in c) {
          Boolean(c[key]) && truthyClasses.push(key);
        }
      }
    }
  }

  return truthyClasses.join(" ");
};

const getPositionClassname = (toast: Toast, offset: number): string => {
  const top = toast.position.includes("top");
  const centered = toast.position === "top" || toast.position === "bottom";
  const factor = top ? 1 : -1;

  return css(`
    position: fixed;
    transition: all 200ms cubic-bezier(.35,.2,.58,.91);
    --trans-x: ${centered ? "-50%" : "0"};
    --trans-y: ${offset * factor}px;
    transform: translateX(var(--trans-x)) translateY(var(--trans-y));
    ${top ? "top: 1em;" : "bottom: 1em;"},
    ${
      toast.position.includes("left")
        ? "left: 1em;"
        : centered
        ? "left: 50%; width: auto; justify-content: center;"
        : "right: 1em;"
    }
  `);
};

const baseClass = css({
  display: "flex",
  alignItems: "center",
  background: "white",
  borderRadius: "8px",
  color: "#1f2937",
  padding: "0.75em 1em",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  fontSize: "0.875rem",
  lineHeight: "1.25rem"
});

export const ToastBar = ({
  toast,
  renderToast
}: {
  toast: Toast;
  renderToast?: React.ReactNode;
}) => {
  const store = useStore.getState();
  const toastRef = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      setTimeout(() => {
        const { height } = el.getBoundingClientRect();
        store.setToastHeight(toast, height);
      });
    }
  }, []);

  const { eventHandlers, offset, ref } = useToastful({
    toast
  });

  const positionClassname = React.useMemo(
    () => getPositionClassname(toast, offset),
    [toast]
  );
  const borderClass = React.useMemo(
    () =>
      css({
        border: `1px solid ${
          toast.kind === "success"
            ? Color.GREEN
            : toast.kind === "failure"
            ? Color.RED
            : Color.YELLOW
        }`
      }),
    [toast.kind]
  );

  return (
    <div
      ref={ref}
      className={positionClassname}
      style={{
        display: "flex",
        zIndex: toast.visible ? 9999 : undefined
      }}
    >
      <div
        {...eventHandlers}
        ref={toastRef}
        role={eventHandlers.onClick ? "button" : undefined}
        aria-label={eventHandlers.onClick ? "Click to dismiss" : undefined}
        draggable={toast.draggable}
        className={classNames({
          [baseClass]: !renderToast,
          [borderClass]: !!toast.kind
        })}
        style={{
          ...getAnimations(toast),
          cursor:
            eventHandlers.onClick || toast.draggable ? "pointer" : "default"
        }}
      >
        {!!renderToast ? (
          <>{renderToast}</>
        ) : (
          <>
            {toast.kind && (
              <svg
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "0.5rem",
                  color:
                    toast.kind === "success"
                      ? Color.GREEN
                      : toast.kind === "failure"
                      ? Color.RED
                      : Color.YELLOW
                }}
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
