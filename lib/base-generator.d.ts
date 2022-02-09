import { Generator } from "./types";
export declare class BaseGenerator<O, T> implements Generator<O, T> {
    options: O;
    constructor(options: O);
}
