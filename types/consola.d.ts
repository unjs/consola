declare class Consola {
    static fatal (message: string): void;
    static error (message: string): void;
    static warn (message: string): void;
    static log (message: string): void;
    static info (message: string): void;
    static start (message: string): void;
    static success (message: string): void;
    static ready (message: string): void;
    static debug (message: string): void;
    static trace (message: string): void;
    static addReporter (reporter: (message: string) => void): (typeof Consola);
    static removeReporter (): (typeof Consola);
}

declare module "consola" {
    export default Consola;
}
