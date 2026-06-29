import { schema_from_path, generate_schema } from "massage";

let schema = await schema_from_path("../simple.toml");
await generate_schema(schema);
