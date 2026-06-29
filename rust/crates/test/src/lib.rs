pub mod schema {
  include!(concat!(env!("OUT_DIR"), "/test.rs"));
}

pub mod empty {
  include!(concat!(env!("OUT_DIR"), "/empty.rs"));
}

#[cfg(test)]
mod de;
#[cfg(test)]
mod parsing_schema;
#[cfg(test)]
mod roundtrip;
#[cfg(test)]
mod ser;
