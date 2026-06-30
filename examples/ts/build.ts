import { schema_from_path, generate_schema } from "massage";

// generate the schema
let schema = await schema_from_path("../simple.toml");
// build it
await generate_schema(schema, "./.generated");
