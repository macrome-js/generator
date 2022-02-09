import { FileHandle } from "fs/promises";
import { Errawr } from "errawr";

export type ReadOptions =
  | BufferEncoding
  | {
      fd?: FileHandle;
      flags?: string;
      encoding?: BufferEncoding | null;
    };

export type WriteOptions =
  | BufferEncoding
  | {
      fd?: FileHandle;
      encoding?: BufferEncoding | null;
      mode?: number;
      flag?: string;
    };

export type ReportedAddChange = {
  op: "A";
  path: string;
  mtimeMs: number;
};

export type ReportedModifyChange = {
  op: "M";
  path: string;
  mtimeMs: number;
};

export type ReportedDeleteChange = {
  op: "D";
  path: string;
  mtimeMs: null;
};

export type ReportedChange =
  | ReportedAddChange
  | ReportedModifyChange
  | ReportedDeleteChange;

export type AddChange = {
  op: "A";
  path: string;
  reported: ReportedAddChange;
  annotations: Annotations | null;
};

export type ModifyChange = {
  op: "M";
  path: string;
  reported: ReportedModifyChange;
  annotations: Annotations | null;
};

export type DeleteChange = {
  op: "D";
  path: string;
  reported: ReportedDeleteChange;
  annotations: null;
};

export type Change = AddChange | ModifyChange | DeleteChange;

export type MappableChange = AddChange | ModifyChange;

export type Annotations = Map<string, any>;

type PromiseDict = { [key: string]: Promise<any> };
type ResolvedPromiseDict<D> = {
  [K in keyof D]: Awaited<D[K]>;
};

export declare class ApiError extends Errawr {
  get name(): string;
}
/**
 * Api is a facade over the Macrome class which exposes the functionality which should be accessible to generators
 */
export declare class Api {
  get destroyed(): boolean;
  buildAnnotations(destPath?: string): Map<string, any>;
  buildErrorAnnotations(destPath?: string): Map<string, any>;
  buildErrorContent(error: Error): string;
  resolve(path: string): string;
  readAnnotations(
    path: string,
    options?: {
      fd?: FileHandle;
    }
  ): Promise<Annotations | null>;
  read(path: string, options?: ReadOptions): Promise<string>;
  write(
    path: string,
    content: string | Error,
    options?: WriteOptions
  ): Promise<void>;
  generate(
    path: string,
    cb: (
      props: { destPath: string } & Record<string, never>
    ) => Promise<string | null>
  ): Promise<void>;
  generate<D extends PromiseDict>(
    path: string,
    deps: D,
    cb: (
      props: { destPath: string } & ResolvedPromiseDict<D>
    ) => Promise<string | null>
  ): Promise<void>;
}

export declare class GeneratorApi extends Api {
  get generatorPath(): string;
}

export declare class MapApi extends GeneratorApi {
  get change(): Change;
  get version(): string;
}

export type MMatchExpression = Array<string> | string | null | undefined;

/**
 * If include is nullish, everything is presumed to be included.
 * If exclude is nullish, nothing is presumed to be excluded.
 *
 * A directory which is not included will still be traversed as files within it could be.
 * If you wish to omit traversal of an entire directory, just exclude it.
 */
export type AsymmetricMMatchExpression = {
  include?: MMatchExpression;
  exclude?: MMatchExpression;
};

export interface Generator<O, T> extends AsymmetricMMatchExpression {
  options: O;

  initialize?(api: GeneratorApi): Promise<unknown>;

  map?(api: MapApi, change: Change): Promise<T>;

  reduce?(api: GeneratorApi, mappings: Map<string, T>): Promise<unknown>;

  destroy?(api: GeneratorApi): Promise<unknown>;
}
