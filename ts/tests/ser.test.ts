import { expect, test } from "bun:test";
import * as schm from "@massage/Test";

test("serialize empty", () => {
  const m = new schm.Test(new schm.Empty());
  expect(() => m._serialize()).not.toThrow();
});

test("serialize u8", () => {
  const m = new schm.Test(new schm.U8(69));
  const ser = m._serialize();
  expect(ser[1]).toBe(69);
  expect(ser.length).toBe(2);
});

test("serialize bool", () => {
  const m = new schm.Test(new schm.Bool(true));
  const ser = m._serialize();
  expect(ser[1]).toBe(1);
  expect(ser.length).toBe(2);
});

test("serialize u16", () => {
  const m = new schm.Test(new schm.U16(0x1234));
  const ser = m._serialize();
  expect(ser[1]).toBe(0x34);
  expect(ser[2]).toBe(0x12);
  expect(ser.length).toBe(3);
});

test("serialize u32", () => {
  const m = new schm.Test(new schm.U32(0x12345678));
  const ser = m._serialize();
  expect(ser[1]).toBe(0x78);
  expect(ser[2]).toBe(0x56);
  expect(ser[3]).toBe(0x34);
  expect(ser[4]).toBe(0x12);
  expect(ser.length).toBe(5);
});

test("serialize u64", () => {
  const m = new schm.Test(new schm.U64(0x123456789abcdef0n));
  const ser = m._serialize();
  expect(ser[1]).toBe(0xf0);
  expect(ser[2]).toBe(0xde);
  expect(ser[3]).toBe(0xbc);
  expect(ser[4]).toBe(0x9a);
  expect(ser[5]).toBe(0x78);
  expect(ser[6]).toBe(0x56);
  expect(ser[7]).toBe(0x34);
  expect(ser[8]).toBe(0x12);
  expect(ser.length).toBe(9);
});

test("serialize i8", () => {
  const m = new schm.Test(new schm.I8(69));
  const ser = m._serialize();
  expect(ser[1]).toBe(69);
  expect(ser.length).toBe(2);
});

test("serialize i16", () => {
  const m = new schm.Test(new schm.I16(0x1234));
  const ser = m._serialize();
  expect(ser[1]).toBe(0x34);
  expect(ser[2]).toBe(0x12);
  expect(ser.length).toBe(3);
});

test("serialize i32", () => {
  const m = new schm.Test(new schm.I32(0x12345678));
  const ser = m._serialize();
  expect(ser[1]).toBe(0x78);
  expect(ser[2]).toBe(0x56);
  expect(ser[3]).toBe(0x34);
  expect(ser[4]).toBe(0x12);
  expect(ser.length).toBe(5);
});

test("serialize i64", () => {
  const m = new schm.Test(new schm.I64(0x123456789abcdef0n));
  const ser = m._serialize();
  expect(ser[1]).toBe(0xf0);
  expect(ser[2]).toBe(0xde);
  expect(ser[3]).toBe(0xbc);
  expect(ser[4]).toBe(0x9a);
  expect(ser[5]).toBe(0x78);
  expect(ser[6]).toBe(0x56);
  expect(ser[7]).toBe(0x34);
  expect(ser[8]).toBe(0x12);
  expect(ser.length).toBe(9);
});

test("serialize i8 negative", () => {
  const m = new schm.Test(new schm.I8(-69));
  const ser = m._serialize();
  expect(ser[1]).toBe(187);
  expect(ser.length).toBe(2);
});

test("serialize i16 negative", () => {
  const m = new schm.Test(new schm.I16(-0x1234));
  const ser = m._serialize();
  expect(ser[1]).toBe(0xcc);
  expect(ser[2]).toBe(0xed);
  expect(ser.length).toBe(3);
});

test("serialize i32 negative", () => {
  const m = new schm.Test(new schm.I32(-0x12345678));
  const ser = m._serialize();
  expect(ser[1]).toBe(0x88);
  expect(ser[2]).toBe(0xa9);
  expect(ser[3]).toBe(0xcb);
  expect(ser[4]).toBe(0xed);
  expect(ser.length).toBe(5);
});

test("serialize i64 negative", () => {
  const m = new schm.Test(new schm.I64(-0x123456789abcdef0n));
  const ser = m._serialize();
  expect(ser[1]).toBe(0x10);
  expect(ser[2]).toBe(0x21);
  expect(ser[3]).toBe(0x43);
  expect(ser[4]).toBe(0x65);
  expect(ser[5]).toBe(0x87);
  expect(ser[6]).toBe(0xa9);
  expect(ser[7]).toBe(0xcb);
  expect(ser[8]).toBe(0xed);
  expect(ser.length).toBe(9);
});

test("serialize string", () => {
  const m = new schm.Test(new schm.Str("hello!"));
  const ser = m._serialize();
  expect(ser[1]).toBe(0x68);
  expect(ser[7]).toBe(0x0);
  expect(ser.length).toBe(8);
});

test("serialize f32", () => {
  const m = new schm.Test(new schm.F32(Math.PI));
  const ser = m._serialize();
  expect(ser[1]).toBe(0xdb);
  expect(ser[2]).toBe(0x0f);
  expect(ser[3]).toBe(0x49);
  expect(ser[4]).toBe(0x40);
  expect(ser.length).toBe(5);
});

test("serialize f64", () => {
  const m = new schm.Test(new schm.F64(Math.PI));
  const ser = m._serialize();
  expect(ser[1]).toBe(0x18);
  expect(ser[2]).toBe(0x2d);
  expect(ser[3]).toBe(0x44);
  expect(ser[4]).toBe(0x54);
  expect(ser[5]).toBe(0xfb);
  expect(ser[6]).toBe(0x21);
  expect(ser[7]).toBe(0x09);
  expect(ser[8]).toBe(0x40);
  expect(ser.length).toBe(9);
});

test("serialize zero termination", () => {
  const m = new schm.Test(new schm.ZeroTermination("hello!", 69));
  const ser = m._serialize();
  expect(ser[7]).toBe(0x0);
  expect(ser.length).toBe(9);
});
