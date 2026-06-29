use crate::simple::{Hello, Simple};

pub mod simple {
  include!(concat!(env!("OUT_DIR"), "/simple.rs"));
}

fn main() {
  let message: Simple = Hello {
    name: "Sophie".into(),
  }
  .into();
  println!("{}", message);

  let ser = message.serialize();
  println!("serialized: {:?}", ser);

  let de = Simple::deserialize(ser).unwrap();
  println!("deserialized: {}", de);
}
