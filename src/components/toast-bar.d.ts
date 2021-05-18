/// <reference types="react" />
import { Toast } from "../types";
export declare const ToastBar: ({ onCalculateHeight, toast, defaultStyle, }: {
    toast: Toast;
    onCalculateHeight: (id: string, height: number) => void;
    defaultStyle?: boolean | undefined;
}) => JSX.Element;
