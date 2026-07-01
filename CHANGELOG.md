# Changelog

## 0.25.07.3

| **Rust** | **TS** | **LuaJIT** |
|:---:|:---:|:---:|
| 0.2.0 | 0.3.0 | 0.4.0 |

### Added

- [Lua] Deserialization also returns message length

## 0.25.07.2

| **Rust** | **TS** | **LuaJIT** |
|:---:|:---:|:---:|
| 0.2.0 | 0.3.0 | 0.3.0 |

### Added

- [TS] Added wrapper `com._wrap()` that wraps a command into a message

### Changed

- [Lua] Require PATH to generation folder is now needed when building message code (compatibility)
- [TS] `msg.serialize()` has become `msg._serialize()` to avoid collisions with schema arguments

## 0.25.07.1

| **Rust** | **TS** | **LuaJIT** |
|:---:|:---:|:---:|
| 0.2.0 | 0.2.0 | 0.2.0 |

### Added

- [*] Bool type
- [Lua] Tests

### Fixed

- [Rust] Incorrect Cargo.toml would cause crate to not build properly
- [TS] Cleaned up source

## 0.25.07.0

| **Rust** | **TS** | **LuaJIT** |
|:---:|:---:|:---:|
| 0.1.0 | 0.1.0 | 0.1.0 |

### Added

- Initial release

# Map

| **Global** | **Rust** | **TS** | **LuaJIT** |
|:---:|:---:|:---:|:---:|
| 0.25.07.3 | 0.2.0 | 0.3.0 | 0.4.0 |
| 0.25.07.2 | 0.2.0 | 0.3.0 | 0.3.0 |
| 0.25.07.1 | 0.2.0 | 0.2.0 | 0.2.0 |
| 0.25.07.0 | 0.1.0 | 0.1.0 | 0.1.0 |
