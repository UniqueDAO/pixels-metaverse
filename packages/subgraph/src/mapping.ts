import { Bytes } from "@graphprotocol/graph-ts";
import {
  AvaterEvent,
  ComposeEvent,
  ConfigEvent,
  MaterialEvent
} from "../generated/PixelsMetaverse/PixelsMetaverse"
import { AvaterList, MaterialList, TConfig } from "../generated/schema"

export function handleAvaterEvent(event: AvaterEvent): void {
  let avater = AvaterList.load(event.params.owner.toHex());
  if (avater == null) {
    avater = new AvaterList(event.params.owner.toHex());
    avater.avater = event.params.avater;
  } else {
    avater.avater = event.params.avater;
  }

  avater.save();
}

export function handleMaterialEvent(event: MaterialEvent): void {
  let material = MaterialList.load(event.params.id.toString());
  if (material == null) {
    material = new MaterialList(event.params.id.toString());
    material.owner = event.params.owner;
    material.rawData = event.params.rawData;
    material.remake = event.params.remake;
  } else {
    material.owner = event.params.owner;
    if (event.params.rawData !== "") material.rawData = event.params.rawData
    if (event.params.remake) material.remake = event.params.remake
  }

  material.save();
}

export function handleComposeEvent(event: ComposeEvent): void {
  let material = MaterialList.load(event.params.id.toString());
  // let beforeFather = MaterialList.load(event.params.beforeFatherID.toString());
  // let afterFather = MaterialList.load(event.params.afterFatherID.toString());
  if (material == null) {
    material = new MaterialList(event.params.id.toString());
  }

  if (event.params.afterFatherID.toString() === "0") {
    material.owner = Bytes.empty();
  } else {
    material.composed = event.params.afterFatherID;
  }

  // beforeFather.save();
  // afterFather.save();
  material.save();
}

export function handleConfigEvent(event: ConfigEvent): void {
  let material = MaterialList.load(event.params.id.toString());
  if (material == null) {
    material = new MaterialList(event.params.id.toString());
    material.config = [event.params.id.toString()]
  }

  let config = TConfig.load(material.id);
  if (config == null) {
    config = new TConfig(material.id);
  }
  config.name = event.params.name;
  config.position = event.params.position;
  config.time = event.params.time;
  config.zIndex = event.params.zIndex;
  config.decode = event.params.decode;
  config.sort = event.params.sort;
  config.meterial = material.id;

  material.save()
  config.save()
}