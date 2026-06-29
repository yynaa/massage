import { Project, ScriptTarget, SourceFile } from "ts-morph";
import type { ArgumentFormat, Command, Schema } from "./format";
import { pascalCase, snakeCase } from "change-case";
import { serialize_command } from "./ser";
import { deserialize_command } from "./de";

export async function generate_schema(schema: Schema) {
  const project = new Project({
    compilerOptions: {
      target: ScriptTarget.ES2015,
    },
  });
  const sourceFile = project.createSourceFile(
    `./.generated/${pascalCase(schema.name)}.ts`,
    undefined,
    { overwrite: true },
  );
  sourceFile.addTypeAlias({
    name: `${pascalCase(schema.name)}Command`,
    type: Object.keys(schema.commands)
      .map((name) => {
        return pascalCase(name);
      })
      .join("|"),
  });
  sourceFile.addClass({
    name: `${pascalCase(schema.name)}`,
    docs: schema.description !== undefined ? [schema.description] : undefined,
    properties: [
      { name: "command", type: `${pascalCase(schema.name)}Command` },
    ],
    ctors: [
      {
        parameters: [
          {
            name: "command",
            type: `${pascalCase(schema.name)}Command`,
          },
        ],
        statements: [`this.command = command`],
      },
    ],
    methods: [
      {
        name: "serialize",
        returnType: "Uint8Array",
        statements: [`return this.command.serialize()`],
      },
      {
        name: "deserialize",
        parameters: [
          {
            name: "bytes",
            type: "Uint8Array",
          },
        ],
        returnType: `${pascalCase(schema.name)} | undefined`,
        isStatic: true,
        statements: [
          `const bn = Array.from(bytes)`,
          `bn.reverse()`,
          `if (bn.length < 1) return undefined`,
          `const command_id = bn.splice(-1)[0] || 0`,
          `switch (command_id) {\n${Object.entries(schema.commands)
            .map(([name, command]) => {
              return `case ${command.id}: const ${snakeCase(name)} = ${pascalCase(name)}.deserialize(bn); return ${snakeCase(name)} ? new ${pascalCase(schema.name)}(${snakeCase(name)}) : undefined;\n`;
            })
            .join(" ")} default: return undefined; }`,
        ],
      },
    ],
    isExported: true,
  });

  for (const [name, command] of Object.entries(schema.commands)) {
    generate_command(sourceFile, name, command);
  }

  await sourceFile.save();
}

export function generate_command(
  sourceFile: SourceFile,
  name: string,
  command: Command,
) {
  sourceFile.addClass({
    name: `${pascalCase(name)}`,
    docs: command.description !== undefined ? [command.description] : undefined,
    isExported: true,
    properties: command.arguments.map((arg) => {
      return {
        name: snakeCase(arg.name),
        type: parse_argument_format(arg.format),
        docs: arg.description !== undefined ? [arg.description] : undefined,
      };
    }),
    ctors: [
      {
        parameters: command.arguments.map((arg) => {
          return {
            name: snakeCase(arg.name),
            type: parse_argument_format(arg.format),
          };
        }),
        statements: command.arguments.map((arg) => {
          return `this.${snakeCase(arg.name)} = ${snakeCase(arg.name)}`;
        }),
      },
    ],
    methods: [
      serialize_command(name, command),
      deserialize_command(name, command),
    ],
  });
}

function parse_argument_format(format: ArgumentFormat): string {
  switch (format) {
    case "U8":
    case "U16":
    case "U32":
    case "I8":
    case "I16":
    case "I32":
    case "F32":
    case "F64":
      return "number";
    case "U64":
    case "I64":
      return "bigint";
    case "String":
      return "string";
  }
}
