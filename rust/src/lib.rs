use thiserror::Error;

pub mod de;
pub mod format;
pub mod generate;
pub mod ser;

#[derive(Debug, Error)]
pub enum Error {
  #[error(transparent)]
  IoError(#[from] std::io::Error),

  #[error(transparent)]
  TomlDeserError(#[from] toml::de::Error),
}

pub type Result<A> = core::result::Result<A, Error>;
