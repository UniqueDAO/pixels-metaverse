import { Bytes } from "@graphprotocol/graph-ts";
import {
  AvaterEvent,
  MaterialEvent
} from "../generated/PixelsMetaverse/PixelsMetaverse"
import { AvaterList, MaterialList } from "../generated/schema"

export function handleAvaterEvent(event: AvaterEvent): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let avater = AvaterList.load(event.params.onwer.toHex());
  if (avater == null) {
    avater = new AvaterList(event.params.onwer.toHex());
    avater.avater = event.params.avater;
  } else {
    avater.avater = event.params.avater;
  }

  avater.save();
}

export function handleMaterialEvent(event: MaterialEvent): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let material = MaterialList.load(event.params.id.toString());
  if (material == null) {
    material = new MaterialList(event.params.id.toString());
    material.owner = event.params.onwer;
    material.dataBytes = event.params.dataBytes;
    material.rawData = event.params.rawData;
    material.dataID = event.params.dataID;
    material.configID = event.params.configID;
    material.remake = event.params.remake;
  } else {
    material.owner = event.params.onwer;
    if (event.params.dataBytes.toString() !== "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470") material.dataBytes = event.params.dataBytes
    if (event.params.rawData !== "") material.rawData = event.params.rawData
    if (event.params.dataID.toString() !== "0") material.dataID = event.params.dataID
    if (event.params.configID.toString() !== "0") material.configID = event.params.configID
    if (event.params.remake) material.remake = event.params.remake
  }

  material.save();
}