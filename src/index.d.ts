/// <reference types="react" />
import type { ToastfulOptions, ToastKind, ToastOutput, ToastPosition } from './types';
declare type ToastfulProps = {
    defaultStyle?: boolean;
};
export declare const Toastful: ({ defaultStyle }: ToastfulProps) => JSX.Element;
declare type ToastFactory = (output: ToastOutput, options?: ToastfulOptions) => string;
declare const toastful: {
    (output: ToastOutput, options?: ToastfulOptions | undefined): string;
    success: ToastFactory;
    failure: ToastFactory;
    warning: ToastFactory;
    loading: ToastFactory;
    promise<T>(promise: Promise<T>, outputs: PromiseToastOutput, options?: ToastfulOptions | undefined): Promise<T>;
};
export declare type PromiseToastOutput = {
    loading: ToastOutput;
    success: ToastOutput;
    failure: ToastOutput;
};
export { toastful };
export { ToastfulOptions, ToastPosition, ToastfulProps, ToastKind };
