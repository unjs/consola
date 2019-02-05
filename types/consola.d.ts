declare class Consola {
    static fatal (message: any): void;
    static error (message: any): void;
    static warn (message: any): void;
    static log (message: any): void;
    static info (message: any): void;
    static start (message: any): void;
    static success (message: any): void;
    static ready (message: any): void;
    static debug (message: any): void;
    static trace (message: any): void;
    static addReporter (reporter: (message: string) => void): (typeof Consola);
    static removeReporter (): (typeof Consola);
    static withTag (tag: string): (typeof Consola);
    static withScope (tag: string): (typeof Consola);
    static wrapAll (): void;
    static restoreAll (): void;
    static wrapConsole (): void;
    static restoreConsole (): void;
    static wrapStd (): void;
    static restoreStd (): void;
    static pauseLogs (): void;
    static resumeLogs (): void;
}

declare module "consola" {
    export default Consola;
}
