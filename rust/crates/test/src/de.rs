use crate::schema;

#[test]
fn deserialize_empty() {
  let m = schema::Test::deserialize(vec![0]).unwrap();
  assert_eq!(m, schema::Empty {}.into());
}

#[test]
fn deserialize_u8() {
  let m = schema::Test::deserialize(vec![1, 69]).unwrap();
  assert_eq!(m, schema::U8 { value: 69 }.into());
}

#[test]
fn deserialize_bool() {
  let m = schema::Test::deserialize(vec![12, 1]).unwrap();
  assert_eq!(m, schema::Bool { value: true }.into());
}

#[test]
fn deserialize_u16() {
  let m = schema::Test::deserialize(vec![2, 0x34, 0x12]).unwrap();
  assert_eq!(m, schema::U16 { value: 0x1234 }.into());
}

#[test]
fn deserialize_u32() {
  let m = schema::Test::deserialize(vec![3, 0x78, 0x56, 0x34, 0x12]).unwrap();
  assert_eq!(m, schema::U32 { value: 0x12345678 }.into());
}

#[test]
fn deserialize_u64() {
  let m =
    schema::Test::deserialize(vec![4, 0xf0, 0xde, 0xbc, 0x9a, 0x78, 0x56, 0x34, 0x12]).unwrap();
  assert_eq!(
    m,
    schema::U64 {
      value: 0x123456789ABCDEF0,
    }
    .into()
  );
}

#[test]
fn deserialize_i8() {
  let m = schema::Test::deserialize(vec![5, 69]).unwrap();
  assert_eq!(m, schema::I8 { value: 69 }.into());
}

#[test]
fn deserialize_i16() {
  let m = schema::Test::deserialize(vec![6, 0x34, 0x12]).unwrap();
  assert_eq!(m, schema::I16 { value: 0x1234 }.into());
}

#[test]
fn deserialize_i32() {
  let m = schema::Test::deserialize(vec![7, 0x78, 0x56, 0x34, 0x12]).unwrap();
  assert_eq!(m, schema::I32 { value: 0x12345678 }.into());
}

#[test]
fn deserialize_i64() {
  let m =
    schema::Test::deserialize(vec![8, 0xf0, 0xde, 0xbc, 0x9a, 0x78, 0x56, 0x34, 0x12]).unwrap();
  assert_eq!(
    m,
    schema::I64 {
      value: 0x123456789ABCDEF0,
    }
    .into()
  );
}

#[test]
fn deserialize_i8_negative() {
  let m = schema::Test::deserialize(vec![5, 187]).unwrap();
  assert_eq!(m, schema::I8 { value: -69 }.into());
}

#[test]
fn deserialize_i16_negative() {
  let m = schema::Test::deserialize(vec![6, 0xCC, 0xED]).unwrap();
  assert_eq!(m, schema::I16 { value: -0x1234 }.into());
}

#[test]
fn deserialize_i32_negative() {
  let m = schema::Test::deserialize(vec![7, 0x88, 0xA9, 0xCB, 0xED]).unwrap();
  assert_eq!(m, schema::I32 { value: -0x12345678 }.into());
}

#[test]
fn deserialize_i64_negative() {
  let m =
    schema::Test::deserialize(vec![8, 0x10, 0x21, 0x43, 0x65, 0x87, 0xA9, 0xCB, 0xED]).unwrap();
  assert_eq!(
    m,
    schema::I64 {
      value: -0x123456789ABCDEF0,
    }
    .into()
  );
}

#[test]
fn deserialize_string() {
  let m = schema::Test::deserialize(vec![9, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x21, 0x0]).unwrap();
  assert_eq!(
    m,
    schema::Str {
      value: "hello!".into(),
    }
    .into()
  );
}

#[test]
fn deserialize_f32() {
  let m = schema::Test::deserialize(vec![10, 0xdb, 0x0f, 0x49, 0x40]).unwrap();
  assert_eq!(
    m,
    schema::F32 {
      value: std::f32::consts::PI,
    }
    .into()
  );
}

#[test]
fn deserialize_f64() {
  let m =
    schema::Test::deserialize(vec![11, 0x18, 0x2D, 0x44, 0x54, 0xFB, 0x21, 0x09, 0x40]).unwrap();
  assert_eq!(
    m,
    schema::F64 {
      value: std::f64::consts::PI,
    }
    .into()
  );
}

#[test]
fn no_zero_termination() {
  let m = schema::Test::deserialize(vec![9, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x21]);
  assert!(m.is_none());
}
