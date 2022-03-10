import { Bytes } from "@graphprotocol/graph-ts";
import {
  AvaterEvent,
  ComposeEvent,
  ConfigEvent,
  MaterialEvent
} from "../generated/PixelsMetaverse/PixelsMetaverse"
import { AvaterList, TCompose, MaterialList, TConfig } from "../generated/schema"

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
    material.compose = event.params.id.toString();
  } else {
    material.owner = event.params.owner;
    if (event.params.rawData !== "") material.rawData = event.params.rawData
    if (event.params.remake) material.remake = event.params.remake
    if (!event.params.configID.isZero()) material.config = event.params.configID.toString();
    material.compose = event.params.id.toString();
  }

  material.save();
}

export function handleComposeEvent(event: ComposeEvent): void {
  let after = TCompose.load(event.params.toID.toString());
  if (after == null) {
    after = new TCompose(event.params.toID.toString());
    after.composes = event.params.id;
  } else {
    after.composes = after.composes.concat(event.params.id);
  }

  if (!event.params.toID.isZero()) {
    for (let i = 0; i < event.params.id.length; i++) {
      let id = event.params.id[i];
      let compose = TCompose.load(id.toString());
      if (compose == null) {
        compose = new TCompose(id.toString());
        compose.composed = event.params.toID;
      } else {
        compose.composed = event.params.toID;
      }
      compose.save()
    }
  }

  after.save();
}

export function handleConfigEvent(event: ConfigEvent): void {
  let config = TConfig.load(event.params.id.toString());
  if (config == null) {
    config = new TConfig(event.params.id.toString());
  }
  config.name = event.params.name;
  config.position = event.params.position;
  config.time = event.params.time;
  config.zIndex = event.params.zIndex;
  config.decode = event.params.decode;
  config.sort = event.params.sort;

  config.save()
}

/*

{
  avaterLists(first: 5) {
    id
    avater
  }
  materialLists(first: 50) {
    id
    owner
    rawData
    remake
    config{
      id
      name
    }
    compose{
      id
      composed
      composes
    }
  }
  tconfigs(first: 5){
    id
    time
    position
    zIndex
  }
}



*/