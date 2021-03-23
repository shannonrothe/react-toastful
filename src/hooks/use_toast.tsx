import React, { DOMAttributes, useEffect, useRef } from "react";
import { useStore } from "../store";
import { Toast } from "../types";

type DragEvent = TouchEvent & MouseEvent;

interface Draggable {
  canDrag: boolean;
  closeOnClick: boolean;
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

export const useToastful = ({
  toast,
  trackMouse = false,
  trackTouch = true,
}: {
  toast: Toast;
  trackMouse?: boolean;
  trackTouch?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { current: drag } = useRef<Draggable>({
    start: 0,
    x: 0,
    y: 0,
    delta: 0,
    removalDelta: 0,
    canDrag: false,
    closeOnClick: true,
  });

  const onDragStart = (
    event:
      | React.MouseEvent<HTMLElement | MouseEvent>
      | React.TouchEvent<HTMLElement>
  ) => {
    if (!ref.current) {
      return;
    }

    if (toast.draggable) {
      drag.canDrag = true;
      drag.x = getX(event.nativeEvent as DragEvent);
      drag.start = drag.x;
      drag.removalDelta = ref.current.offsetWidth;
    }
  };

  const onDragging = (event: MouseEvent | TouchEvent) => {
    if (drag.canDrag) {
      event.preventDefault();
      const toastRef = ref.current!;

      drag.x = getX(event as DragEvent);
      drag.delta = drag.x - drag.start;

      if (drag.start !== drag.x) drag.closeOnClick = false;

      toastRef.style.setProperty("--transX", `${drag.delta}px`);
      toastRef.style.opacity = `${1 -
        Math.abs(drag.delta / drag.removalDelta)}`;
    }
  };

  const onDragEnd = () => {
    const toastRef = ref.current!;

    if (drag.canDrag) {
      drag.canDrag = false;

      if (Math.abs(drag.delta) > drag.removalDelta) {
        toast.dismiss();
        return;
      }

      toastRef.style.setProperty(
        "--transX",
        toast.position === "top" || toast.position === "bottom" ? "-50%" : "0"
      );
      toastRef.style.opacity = "1";
    }
  };

  const bindDragEvents = () => {
    if (trackMouse) {
      document.addEventListener("mousemove", onDragging, { passive: false });
      document.addEventListener("mouseup", onDragEnd);
    }

    if (trackTouch) {
      document.addEventListener("touchmove", onDragging, { passive: false });
      document.addEventListener("touchend", onDragEnd);
    }
  };

  const unbindDragEvents = () => {
    if (trackMouse) {
      document.removeEventListener("mousemove", onDragging);
      document.removeEventListener("mouseup", onDragEnd);
    }

    if (trackTouch) {
      document.removeEventListener("touchmove", onDragging);
      document.removeEventListener("touchend", onDragEnd);
    }
  };

  useEffect(() => {
    toast.draggable && bindDragEvents();

    return () => {
      toast.draggable && unbindDragEvents();
    };
  }, [toast.draggable]);

  const visibleToasts = useStore.getState().toasts.filter((t) => t.visible);
  const offset = React.useCallback(() => {
    const visibleToastsAtPosition = visibleToasts.filter(
      (t) => t.visible && t.position === toast.position
    );
    const index = visibleToastsAtPosition.findIndex((t) => t.id === toast.id);
    const includeMargin = index > 0;
    const gutterSpacing = includeMargin ? 8 : 0;

    return toast.height ? index * (toast.height + gutterSpacing) : 8;
  }, [visibleToasts, toast.height])();

  const eventHandlers: DOMAttributes<HTMLElement> = {
    onMouseDown: onDragStart,
    onTouchStart: onDragStart,
    onClick: toast.dismissOnClick
      ? () => drag.closeOnClick && toast.dismiss()
      : undefined,
  };

  return {
    eventHandlers,
    offset,
    ref,
  };
};