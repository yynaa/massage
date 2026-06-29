import { expect, test } from "bun:test";
import { schema_from_path } from "../src/format";

test("parsing simple", () => {
  expect(async () => {
    await schema_from_path("../examples/simple.toml");
  }).not.toThrow();
});

test("parsing test", () => {
  expect(async () => {
    await schema_from_path("../test/schema.toml");
  }).not.toThrow();
});

test("parsing empty", () => {
  expect(async () => {
    await schema_from_path("../test/empty.toml");
  }).not.toThrow();
});
