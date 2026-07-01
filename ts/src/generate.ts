import { Project, ScriptTarget, SourceFile } from "ts-morph";
import { copyFileSync, existsSync } from "fs";

import type { ArgumentFormat, Command, Schema } from "./format";
import { pascalCase, snakeCase } from "change-case";
import { serialize_command } from "./ser";
import { deserialize_command } from "./de";

export async function generate_schema(
  schema: Schema,
  folder: string = "./.generated",
) {
  const project = new Project({
    compilerOptions: {
      target: ScriptTarget.ES2015,
    },
  });
  const sourceFile = project.createSourceFile(
    `${folder}/${pascalCase(schema.name)}.ts`,
    undefined,
    { overwrite: true },
  );
  sourceFile.addImportDeclaration({
    moduleSpecifier: "./_primitives",
    namespaceImport: "primitives",
  });
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
        name: "_serialize",
        returnType: "Uint8Array",
        statements: [`return this.command._serialize()`],
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
          `if (bn.length < 1) return undefined`,
          `const command_id = bn.shift()`,
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
    generate_command(sourceFile, schema, name, command);
  }

  await sourceFile.save();

  if (existsSync("node_modules/massage/src/_primitives.ts")) {
    copyFileSync(
      "node_modules/massage/src/_primitives.ts",
      `${folder}/_primitives.ts`,
    );
  } else if (existsSync("src/_primitives.ts")) {
    copyFileSync("src/_primitives.ts", `${folder}/_primitives.ts`);
  }
}

export function generate_command(
  sourceFile: SourceFile,
  schema: Schema,
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
      {
        name: "_wrap",
        returnType: `${pascalCase(schema.name)}`,
        statements: [`return new ${pascalCase(schema.name)}(this)`],
      },
      serialize_command(name, command),
      deserialize_command(name, command),
    ],
  });
}

function parse_argument_format(format: ArgumentFormat): string {
  switch (format) {
    case "Bool":
      return "boolean";
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
