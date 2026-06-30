use crate::schema;

#[test]
fn serialize_empty() {
  let m: schema::Test = schema::Empty {}.into();
  m.serialize();
}

#[test]
fn serialize_u8() {
  let m: schema::Test = schema::U8 { value: 69 }.into();
  let ser = m.serialize();
  assert!(ser[1] == 69);
  assert!(ser.len() == 2)
}

#[test]
fn serialize_u16() {
  let m: schema::Test = schema::U16 { value: 0x1234 }.into();
  let ser = m.serialize();
  assert!(ser[1] == 0x12);
  assert!(ser[2] == 0x34);
  assert!(ser.len() == 3)
}

#[test]
fn serialize_u32() {
  let m: schema::Test = schema::U32 { value: 0x12345678 }.into();
  let ser = m.serialize();
  assert!(ser[1] == 0x12);
  assert!(ser[2] == 0x34);
  assert!(ser[3] == 0x56);
  assert!(ser[4] == 0x78);
  assert!(ser.len() == 5)
}

#[test]
fn serialize_u64() {
  let m: schema::Test = schema::U64 {
    value: 0x123456789ABCDEF0,
  }
  .into();
  let ser = m.serialize();
  assert!(ser[1] == 0x12);
  assert!(ser[2] == 0x34);
  assert!(ser[3] == 0x56);
  assert!(ser[4] == 0x78);
  assert!(ser[5] == 0x9a);
  assert!(ser[6] == 0xbc);
  assert!(ser[7] == 0xde);
  assert!(ser[8] == 0xf0);
  assert!(ser.len() == 9)
}

#[test]
fn serialize_i8() {
  let m: schema::Test = schema::I8 { value: 69 }.into();
  let ser = m.serialize();
  assert!(ser[1] == 69);
  assert!(ser.len() == 2)
}

#[test]
fn serialize_i16() {
  let m: schema::Test = schema::I16 { value: 0x1234 }.into();
  let ser = m.serialize();
  assert!(ser[1] == 0x12);
  assert!(ser[2] == 0x34);
  assert!(ser.len() == 3)
}

#[test]
fn serialize_i32() {
  let m: schema::Test = schema::I32 { value: 0x12345678 }.into();
  let ser = m.serialize();
  assert!(ser[1] == 0x12);
  assert!(ser[2] == 0x34);
  assert!(ser[3] == 0x56);
  assert!(ser[4] == 0x78);
  assert!(ser.len() == 5)
}

#[test]
fn serialize_i64() {
  let m: schema::Test = schema::I64 {
    value: 0x123456789ABCDEF0,
  }
  .into();
  let ser = m.serialize();
  assert!(ser[1] == 0x12);
  assert!(ser[2] == 0x34);
  assert!(ser[3] == 0x56);
  assert!(ser[4] == 0x78);
  assert!(ser[5] == 0x9a);
  assert!(ser[6] == 0xbc);
  assert!(ser[7] == 0xde);
  assert!(ser[8] == 0xf0);
  assert!(ser.len() == 9)
}

#[test]
fn serialize_i8_negative() {
  let m: schema::Test = schema::I8 { value: -69 }.into();
  let ser = m.serialize();
  assert!(ser[1] == 187);
  assert!(ser.len() == 2)
}

#[test]
fn serialize_i16_negative() {
  let m: schema::Test = schema::I16 { value: -0x1234 }.into();
  let ser = m.serialize();
  assert!(ser[1] == 0xED);
  assert!(ser[2] == 0xCC);
  assert!(ser.len() == 3)
}

#[test]
fn serialize_i32_negative() {
  let m: schema::Test = schema::I32 { value: -0x12345678 }.into();
  let ser = m.serialize();
  assert!(ser[1] == 0xED);
  assert!(ser[2] == 0xCB);
  assert!(ser[3] == 0xA9);
  assert!(ser[4] == 0x88);
  assert!(ser.len() == 5)
}

#[test]
fn serialize_i64_negative() {
  let m: schema::Test = schema::I64 {
    value: -0x123456789ABCDEF0,
  }
  .into();
  let ser = m.serialize();
  assert!(ser[1] == 0xED);
  assert!(ser[2] == 0xCB);
  assert!(ser[3] == 0xA9);
  assert!(ser[4] == 0x87);
  assert!(ser[5] == 0x65);
  assert!(ser[6] == 0x43);
  assert!(ser[7] == 0x21);
  assert!(ser[8] == 0x10);
  assert!(ser.len() == 9)
}

#[test]
fn serialize_string() {
  let m: schema::Test = schema::Str {
    value: "hello!".into(),
  }
  .into();
  let ser = m.serialize();
  assert!(ser[1] == 0x68);
  assert!(ser[7] == 0x0);
  assert!(ser.len() == 8)
}

#[test]
fn serialize_f32() {
  let m: schema::Test = schema::F32 {
    value: std::f32::consts::PI,
  }
  .into();
  let ser = m.serialize();
  assert!(ser[1] == 0x40);
  assert!(ser[2] == 0x49);
  assert!(ser[3] == 0x0f);
  assert!(ser[4] == 0xdb);
  assert!(ser.len() == 5)
}

#[test]
fn serialize_f64() {
  let m: schema::Test = schema::F64 {
    value: std::f64::consts::PI,
  }
  .into();
  let ser = m.serialize();
  assert!(ser[1] == 0x40);
  assert!(ser[2] == 0x09);
  assert!(ser[3] == 0x21);
  assert!(ser[4] == 0xFB);
  assert!(ser[5] == 0x54);
  assert!(ser[6] == 0x44);
  assert!(ser[7] == 0x2D);
  assert!(ser[8] == 0x18);
  assert!(ser.len() == 9)
}

#[test]
fn serialize_zero_termination() {
  let m: schema::Test = schema::ZeroTermination {
    a: "hello!".into(),
    b: 0x69,
  }
  .into();
  let ser = m.serialize();
  assert!(ser.len() == 9);
  assert!(ser[7] == 0);
}
