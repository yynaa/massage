import { Hello, Simple } from "@massage/Simple";

const c = new Hello("Sophie");
const s = new Simple(c);
console.log(s);

const ser = s.serialize();
console.log(ser);

const de = Simple.deserialize(ser);
console.log(de);
