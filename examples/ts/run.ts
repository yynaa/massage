// import your message
import { Hello, Simple } from "@massage/Simple";

// create your message
const message = new Hello("Sophie")._wrap();
console.log("message:");
console.log(message);

// edit your message
(message.command as Hello).name = "Not Sophie";

// serialize your message
const ser = message._serialize();
console.log("serialized:");
console.log(ser);

// deserialize your message
const de = Simple.deserialize(ser);
console.log("deserialized:");
console.log(de);
