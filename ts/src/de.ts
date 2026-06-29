import type { MethodDeclarationStructure, OptionalKind } from "ts-morph";
import type { Command } from "./format";
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
      ...command.arguments
        .map((arg) => {
          switch (arg.format) {
            case "U8":
              return [
                `if (bytes.length < 1) return undefined`,
                `const ${arg.name}Arg = bytes.splice(-1)[0] || 0`,
              ];
            case "U16":
              return [
                `if (bytes.length < 2) return undefined`,
                `let ${arg.name}Bytes = bytes.splice(-2)`,
                `let ${arg.name}Arg = 0`,
                `for (let i = 0; i < 2; i++) { ${arg.name}Arg = (${arg.name}Arg << 8) | (${arg.name}Bytes[i] || 0) }`,
              ];
            case "U32":
              return [
                `if (bytes.length < 4) return undefined`,
                `let ${arg.name}Bytes = bytes.splice(-4)`,
                `let ${arg.name}Arg = 0`,
                `for (let i = 0; i < 4; i++) { ${arg.name}Arg = (${arg.name}Arg << 8) | (${arg.name}Bytes[i] || 0) }`,
              ];
            case "U64":
              return [
                `if (bytes.length < 8) return undefined`,
                `let ${arg.name}Bytes = bytes.splice(-8)`,
                `let ${arg.name}Arg = 0n`,
                `for (let i = 0; i < 8; i++) { ${arg.name}Arg = (${arg.name}Arg << 8n) | (BigInt(${arg.name}Bytes[i] || 0)) }`,
              ];
            case "I8":
              return [
                `if (bytes.length < 1) return undefined`,
                `const ${arg.name}Arg = ((bytes.splice(-1)[0] || 0) << 24) >> 24`,
              ];
            case "I16":
              return [
                `if (bytes.length < 2) return undefined`,
                `let ${arg.name}Bytes = bytes.splice(-2)`,
                `let ${arg.name}Arg = 0`,
                `for (let i = 0; i < 2; i++) { ${arg.name}Arg = (${arg.name}Arg << 8) | (${arg.name}Bytes[i] || 0) }`,
                `${arg.name}Arg = (${arg.name}Arg << 16) >> 16`,
              ];
            case "I32":
              return [
                `if (bytes.length < 4) return undefined`,
                `let ${arg.name}Bytes = bytes.splice(-4)`,
                `let ${arg.name}Arg = 0`,
                `for (let i = 0; i < 4; i++) { ${arg.name}Arg = (${arg.name}Arg << 8) | (${arg.name}Bytes[i] || 0) }`,
                `${arg.name}Arg = ${arg.name}Arg | 0`,
              ];
            case "I64":
              return [
                `if (bytes.length < 8) return undefined`,
                `let ${arg.name}Bytes = bytes.splice(-8)`,
                `let ${arg.name}Arg = 0n`,
                `for (let i = 0; i < 8; i++) { ${arg.name}Arg = (${arg.name}Arg << 8n) | (BigInt(${arg.name}Bytes[i] || 0)) }`,
                `${arg.name}Arg = ${arg.name}Arg >= 0x8000000000000000n ? ${arg.name}Arg - 0x10000000000000000n : ${arg.name}Arg`,
              ];
            case "F32":
              return [
                `if (bytes.length < 4) return undefined`,
                `const ${arg.name}Bytes = bytes.splice(-4)`,
                `const dv = new DataView(new Uint8Array(${arg.name}Bytes).buffer)`,
                `const ${arg.name}Arg = dv.getFloat32(0, true)`,
              ];
            case "F64":
              return [
                `if (bytes.length < 8) return undefined`,
                `const ${arg.name}Bytes = bytes.splice(-8)`,
                `const ${arg.name}DataView = new DataView(new Uint8Array(${arg.name}Bytes).buffer)`,
                `const ${arg.name}Arg = ${arg.name}DataView.getFloat64(0, true)`,
              ];
            case "String":
              return [
                `if (bytes.length < 1) return undefined`,
                `const ${arg.name}Length = bytes.splice(-1)[0] || 0`,
                `if (bytes.length < ${arg.name}Length) return undefined`,
                `let ${arg.name}Bytes = bytes.splice(-${arg.name}Length)`,
                `${arg.name}Bytes.reverse()`,
                `const ${arg.name}Arg = new TextDecoder().decode(new Uint8Array(${arg.name}Bytes))`,
              ];
            default:
              return [`const ${arg.name}Arg = undefined`];
          }
        })
        .flat(),
      `return new ${pascalCase(name)}(${command.arguments
        .map((arg) => {
          return `${arg.name}Arg`;
        })
        .join(",")})`,
    ],
  };
}
