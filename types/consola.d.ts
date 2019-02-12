declare interface ConsolaReporter {
    log: (logObj: any, { async, stdout, stderr }: any) => void
}

declare class Consola {
    // Built-in log levels
    static fatal (message: any): void;
    static error (message: any): void;
    static warn (message: any): void;
    static log (message: any): void;
    static info (message: any): void;
    static start (message: any): void;
    static success (message: any): void;
    static ready (message: any): void;
    static debug (message: any): void;
    static trace(message: any): void;

    // Create
    static create(options: any): (typeof Consola);
    static withDefaults(defaults: any): (typeof Consola);

    static withTag(tag: string): (typeof Consola);
    static withScope(tag: string): (typeof Consola);

    // Reporter
    static addReporter(reporter: ConsolaReporter): (typeof Consola);
    static setReporters(reporters: Array<ConsolaReporter>): (typeof Consola);

    static removeReporter(reporter: any): (typeof Consola);
    static remove(reporter: any): (typeof Consola);
    static clear(reporter: any): (typeof Consola);

    // Wrappers
    static wrapAll(): void;
    static restoreAll(): void;
    static wrapConsole(): void;
    static restoreConsole(): void;
    static wrapStd(): void;
    static restoreStd(): void;

    // Pause/Resume
    static pauseLogs(): void;
    static pause(): void;

    static resumeLogs(): void;
    static resume(): void;

    // Mock
    static mockTypes(mockFn: any): any;
    static mock(mockFn: any): any;
}

declare module "consola" {
    export default Consola;
}
