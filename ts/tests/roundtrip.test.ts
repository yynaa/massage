import { expect, test } from "bun:test";
import * as schm from "@massage/Test";

test("roundtrip empty", () => {
  const m = new schm.Test(new schm.Empty());
  expect(schm.Test.deserialize(m.serialize())).toEqual(m);
});

test("roundtrip u8", () => {
  const m = new schm.Test(new schm.U8(6));
  expect(schm.Test.deserialize(m.serialize())).toEqual(m);
});

test("roundtrip u16", () => {
  const m = new schm.Test(new schm.U16(6));
  expect(schm.Test.deserialize(m.serialize())).toEqual(m);
});

test("roundtrip u32", () => {
  const m = new schm.Test(new schm.U32(6));
  expect(schm.Test.deserialize(m.serialize())).toEqual(m);
});

test("roundtrip u64", () => {
  const m = new schm.Test(new schm.U64(6n));
  expect(schm.Test.deserialize(m.serialize())).toEqual(m);
});

test("roundtrip i8", () => {
  const m = new schm.Test(new schm.I8(6));
  expect(schm.Test.deserialize(m.serialize())).toEqual(m);
});

test("roundtrip i16", () => {
  const m = new schm.Test(new schm.I16(6));
  expect(schm.Test.deserialize(m.serialize())).toEqual(m);
});

test("roundtrip i32", () => {
  const m = new schm.Test(new schm.I32(6));
  expect(schm.Test.deserialize(m.serialize())).toEqual(m);
});

test("roundtrip i64", () => {
  const m = new schm.Test(new schm.I64(6n));
  expect(schm.Test.deserialize(m.serialize())).toEqual(m);
});

test("roundtrip string", () => {
  const m = new schm.Test(new schm.Str("hello"));
  expect(schm.Test.deserialize(m.serialize())).toEqual(m);
});

test("roundtrip f32", () => {
  const m = new schm.Test(new schm.F32(6));
  expect(schm.Test.deserialize(m.serialize())).toEqual(m);
});

test("roundtrip f64", () => {
  const m = new schm.Test(new schm.F64(6));
  expect(schm.Test.deserialize(m.serialize())).toEqual(m);
});
