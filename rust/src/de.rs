use heck::{ToPascalCase, ToSnakeCase};
use proc_macro2::{Span, TokenStream};
use quote::quote;
use syn::Ident;

use crate::format::{Argument, ArgumentFormat, Command, Schema};

pub(crate) fn deserialize_enum(schema: Schema, ident_name: Ident) -> TokenStream {
  let command_names: Vec<Ident> = schema
    .commands
    .iter()
    .map(|(n, _)| Ident::new(&n.to_pascal_case(), Span::call_site()))
    .collect();

  let command_ids: Vec<u8> = schema.commands.iter().map(|f| f.1.id).collect();

  let output = quote! {
    impl #ident_name {
      pub fn deserialize(mut bytes: Vec<u8>) -> Option<Self> {
        if bytes.len() == 0 {return None;}
        bytes.reverse();
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

pub(crate) fn deserialize_command(command: Command, ident_name: Ident) -> TokenStream {
  let argument_generators: Vec<TokenStream> = command
    .arguments
    .iter()
    .map(|f| deserialize_argument(f.clone()))
    .collect();
  let argument_names = command
    .arguments
    .iter()
    .map(|f| Ident::new(&format!("{}", f.name.to_snake_case()), Span::call_site()))
    .collect::<Vec<_>>();
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

  let output = quote! {
    impl #ident_name {
      pub fn deserialize(mut bytes: Vec<u8>) -> Option<Self> {
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
  };

  output
}

fn deserialize_argument(argument: Argument) -> TokenStream {
  match argument.format {
    ArgumentFormat::U8 => quote! {
      bytes.pop()
    },
    ArgumentFormat::I8 => quote! {
      bytes.pop() as i8
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
    ArgumentFormat::String => quote! {
      if let Some(str_len) = bytes.pop() {
        let len = bytes.len();
        if len >= str_len as usize {
          let mut b = bytes.split_off(len-str_len as usize);
          b.reverse();
          if let Ok(string) = String::from_utf8(b) {
            Some(string)
          } else {
            None
          }
        } else {
          None
        }
      } else {
        None
      }
    },
  }
}
