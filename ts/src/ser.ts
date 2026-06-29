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
              return [
                `const ${snakeCase(arg.name)}Buffer = new ArrayBuffer(8)`,
                `const ${snakeCase(arg.name)}DataView = new DataView(${snakeCase(arg.name)}Buffer)`,
                `${snakeCase(arg.name)}DataView.setUint8(0, this.${snakeCase(arg.name)}, false)`,
                `[...new Uint8Array(${snakeCase(arg.name)}Buffer)]`,
              ];
            case "I8":
              return [
                `const ${snakeCase(arg.name)}Buffer = new ArrayBuffer(8)`,
                `const ${snakeCase(arg.name)}DataView = new DataView(${snakeCase(arg.name)}Buffer)`,
                `${snakeCase(arg.name)}DataView.setInt8(0, this.${snakeCase(arg.name)}, false)`,
                `[...new Uint8Array(${snakeCase(arg.name)}Buffer)]`,
              ];
            case "U16":
              return [
                `const ${snakeCase(arg.name)}Buffer = new ArrayBuffer(8)`,
                `const ${snakeCase(arg.name)}DataView = new DataView(${snakeCase(arg.name)}Buffer)`,
                `${snakeCase(arg.name)}DataView.setUint16(0, this.${snakeCase(arg.name)}, false)`,
                `[...new Uint8Array(${snakeCase(arg.name)}Buffer)]`,
              ];
            case "I16":
              return [
                `const ${snakeCase(arg.name)}Buffer = new ArrayBuffer(8)`,
                `const ${snakeCase(arg.name)}DataView = new DataView(${snakeCase(arg.name)}Buffer)`,
                `${snakeCase(arg.name)}DataView.setInt16(0, this.${snakeCase(arg.name)}, false)`,
                `[...new Uint8Array(${snakeCase(arg.name)}Buffer)]`,
              ];
            case "U32":
              return [
                `const ${snakeCase(arg.name)}Buffer = new ArrayBuffer(8)`,
                `const ${snakeCase(arg.name)}DataView = new DataView(${snakeCase(arg.name)}Buffer)`,
                `${snakeCase(arg.name)}DataView.setUint32(0, this.${snakeCase(arg.name)}, false)`,
                `[...new Uint8Array(${snakeCase(arg.name)}Buffer)]`,
              ];
            case "I32":
              return [
                `const ${snakeCase(arg.name)}Buffer = new ArrayBuffer(8)`,
                `const ${snakeCase(arg.name)}DataView = new DataView(${snakeCase(arg.name)}Buffer)`,
                `${snakeCase(arg.name)}DataView.setInt32(0, this.${snakeCase(arg.name)}, false)`,
                `[...new Uint8Array(${snakeCase(arg.name)}Buffer)]`,
              ];
            case "U64":
              return [
                `const ${snakeCase(arg.name)}Buffer = new ArrayBuffer(8)`,
                `const ${snakeCase(arg.name)}DataView = new DataView(${snakeCase(arg.name)}Buffer)`,
                `${snakeCase(arg.name)}DataView.setBigUint64(0, this.${snakeCase(arg.name)}, false)`,
                `[...new Uint8Array(${snakeCase(arg.name)}Buffer)]`,
              ];
            case "I64":
              return [
                `const ${snakeCase(arg.name)}Buffer = new ArrayBuffer(8)`,
                `const ${snakeCase(arg.name)}DataView = new DataView(${snakeCase(arg.name)}Buffer)`,
                `${snakeCase(arg.name)}DataView.setBigInt64(0, this.${snakeCase(arg.name)}, false)`,
                `[...new Uint8Array(${snakeCase(arg.name)}Buffer)]`,
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
