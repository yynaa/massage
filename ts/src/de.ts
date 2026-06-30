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

/*...command.arguments
  .map((arg) => {
    switch (arg.format) {
      case "U8":
        return [
          `if (bytes.length < 1) return undefined`,
          `const ${arg.name}Bytes = bytes.splice(-1)`,
          `const dv = new DataView(new Uint8Array(${arg.name}Bytes).buffer)`,
          `const ${arg.name}Arg = dv.getUint8(0, true)`,
        ];
      case "U16":
        return [
          `if (bytes.length < 2) return undefined`,
          `const ${arg.name}Bytes = bytes.splice(-2)`,
          `const dv = new DataView(new Uint8Array(${arg.name}Bytes).buffer)`,
          `const ${arg.name}Arg = dv.getUint16(0, true)`,
        ];
      case "U32":
        return [
          `if (bytes.length < 4) return undefined`,
          `const ${arg.name}Bytes = bytes.splice(-4)`,
          `const dv = new DataView(new Uint8Array(${arg.name}Bytes).buffer)`,
          `const ${arg.name}Arg = dv.getUint32(0, true)`,
        ];
      case "U64":
        return [
          `if (bytes.length < 8) return undefined`,
          `const ${arg.name}Bytes = bytes.splice(-8)`,
          `const dv = new DataView(new Uint8Array(${arg.name}Bytes).buffer)`,
          `const ${arg.name}Arg = dv.getBigUint64(0, true)`,
        ];
      case "I8":
        return [
          `if (bytes.length < 1) return undefined`,
          `const ${arg.name}Bytes = bytes.splice(-1)`,
          `const dv = new DataView(new Uint8Array(${arg.name}Bytes).buffer)`,
          `const ${arg.name}Arg = dv.getInt8(0, true)`,
        ];
      case "I16":
        return [
          `if (bytes.length < 2) return undefined`,
          `const ${arg.name}Bytes = bytes.splice(-2)`,
          `const dv = new DataView(new Uint8Array(${arg.name}Bytes).buffer)`,
          `const ${arg.name}Arg = dv.getInt16(0, true)`,
        ];
      case "I32":
        return [
          `if (bytes.length < 4) return undefined`,
          `const ${arg.name}Bytes = bytes.splice(-4)`,
          `const dv = new DataView(new Uint8Array(${arg.name}Bytes).buffer)`,
          `const ${arg.name}Arg = dv.getInt32(0, true)`,
        ];
      case "I64":
        return [
          `if (bytes.length < 8) return undefined`,
          `const ${arg.name}Bytes = bytes.splice(-8)`,
          `const dv = new DataView(new Uint8Array(${arg.name}Bytes).buffer)`,
          `const ${arg.name}Arg = dv.getBigInt64(0, true)`,
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
          `const ${arg.name}ZeroIndex = bytes.lastIndexOf(0)`,
          `if (${arg.name}ZeroIndex === -1) return undefined`,
          `let ${arg.name}Bytes = bytes.splice(${arg.name}ZeroIndex)`,
          `${arg.name}Bytes.reverse()`,
          `${arg.name}Bytes.pop()`,
          `const ${arg.name}Arg = new TextDecoder().decode(new Uint8Array(${arg.name}Bytes))`,
        ];
      default:
        return [`const ${arg.name}Arg = undefined`];
    }
  })
  .flat(), */
