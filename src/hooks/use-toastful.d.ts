import React from "react";
import { Toast } from "../types";
export declare const useToastful: ({ toast, trackMouse, trackTouch, }: {
    toast: Toast;
    trackMouse?: boolean | undefined;
    trackTouch?: boolean | undefined;
}) => {
    eventHandlers: React.DOMAttributes<HTMLElement>;
    offset: number;
    ref: React.RefObject<HTMLDivElement>;
};
