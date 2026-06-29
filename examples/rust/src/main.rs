use std::{u8, u16};

use crate::stress::{Hello, Stress};

pub mod stress {
  include!(concat!(env!("OUT_DIR"), "/stress.rs"));
}

fn main() {
  let message: Stress = Hello {
    a: u8::MAX,
    b: u16::MAX,
    c: String::from("helloooo!"),
  }
  .into();
  println!("{}", message);

  let ser = message.serialize();
  println!("serialized: {:?}", ser);

  let de = stress::Stress::deserialize(ser).unwrap();
  println!("deserialized: {}", de);
}
