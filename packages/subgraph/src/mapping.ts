import { BigInt } from "@graphprotocol/graph-ts"
import {
  ClaimSuccess,
  CreationSuccess,
  RefundSuccess
} from "../generated/HappyRedPacket/HappyRedPacket"
import { HappyRedPacket, Claimer, RedPacketIDs } from "../generated/schema"

export function handleClaimSuccess(event: ClaimSuccess): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let redpacket = HappyRedPacket.load(event.params.id.toHex());
  if (redpacket == null) {
    redpacket = new HappyRedPacket(event.params.id.toHex());
  }

  let claimer = Claimer.load(redpacket.id);
  if (claimer === null) {
    claimer = new Claimer(redpacket.id + '#' + event.params.claimer.toHex());
    claimer.user = event.params.claimer;
    claimer.amount = event.params.claimed_value;
    claimer.redpacket = redpacket.id;
  }
  redpacket.save();
  claimer.save();

}

export function handleCreationSuccess(event: CreationSuccess): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type

  let redPacketIDs = RedPacketIDs.load(event.params.id.toHex());
  if (redPacketIDs === null) {
    redPacketIDs = new RedPacketIDs(event.params.id.toHex());
  }
  redPacketIDs.save();
}

export function handleRefundSuccess(event: RefundSuccess): void { }
