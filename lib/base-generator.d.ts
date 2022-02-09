import { Generator, MMatchExpression } from "./types";
export declare class BaseGenerator<O, T> implements Generator<O, T> {
    include?: MMatchExpression;
    exclude?: MMatchExpression;
    options: O;
    constructor(options: O);
}
