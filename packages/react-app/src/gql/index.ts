import { gql } from "@apollo/client"

export const AVATER_LIST = gql`
query($address:Bytes){
        avaters(where: {id: $address} ) {
        id
        avater
      }
    }
  `;

export const MATERIAL_LIST = gql`
  query($first: Int, $orderBy: String, $orderDirection: String, $createID: BigInt) {
    materials(
      first: $first,
      orderBy: "createID", 
      orderDirection: $orderDirection, 
      where: { 
        composed: 0, 
        owner_not: "0x0000000000000000000000000000000000000000",
        createID_gt: $createID
      }) {
        id
        owner
        rawData
        remake
        composed
        composes
        config{
            id
            name
            time
            position
            zIndex
            decode
            sort
        }
    }
}`

export const COMPOSE_LIST = gql`
  query($first: Int, $ids: [BigInt]) {
    materials(
      first: $first,
      where: {
        id_in: $ids
      }) {
        id
        owner
        rawData
        remake
        composed
        composes
        config{
            id
            name
            time
            position
            zIndex
            decode
            sort
        }
    }
}`