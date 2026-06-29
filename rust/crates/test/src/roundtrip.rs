use crate::schema;

#[test]
fn roundtrip_empty() {
  let m: schema::Test = schema::Empty {}.into();
  assert_eq!(m, schema::Test::deserialize(m.serialize()).unwrap())
}

#[test]
fn roundtrip_u8() {
  let m: schema::Test = schema::U8 { value: 6 }.into();
  assert_eq!(m, schema::Test::deserialize(m.serialize()).unwrap())
}

#[test]
fn roundtrip_u16() {
  let m: schema::Test = schema::U16 { value: 6 }.into();
  assert_eq!(m, schema::Test::deserialize(m.serialize()).unwrap())
}

#[test]
fn roundtrip_u32() {
  let m: schema::Test = schema::U32 { value: 6 }.into();
  assert_eq!(m, schema::Test::deserialize(m.serialize()).unwrap())
}

#[test]
fn roundtrip_u64() {
  let m: schema::Test = schema::U64 { value: 6 }.into();
  assert_eq!(m, schema::Test::deserialize(m.serialize()).unwrap())
}

#[test]
fn roundtrip_i8() {
  let m: schema::Test = schema::I8 { value: 6 }.into();
  assert_eq!(m, schema::Test::deserialize(m.serialize()).unwrap())
}

#[test]
fn roundtrip_i16() {
  let m: schema::Test = schema::I16 { value: 6 }.into();
  assert_eq!(m, schema::Test::deserialize(m.serialize()).unwrap())
}

#[test]
fn roundtrip_i32() {
  let m: schema::Test = schema::I32 { value: 6 }.into();
  assert_eq!(m, schema::Test::deserialize(m.serialize()).unwrap())
}

#[test]
fn roundtrip_i64() {
  let m: schema::Test = schema::I64 { value: 6 }.into();
  assert_eq!(m, schema::Test::deserialize(m.serialize()).unwrap())
}

#[test]
fn roundtrip_string() {
  let m: schema::Test = schema::Str {
    value: "hello".into(),
  }
  .into();
  assert_eq!(m, schema::Test::deserialize(m.serialize()).unwrap())
}

#[test]
fn roundtrip_f32() {
  let m: schema::Test = schema::F32 { value: 6. }.into();
  assert_eq!(m, schema::Test::deserialize(m.serialize()).unwrap())
}

#[test]
fn roundtrip_f64() {
  let m: schema::Test = schema::F64 { value: 6. }.into();
  assert_eq!(m, schema::Test::deserialize(m.serialize()).unwrap())
}
