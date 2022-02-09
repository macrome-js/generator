import { Generator } from "./types";

export class BaseGenerator<O, T> implements Generator<O, T> {
  options: O;

  constructor(options: O) {
    this.options = options;
  }
}
