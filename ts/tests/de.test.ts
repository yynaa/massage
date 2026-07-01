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

test("deserialize bool", () => {
  const m = schm.Test.deserialize(new Uint8Array([12, 1]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.Bool(true)));
});

test("deserialize u16", () => {
  const m = schm.Test.deserialize(new Uint8Array([2, 0x34, 0x12]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.U16(0x1234)));
});

test("deserialize u32", () => {
  const m = schm.Test.deserialize(new Uint8Array([3, 0x78, 0x56, 0x34, 0x12]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.U32(0x12345678)));
});

test("deserialize u64", () => {
  const m = schm.Test.deserialize(
    new Uint8Array([4, 0xf0, 0xde, 0xbc, 0x9a, 0x78, 0x56, 0x34, 0x12]),
  );
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.U64(0x123456789abcdef0n)));
});

test("deserialize i8", () => {
  const m = schm.Test.deserialize(new Uint8Array([5, 69]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.I8(69)));
});

test("deserialize i16", () => {
  const m = schm.Test.deserialize(new Uint8Array([6, 0x34, 0x12]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.I16(0x1234)));
});

test("deserialize i32", () => {
  const m = schm.Test.deserialize(new Uint8Array([7, 0x78, 0x56, 0x34, 0x12]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.I32(0x12345678)));
});

test("deserialize i64", () => {
  const m = schm.Test.deserialize(
    new Uint8Array([8, 0xf0, 0xde, 0xbc, 0x9a, 0x78, 0x56, 0x34, 0x12]),
  );
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.I64(0x123456789abcdef0n)));
});

test("deserialize i8 negative", () => {
  const m = schm.Test.deserialize(new Uint8Array([5, 187]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.I8(-69)));
});

test("deserialize i16 negative", () => {
  const m = schm.Test.deserialize(new Uint8Array([6, 0xcc, 0xed]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.I16(-0x1234)));
});

test("deserialize i32 negative", () => {
  const m = schm.Test.deserialize(new Uint8Array([7, 0x88, 0xa9, 0xcb, 0xed]));
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.I32(-0x12345678)));
});

test("deserialize i64 negative", () => {
  const m = schm.Test.deserialize(
    new Uint8Array([8, 0x10, 0x21, 0x43, 0x65, 0x87, 0xa9, 0xcb, 0xed]),
  );
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.I64(-0x123456789abcdef0n)));
});

test("deserialize string", () => {
  const m = schm.Test.deserialize(
    new Uint8Array([9, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x21, 0]),
  );
  expect(m).not.toBeUndefined();
  expect(m).toEqual(new schm.Test(new schm.Str("hello!")));
});

test("deserialize f32", () => {
  const m = schm.Test.deserialize(new Uint8Array([10, 0xdb, 0x0f, 0x49, 0x40]));
  expect(m).not.toBeUndefined();
});

test("deserialize f64", () => {
  const m = schm.Test.deserialize(
    new Uint8Array([11, 0x18, 0x2d, 0x44, 0x54, 0xfb, 0x21, 0x09, 0x40]),
  );
  expect(m).not.toBeUndefined();
});

test("no zero termination", () => {
  const m = schm.Test.deserialize(
    new Uint8Array([9, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x21]),
  );
  expect(m).toBeUndefined();
});
