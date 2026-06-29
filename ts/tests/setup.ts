import { schema_from_path } from "../src/format";
import { generate_schema } from "../src/generate";

await generate_schema(await schema_from_path("../test/schema.toml"));
await generate_schema(await schema_from_path("../test/empty.toml"));
