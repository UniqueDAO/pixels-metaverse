import { Bytes } from "@graphprotocol/graph-ts";
import {
  AvaterEvent,
  ComposeEvent,
  ConfigEvent,
  MaterialEvent
} from "../generated/PixelsMetaverse/PixelsMetaverse"
import { AvaterList, ComposeList, MaterialList, TConfig } from "../generated/schema"

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
    material.config = event.params.configID.toString();
    material.composeData = [];
  } else {
    material.owner = event.params.owner;
    if (event.params.rawData !== "") material.rawData = event.params.rawData
    if (event.params.remake) material.remake = event.params.remake
    if (event.params.configID.toString() !== "0") material.config = event.params.configID.toString();
    material.composeData = [];
  }

  material.save();
}

export function handleComposeEvent(event: ComposeEvent): void {
  let material = MaterialList.load(event.params.id.toString());
  if (material == null) {
    material = new MaterialList(event.params.id.toString());
    material.composed = event.params.toID;
  } else {
    material.composed = event.params.toID;
  }

  let beforeFather = MaterialList.load(event.params.fromID.toString());
  if (beforeFather == null) {
    beforeFather = new MaterialList(event.params.fromID.toString());
    beforeFather.composeData = [];
  } else {
    const index = beforeFather.composeData.indexOf(event.params.id);
    beforeFather.composeData.splice(index, 1);
  }

  let afterFather = MaterialList.load(event.params.toID.toString());
  if (afterFather == null) {
    afterFather = new MaterialList(event.params.toID.toString());
    afterFather.composeData = [event.params.id]
  } else {
    afterFather.composeData.push(event.params.id);
  }

  beforeFather.save();
  afterFather.save();
  material.save();
}

export function handleConfigEvent(event: ConfigEvent): void {
  let config = TConfig.load(event.params.id.toString());
  if (config == null) {
    config = new TConfig(event.params.id.toString());
  }
  config.name = event.params.name.toString();
  config.position = event.params.position;
  config.time = event.params.time;
  config.zIndex = event.params.zIndex;
  config.decode = event.params.decode;
  config.sort = event.params.sort;
  //config.material = [event.params.id.toString()];

  config.save()
}