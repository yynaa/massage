use heck::ToSnakeCase;
use proc_macro2::{Span, TokenStream};
use quote::quote;
use syn::Ident;

use crate::format::{Argument, ArgumentFormat, Command, Schema};

pub(crate) fn deserialize_message(
  _schema: Schema,
  ident_name: Ident,
  enum_name: Ident,
) -> TokenStream {
  let output = quote! {
    impl #ident_name {
      pub fn deserialize(mut bytes: Vec<u8>) -> Option<Self> {
        bytes.reverse();

        if let Some(d) = #enum_name::deserialize(bytes) {
          Some(Self {
            command: d
          })
        } else {
          None
        }
      }
    }
  };

  output
}

pub(crate) fn deserialize_enum(
  schema: Schema,
  ident_name: Ident,
  command_names: Vec<Ident>,
) -> TokenStream {
  let command_ids: Vec<u8> = schema.commands.iter().map(|f| f.1.id).collect();

  let output = quote! {
    impl #ident_name {
      pub fn deserialize(mut bytes: Vec<u8>) -> Option<Self> {
        if bytes.len() == 0 {return None;}
        let command_id = bytes.pop().unwrap();
        match command_id {
          #(#command_ids => #command_names::deserialize(bytes).map(|a| Self::#command_names(a)),)*
          _ => None
        }
      }
    }
  };

  output
}

pub(crate) fn deserialize_command(
  command: Command,
  ident_name: Ident,
  argument_names: Vec<Ident>,
) -> TokenStream {
  let argument_generators: Vec<TokenStream> = command
    .arguments
    .iter()
    .map(|f| deserialize_argument(f.clone()))
    .collect();
  let argument_variables = command
    .arguments
    .iter()
    .map(|f| {
      Ident::new(
        &format!("arg_{}", f.name.to_snake_case()),
        Span::call_site(),
      )
    })
    .collect::<Vec<_>>();

  let output = if command.arguments.len() > 0 {
    quote! {
      impl #ident_name {

        pub fn deserialize(#[allow(unused_mut)] mut bytes: Vec<u8>) -> Option<Self> {
          #(
            let #argument_variables = {#argument_generators};
          )*
          if #(let Some(#argument_variables) = #argument_variables)&&* {
            Some(Self {
              #(#argument_names: #argument_variables),*
            })
          } else {
            None
          }
        }
      }
    }
  } else {
    quote! {
      impl #ident_name {
        pub fn deserialize(_bytes: Vec<u8>) -> Option<Self> {
          Some(Self {})
        }
      }
    }
  };

  output
}

fn deserialize_argument(argument: Argument) -> TokenStream {
  match argument.format {
    ArgumentFormat::U8 => quote! {
      bytes.pop()
    },
    ArgumentFormat::I8 => quote! {
      bytes.pop().map(|u| u as i8)
    },
    ArgumentFormat::U16 => quote! {
      let len = bytes.len();
      if len >= 2 {
        let b = bytes.split_off(len-2);
        Some(u16::from_le_bytes(b.try_into().unwrap()))
      } else {
        None
      }
    },
    ArgumentFormat::I16 => quote! {
      let len = bytes.len();
      if len >= 2 {
        let b = bytes.split_off(len-2);
        Some(i16::from_le_bytes(b.try_into().unwrap()))
      } else {
        None
      }
    },
    ArgumentFormat::U32 => quote! {
      let len = bytes.len();
      if len >= 4 {
        let b = bytes.split_off(len-4);
        Some(u32::from_le_bytes(b.try_into().unwrap()))
      } else {
        None
      }
    },
    ArgumentFormat::I32 => quote! {
      let len = bytes.len();
      if len >= 4 {
        let b = bytes.split_off(len-4);
        Some(i32::from_le_bytes(b.try_into().unwrap()))
      } else {
        None
      }
    },
    ArgumentFormat::U64 => quote! {
      let len = bytes.len();
      if len >= 8 {
        let b = bytes.split_off(len-8);
        Some(u64::from_le_bytes(b.try_into().unwrap()))
      } else {
        None
      }
    },
    ArgumentFormat::I64 => quote! {
      let len = bytes.len();
      if len >= 8 {
        let b = bytes.split_off(len-8);
        Some(i64::from_le_bytes(b.try_into().unwrap()))
      } else {
        None
      }
    },
    ArgumentFormat::F32 => quote! {
      let len = bytes.len();
      if len >= 4 {
        let b = bytes.split_off(len-4);
        Some(f32::from_le_bytes(b.try_into().unwrap()))
      } else {
        None
      }
    },
    ArgumentFormat::F64 => quote! {
      let len = bytes.len();
      if len >= 8 {
        let b = bytes.split_off(len-8);
        Some(f64::from_le_bytes(b.try_into().unwrap()))
      } else {
        None
      }
    },
    ArgumentFormat::String => quote! {
      // if let Some(str_len) = bytes.pop() {
      //   let len = bytes.len();
      //   if len >= str_len as usize {
      //     let mut b = bytes.split_off(len-str_len as usize);
      //     b.reverse();
      //     if let Ok(string) = String::from_utf8(b) {
      //       Some(string)
      //     } else {
      //       None
      //     }
      //   } else {
      //     None
      //   }
      // } else {
      //   None
      // }
      let mut result = None;
      let mut res_bytes = vec![];
      while let Some(str_byte) = bytes.pop() {
        if str_byte == 0 {
          if let Ok(string) = String::from_utf8(res_bytes) {
            result = Some(string);
          }
          break;
        } else {
          res_bytes.push(str_byte);
        }
      }
      result
    },
  }
}
