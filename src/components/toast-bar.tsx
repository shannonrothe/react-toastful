import { keyframes } from "goober";
import React, { useCallback } from "react";
import { ToastKind } from "..";
import { useToastful } from "../hooks/use-toastful";
import { iconPaths } from "../icon-paths";
import { Toast } from "../types";
import { resolveToastOutput } from "../utils";

const enterKeyframes = (factor: number) =>
  keyframes({
    "0%": {
      transform: `translate3d(0, ${factor * -80}px, 0) scale(0.6)`,
      opacity: "0.5",
    },
    "100%": {
      transform: `translate3d(0, 0, 0) scale(1);`,
      opacity: "1",
    },
  });

const exitKeyframes = (factor: number) =>
  keyframes({
    "0%": {
      transform: `translate3d(0, 0, -1px) scale(1);`,
      opacity: "1",
    },
    "100%": {
      transform: `translate3d(0, ${factor * -130}px, -1px) scale(.5)`,
      opacity: "0",
    },
  });

const getAnimationStyle = (toast: Toast) => {
  const top = toast.position.includes("top");
  const factor = top ? 1 : -1;

  return {
    animation: toast.visible
      ? `${enterKeyframes(factor)} 0.25s forwards cubic-bezier(.35,.2,.58,.91)`
      : `${exitKeyframes(factor)} 0.8s forwards cubic-bezier(.2,.69,.88,.64)`,
  };
};

const getPositionStyle = (
  toast: Toast,
  offset: number
): React.CSSProperties => {
  const top = toast.position.includes("top");
  const centered = toast.position === "top" || toast.position === "bottom";
  const factor = top ? 1 : -1;

  const horizontal = centered
    ? { justifyContent: "center", left: 0, right: 0 }
    : toast.position.includes("left")
    ? { justifyContent: "flex-start", left: "1em" }
    : { justifyContent: "flex-end", right: "1em" };

  const vertical = top ? { top: "1em" } : { bottom: "1em" };

  return {
    display: "flex",
    position: "fixed",
    transform: `translateY(${offset * factor}px)`,
    transition: "all 0.2s cubic-bezier(.35,.2,.58,.91)",
    ...vertical,
    ...horizontal,
  };
};

const baseStyles = {
  background: "white",
  borderRadius: "8px",
  color: "#1f2937",
  padding: "0.75em 1em",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
};

export const ToastBar = ({
  onCalculateHeight,
  toast,
  defaultStyle,
}: {
  toast: Toast;
  onCalculateHeight: (id: string, height: number) => void;
  defaultStyle?: boolean;
}) => {
  const toastRef = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      setTimeout(() => {
        const { height } = el.getBoundingClientRect();
        onCalculateHeight(toast.id, height);
      });
    }
  }, []);

  const { eventHandlers, offset, ref } = useToastful({
    toast,
  });

  const positionStyle = getPositionStyle(toast, offset);
  const animationStyle = toast?.height
    ? getAnimationStyle(toast)
    : { opacity: 0 };

  return (
    <div
      ref={ref}
      style={{
        ...positionStyle,
        zIndex: toast.visible ? 1 - Number(toast.id) : undefined,
      }}
    >
      <div
        {...eventHandlers}
        ref={toastRef}
        role={eventHandlers.onClick ? "button" : undefined}
        aria-label={eventHandlers.onClick ? "Click to dismiss" : undefined}
        className={toast.className}
        style={{
          ...animationStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "350px",
          cursor: eventHandlers.onClick ? "pointer" : "default",
          ...(defaultStyle && baseStyles),
        }}
      >
        {mapKindToIcon(toast.kind)}
        {resolveToastOutput(toast)}
      </div>
    </div>
  );
};

function renderIcon(
  style: React.CSSProperties,
  children: JSX.Element,
  className?: string
) {
  return (
    <svg
      style={style}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {children}
    </svg>
  );
}

function mapKindToIcon(kind?: ToastKind): JSX.Element | null {
  if (!kind) {
    return null;
  }

  const animation =
    kind === "loading" &&
    keyframes({
      "100%": {
        transform: "rotate(1turn)",
      },
    });

  const baseIconStyle: React.CSSProperties = {
    width: "20px",
    height: "20px",
    marginRight: "0.5rem",
    color: mapToastKindToColor(kind),
    ...(animation && {
      animation: `${animation} 1s linear infinite`,
    }),
  };

  return renderIcon(
    baseIconStyle,
    kind === "loading" ? (
      <>
        <circle
          style={{ opacity: "0.25" }}
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          style={{ opacity: "0.75" }}
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </>
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={iconPaths[kind]}
      />
    ),
    animation || undefined
  );
}

function mapToastKindToColor(kind: ToastKind): string {
  switch (kind) {
    case "success":
      return "#34d399";
    case "failure":
      return "#dc2626";
    case "warning":
      return "#f59e0b";
    case "loading":
      return "#9CA3AF";
  }
}
