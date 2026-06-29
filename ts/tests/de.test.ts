import { expect, test } from "bun:test";
import * as schm from "@massage/Test";

test("deserialize empty", () => {
  const m = schm.Test.deserialize(new Uint8Array([0]));
  expect(m).not.toBeUndefined();
});

test("deserialize u8", () => {
  const m = schm.Test.deserialize(new Uint8Array([1, 69]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.U8(69)));
});

test("deserialize u16", () => {
  const m = schm.Test.deserialize(new Uint8Array([2, 0x12, 0x34]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.U16(0x1234)));
});

test("deserialize u32", () => {
  const m = schm.Test.deserialize(new Uint8Array([3, 0x12, 0x34, 0x56, 0x78]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.U32(0x12345678)));
});

test("deserialize u64", () => {
  const m = schm.Test.deserialize(new Uint8Array([4, 0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.U64(0x123456789ABCDEF0n)));
});

test("deserialize i8", () => {
  const m = schm.Test.deserialize(new Uint8Array([5, 69]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.I8(69)));
});

test("deserialize i16", () => {
  const m = schm.Test.deserialize(new Uint8Array([6, 0x12, 0x34]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.I16(0x1234)));
});

test("deserialize i32", () => {
  const m = schm.Test.deserialize(new Uint8Array([7, 0x12, 0x34, 0x56, 0x78]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.I32(0x12345678)));
});

test("deserialize i64", () => {
  const m = schm.Test.deserialize(new Uint8Array([8, 0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.I64(0x123456789ABCDEF0n)));
});

test("deserialize i8 negative", () => {
  const m = schm.Test.deserialize(new Uint8Array([5, 187]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.I8(-69)));
});

test("deserialize i16 negative", () => {
  const m = schm.Test.deserialize(new Uint8Array([6, 0xED, 0xCC]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.I16(-0x1234)));
});

test("deserialize i32 negative", () => {
  const m = schm.Test.deserialize(new Uint8Array([7, 0xED, 0xCB, 0xA9, 0x88]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.I32(-0x12345678)));
});

test("deserialize i64 negative", () => {
  const m = schm.Test.deserialize(new Uint8Array([8, 0xED, 0xCB, 0xA9, 0x87, 0x65, 0x43, 0x21, 0x10]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.I64(-0x123456789ABCDEF0n)));
});

test("deserialize string", () => {
  const m = schm.Test.deserialize(new Uint8Array([9, 6, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x21]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.Str("hello!")));
});

test("deserialize f32", () => {
  const m = schm.Test.deserialize(new Uint8Array([10, 0x40, 0x49, 0x0f, 0xdb]));
  expect(m).not.toBeUndefined();
});

test("deserialize f64", () => {
  const m = schm.Test.deserialize(new Uint8Array([11, 0x40, 0x09, 0x21, 0xFB, 0x54, 0x44, 0x2D, 0x18]));
  expect(m).not.toBeUndefined();
});
