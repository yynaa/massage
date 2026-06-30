#[allow(unused)]
pub(super) fn ser_u8(value: u8) -> Vec<u8> {
  vec![value]
}

#[allow(unused)]
pub(super) fn de_u8(bytes: Vec<u8>) -> Option<u8> {
  bytes.get(0).copied()
}

#[allow(unused)]
pub(super) fn ser_u16(value: u16) -> Vec<u8> {
  value.to_le_bytes().to_vec()
}

#[allow(unused)]
pub(super) fn de_u16(bytes: Vec<u8>) -> Option<u16> {
  bytes.try_into().map(|v| u16::from_le_bytes(v)).ok()
}

#[allow(unused)]
pub(super) fn ser_u32(value: u32) -> Vec<u8> {
  value.to_le_bytes().to_vec()
}

#[allow(unused)]
pub(super) fn de_u32(bytes: Vec<u8>) -> Option<u32> {
  bytes.try_into().map(|v| u32::from_le_bytes(v)).ok()
}

#[allow(unused)]
pub(super) fn ser_u64(value: u64) -> Vec<u8> {
  value.to_le_bytes().to_vec()
}

#[allow(unused)]
pub(super) fn de_u64(bytes: Vec<u8>) -> Option<u64> {
  bytes.try_into().map(|v| u64::from_le_bytes(v)).ok()
}

#[allow(unused)]
pub(super) fn ser_i8(value: i8) -> Vec<u8> {
  vec![value as u8]
}

#[allow(unused)]
pub(super) fn de_i8(bytes: Vec<u8>) -> Option<i8> {
  bytes.get(0).map(|&u| u as i8)
}

#[allow(unused)]
pub(super) fn ser_i16(value: i16) -> Vec<u8> {
  (value as u16).to_le_bytes().to_vec()
}

#[allow(unused)]
pub(super) fn de_i16(bytes: Vec<u8>) -> Option<i16> {
  bytes.try_into().map(|v| i16::from_le_bytes(v)).ok()
}

#[allow(unused)]
pub(super) fn ser_i32(value: i32) -> Vec<u8> {
  (value as u32).to_le_bytes().to_vec()
}

#[allow(unused)]
pub(super) fn de_i32(bytes: Vec<u8>) -> Option<i32> {
  bytes.try_into().map(|v| i32::from_le_bytes(v)).ok()
}

#[allow(unused)]
pub(super) fn ser_i64(value: i64) -> Vec<u8> {
  (value as u64).to_le_bytes().to_vec()
}

#[allow(unused)]
pub(super) fn de_i64(bytes: Vec<u8>) -> Option<i64> {
  bytes.try_into().map(|v| i64::from_le_bytes(v)).ok()
}

#[allow(unused)]
pub(super) fn ser_f32(value: f32) -> Vec<u8> {
  value.to_le_bytes().to_vec()
}

#[allow(unused)]
pub(super) fn de_f32(bytes: Vec<u8>) -> Option<f32> {
  bytes.try_into().map(|v| f32::from_le_bytes(v)).ok()
}

#[allow(unused)]
pub(super) fn ser_f64(value: f64) -> Vec<u8> {
  value.to_le_bytes().to_vec()
}

#[allow(unused)]
pub(super) fn de_f64(bytes: Vec<u8>) -> Option<f64> {
  bytes.try_into().map(|v| f64::from_le_bytes(v)).ok()
}

#[allow(unused)]
pub(super) fn ser_string(value: String) -> Vec<u8> {
  let mut v = value.as_bytes().to_vec();
  v.push(0);
  v
}

#[allow(unused)]
pub(super) fn de_string(mut bytes: Vec<u8>) -> Option<String> {
  String::from_utf8(bytes).ok()
}
