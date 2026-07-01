import type { MethodDeclarationStructure, OptionalKind } from "ts-morph";
import type { Command } from "./format";
import { snakeCase } from "change-case";

export function serialize_command(
  name: string,
  command: Command,
): OptionalKind<MethodDeclarationStructure> {
  return {
    name: "_serialize",
    returnType: "Uint8Array",
    statements: [
      `let bytes: number[] = [${command.id}]`,
      ...command.arguments.map((arg) => {
        return `bytes = [...bytes, ...primitives.ser${arg.format}(this.${snakeCase(arg.name)})]`;
      }),
      `return new Uint8Array(bytes)`,
    ],
  };
}
