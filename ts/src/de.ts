import type { MethodDeclarationStructure, OptionalKind } from "ts-morph";
import type { ArgumentFormat, Command } from "./format";
import { pascalCase } from "change-case";

export function deserialize_command(
  name: string,
  command: Command,
): OptionalKind<MethodDeclarationStructure> {
  return {
    name: "deserialize",
    parameters: [
      {
        name: "bytes",
        type: "number[]",
      },
    ],
    returnType: `${pascalCase(name)} | undefined`,
    isStatic: true,
    statements: [
      `let pos = 0`,
      ...command.arguments
        .map((arg) => {
          return [
            `const ${arg.name}Length = (${format_length(arg.format)})()`,
            `if (${arg.name}Length === null || pos + ${arg.name}Length > bytes.length) { return undefined }`,
            `const ${arg.name}Value = primitives.de${arg.format}(bytes.slice(pos,pos+${arg.name}Length))`,
            `if (${arg.name}Value === undefined) { return undefined }`,
            `pos += ${arg.name}Length`,
          ];
        })
        .flat(),
      `return new ${pascalCase(name)}(${command.arguments
        .map((arg) => {
          return `${arg.name}Value`;
        })
        .join(",")})`,
    ],
  };
}

function format_length(format: ArgumentFormat): string {
  switch (format) {
    case "U8":
    case "I8":
    case "Bool":
      return `() => {return 1;}`;
    case "U16":
    case "I16":
      return `() => {return 2;}`;
    case "U32":
    case "I32":
    case "F32":
      return `() => {return 4;}`;
    case "U64":
    case "I64":
    case "F64":
      return `() => {return 8;}`;
    case "String":
      return `() => {
        const index = bytes.slice(pos).indexOf(0);
        if (index === -1) { return null };
        return index + 1;
      }`;
    default:
      return `() => {return 0;}`;
  }
}
