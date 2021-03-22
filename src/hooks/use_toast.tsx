import React, { DOMAttributes, useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { Toast } from "../types";

type DragEvent = TouchEvent & MouseEvent;

interface Draggable {
  canDrag: boolean;
  start: number;
  delta: number;
  x: number;
  y: number;
  removalDelta: number;
}

const getX = (event: DragEvent) => {
  return event.targetTouches && event.targetTouches.length >= 1
    ? event.targetTouches[0].clientX
    : event.clientX;
};

const getY = (event: DragEvent) => {
  return event.targetTouches && event.targetTouches.length >= 1
    ? event.targetTouches[0].clientY
    : event.clientY;
};

const GUTTER = 8;

export const useToastful = ({
  toast,
  trackMouse = false,
  trackTouch = true,
}: {
  toast: Toast;
  trackMouse?: boolean;
  trackTouch?: boolean;
}) => {
  const [toastRef, setToastRef] = useState<HTMLDivElement | null>(null);
  const { current: drag } = useRef<Draggable>({
    start: 0,
    x: 0,
    y: 0,
    delta: 0,
    removalDelta: 0,
    canDrag: false,
  });

  const onDragStart = (
    event:
      | React.MouseEvent<HTMLElement | MouseEvent>
      | React.TouchEvent<HTMLElement>
  ) => {
    if (!toastRef) {
      return;
    }

    if (toast.draggable) {
      drag.canDrag = true;
      drag.x = getX(event.nativeEvent as DragEvent);
      drag.y = getY(event.nativeEvent as DragEvent);
      drag.start = drag.x;
      drag.removalDelta = toastRef.offsetWidth;
    }
  };

  const onDragging = (event: MouseEvent | TouchEvent) => {
    if (drag.canDrag) {
      event.preventDefault();

      const ref = toastRef!;
      drag.x = getX(event as DragEvent);
      drag.y = getY(event as DragEvent);
      drag.delta = drag.x - drag.start;

      ref.style.setProperty("--transX", `${drag.delta}px`);
      ref.style.opacity = `${1 - Math.abs(drag.delta / drag.removalDelta)}`;
    }
  };

  const onDragEnd = () => {
    const ref = toastRef!;

    if (drag.canDrag) {
      if (Math.abs(drag.delta) > drag.removalDelta) {
        toast.dismiss();
        return;
      }

      ref.style.setProperty(
        "--transX",
        toast.position === "top" || toast.position === "bottom" ? "-50%" : "0"
      );
      ref.style.opacity = "1";
    }
  };

  const onDragTransitionEnd = () => {};

  useEffect(() => {
    if (trackMouse) {
      document.addEventListener("mousemove", onDragging);
      document.addEventListener("mouseup", onDragEnd);
    }

    if (trackTouch) {
      document.addEventListener("touchmove", onDragging);
      document.addEventListener("touchend", onDragEnd);
    }

    return () => {
      if (trackMouse) {
        document.removeEventListener("mousemove", onDragging);
        document.removeEventListener("mouseup", onDragEnd);
      }

      if (trackTouch) {
        document.removeEventListener("touchmove", onDragging);
        document.removeEventListener("touchend", onDragEnd);
      }
    };
  }, [trackMouse, trackTouch]);

  const visibleToasts = useStore.getState().toasts.filter((t) => t.visible);
  const offset = React.useCallback(() => {
    const visibleToastsAtPosition = visibleToasts.filter(
      (t) => t.visible && t.position === toast.position
    );
    const index = visibleToastsAtPosition.findIndex((t) => t.id === toast.id);
    const includeGutter = index > 0;
    const gutterSpacing = includeGutter ? GUTTER : 0;

    return toast.height ? index * (toast.height + gutterSpacing) : GUTTER;
  }, [visibleToasts, toast.height]);

  const eventHandlers: DOMAttributes<HTMLElement> = {
    onMouseDown: onDragStart,
    onTouchStart: onDragStart,
    onMouseUp: onDragTransitionEnd,
    onTouchEnd: onDragTransitionEnd,
  };

  return {
    eventHandlers,
    offset: offset(),
    setToastRef,
    toastRef,
  };
};
