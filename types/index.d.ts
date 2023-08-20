import {RowData} from "@tanstack/table-core";

type AsyncComponent<T = {}> = (props: {
    children?: ReactNode;
} & T) => JSX.Element | Promise<JSX.Element>

export type Layout = AsyncComponent;


export type Page<T extends string="slug"> = (props: {
    params: Record<T, string>;
    searchParams?: { [key: string]: string | string[] | undefined };
}) => JSX.Element | Promise<JSX.Element>


export type ErrorPage = (props: {
    error: Error;
    reset: () => void;
}) => JSX.Element

export type Api<T = {}> = (req: NextRequest, context: { params: T }) => Promise<Response>


declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        className?: string
    }
}

declare module 'pdfjs-dist/build/pdf.worker.entry'{
}

export type ChatMessage={
    from: 'system' | 'user';
    type: 'markdown' | 'text';
    content: string;
    loading: boolean;
    error?: boolean;
}