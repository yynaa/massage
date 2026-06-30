#![allow(irrefutable_let_patterns)]

use crate::simple::{Hello, Simple, SimpleCommands};

// include your message to your crate
mod simple {
  include!(concat!(env!("OUT_DIR"), "/simple.rs"));
}

fn main() {
  // create a new message
  let mut message: Simple = Hello {
    name: "Sophie".into(),
  }
  .into();
  println!("message: {}", message);

  // edit your message
  if let SimpleCommands::Hello(hello) = &mut message.command {
    hello.name = "Not Sophie".into();
  }

  // serialize your message
  let ser = message.serialize();
  println!("serialized: {:?}", ser);

  // deserialize your message
  let de = Simple::deserialize(ser).unwrap();
  println!("deserialized: {}", de);
}
