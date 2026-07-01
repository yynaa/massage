export function serU8(value: number): number[] {
  const buf = new ArrayBuffer(1);
  const dv = new DataView(buf);
  dv.setUint8(0, value);
  return [...new Uint8Array(buf)];
}
export function deU8(bytes: number[]): number | undefined {
  const dv = new DataView(new Uint8Array(bytes).buffer);
  return dv.getUint8(0);
}

export function serU16(value: number): number[] {
  const buf = new ArrayBuffer(2);
  const dv = new DataView(buf);
  dv.setUint16(0, value, true);
  return [...new Uint8Array(buf)];
}
export function deU16(bytes: number[]): number | undefined {
  const dv = new DataView(new Uint8Array(bytes).buffer);
  return dv.getUint16(0, true);
}

export function serU32(value: number): number[] {
  const buf = new ArrayBuffer(4);
  const dv = new DataView(buf);
  dv.setUint32(0, value, true);
  return [...new Uint8Array(buf)];
}
export function deU32(bytes: number[]): number | undefined {
  const dv = new DataView(new Uint8Array(bytes).buffer);
  return dv.getUint32(0, true);
}

export function serU64(value: bigint): number[] {
  const buf = new ArrayBuffer(8);
  const dv = new DataView(buf);
  dv.setBigUint64(0, value, true);
  return [...new Uint8Array(buf)];
}
export function deU64(bytes: number[]): bigint | undefined {
  const dv = new DataView(new Uint8Array(bytes).buffer);
  return dv.getBigUint64(0, true);
}

export function serI8(value: number): number[] {
  const buf = new ArrayBuffer(1);
  const dv = new DataView(buf);
  dv.setInt8(0, value);
  return [...new Uint8Array(buf)];
}
export function deI8(bytes: number[]): number | undefined {
  const dv = new DataView(new Uint8Array(bytes).buffer);
  return dv.getInt8(0);
}

export function serI16(value: number): number[] {
  const buf = new ArrayBuffer(2);
  const dv = new DataView(buf);
  dv.setInt16(0, value, true);
  return [...new Uint8Array(buf)];
}
export function deI16(bytes: number[]): number | undefined {
  const dv = new DataView(new Uint8Array(bytes).buffer);
  return dv.getInt16(0, true);
}

export function serI32(value: number): number[] {
  const buf = new ArrayBuffer(4);
  const dv = new DataView(buf);
  dv.setInt32(0, value, true);
  return [...new Uint8Array(buf)];
}
export function deI32(bytes: number[]): number | undefined {
  const dv = new DataView(new Uint8Array(bytes).buffer);
  return dv.getInt32(0, true);
}

export function serI64(value: bigint): number[] {
  const buf = new ArrayBuffer(8);
  const dv = new DataView(buf);
  dv.setBigInt64(0, value, true);
  return [...new Uint8Array(buf)];
}
export function deI64(bytes: number[]): bigint | undefined {
  const dv = new DataView(new Uint8Array(bytes).buffer);
  return dv.getBigInt64(0, true);
}

export function serF32(value: number): number[] {
  const buf = new ArrayBuffer(4);
  const dv = new DataView(buf);
  dv.setFloat32(0, value, true);
  return [...new Uint8Array(buf)];
}
export function deF32(bytes: number[]): number | undefined {
  const dv = new DataView(new Uint8Array(bytes).buffer);
  return dv.getFloat32(0, true);
}

export function serF64(value: number): number[] {
  const buf = new ArrayBuffer(8);
  const dv = new DataView(buf);
  dv.setFloat64(0, value, true);
  return [...new Uint8Array(buf)];
}
export function deF64(bytes: number[]): number | undefined {
  const dv = new DataView(new Uint8Array(bytes).buffer);
  return dv.getFloat64(0, true);
}

export function serString(value: string): number[] {
  return [...new TextEncoder().encode(value), 0];
}
export function deString(bytes: number[]): string | undefined {
  return new TextDecoder().decode(new Uint8Array(bytes.slice(0, -1)));
}

export function serBool(value: boolean): number[] {
  return [value ? 1 : 0];
}
export function deBool(value: number[]): boolean | undefined {
  if (value[0] !== undefined) {
    return value[0] > 0;
  } else {
    return undefined;
  }
}
