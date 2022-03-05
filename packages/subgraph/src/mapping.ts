import {
  AvaterEvent
} from "../generated/PixelsMetaverse/PixelsMetaverse"
import { Avater } from "../generated/schema"

export function handleAvaterEvent(event: AvaterEvent): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let redpacket = Avater.load(event.params.onwer.toHex());
  if (redpacket == null) {
    redpacket = new Avater(event.params.onwer.toHex());
  }

  redpacket.save();
}