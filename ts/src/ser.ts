import type { MethodDeclarationStructure, OptionalKind } from "ts-morph";
import type { Command } from "./format";
import { snakeCase } from "change-case";

export function serialize_command(
  name: string,
  command: Command,
): OptionalKind<MethodDeclarationStructure> {
  return {
    name: "serialize",
    returnType: "Uint8Array",
    statements: [
      `let bytes: number[] = [${command.id}]`,
      ...command.arguments
        .map((arg) => {
          switch (arg.format) {
            case "U8":
            case "I8":
              return [
                `const ${snakeCase(arg.name)}Arg = [this.${snakeCase(arg.name)} & 0xFF]`,
                `${snakeCase(arg.name)}Arg`,
              ];
            case "U16":
            case "I16":
              return [
                `const ${snakeCase(arg.name)}Arg = Array(2).fill(0)`,
                `for (let i=0; i < 2; i++) { ${snakeCase(arg.name)}Arg[i] = (this.${snakeCase(arg.name)} >> (8*i)) & 0xFF }`,
                `${snakeCase(arg.name)}Arg`,
              ];
            case "U32":
            case "I32":
              return [
                `const ${snakeCase(arg.name)}Arg = Array(4).fill(0)`,
                `for (let i=0; i < 4; i++) { ${snakeCase(arg.name)}Arg[i] = (this.${snakeCase(arg.name)} >> (8*i)) & 0xFF }`,
                `${snakeCase(arg.name)}Arg`,
              ];
            case "U64":
            case "I64":
              return [
                `const ${snakeCase(arg.name)}Arg = Array(8).fill(0)`,
                `for (let i=0; i < 8; i++) { ${snakeCase(arg.name)}Arg[i] = Number(this.${snakeCase(arg.name)} >> (8n*BigInt(i))) & 0xFF }`,
                `${snakeCase(arg.name)}Arg`,
              ];
            case "F32":
              return [
                `const ${snakeCase(arg.name)}Buffer = new ArrayBuffer(4)`,
                `const ${snakeCase(arg.name)}DataView = new DataView(${snakeCase(arg.name)}Buffer)`,
                `${snakeCase(arg.name)}DataView.setFloat32(0, this.${snakeCase(arg.name)}, false)`,
                `[...new Uint8Array(${snakeCase(arg.name)}Buffer)]`,
              ];
            case "F64":
              return [
                `const ${snakeCase(arg.name)}Buffer = new ArrayBuffer(8)`,
                `const ${snakeCase(arg.name)}DataView = new DataView(${snakeCase(arg.name)}Buffer)`,
                `${snakeCase(arg.name)}DataView.setFloat64(0, this.${snakeCase(arg.name)}, false)`,
                `[...new Uint8Array(${snakeCase(arg.name)}Buffer)]`,
              ];
            case "String":
              return [
                `const ${snakeCase(arg.name)}Arg = [this.${snakeCase(arg.name)}.length, ...new TextEncoder().encode(this.${snakeCase(arg.name)})]`,
                `${snakeCase(arg.name)}Arg`,
              ];
            default:
              return [`// ${arg.format} todo`, `[]`];
          }
        })
        .map((value) => {
          // return `${value.slice(0, -1).join(";")}; bytes = [...bytes, ...${value[value.length - 1]}]`;
          return [
            ...value.slice(0, -1),
            `bytes = [...bytes, ...${value[value.length - 1]}]`,
          ];
        })
        .flat(),
      `return new Uint8Array(bytes)`,
    ],
  };
}
