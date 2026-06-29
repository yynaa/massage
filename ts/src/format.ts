import { readFile } from "fs/promises";
import { parse } from "toml";

export interface Schema {
  name: string;
  description: string | undefined;
  commands: { [key: string]: Command };
}

export interface Command {
  id: number;
  description: string | undefined;
  arguments: Argument[];
}

export interface Argument {
  name: string;
  description: string | undefined;
  format: ArgumentFormat;
}

export type ArgumentFormat =
  | "String"
  | "U8"
  | "U16"
  | "U32"
  | "U64"
  | "I8"
  | "I16"
  | "I32"
  | "I64"
  | "F32"
  | "F64";

export async function schema_from_path(path: string): Promise<Schema> {
  const string_data = await readFile(path, "utf8");
  const toml_data = parse(string_data) as Schema;
  return toml_data;
}
