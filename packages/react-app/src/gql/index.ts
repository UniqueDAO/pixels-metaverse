import { gql } from "@apollo/client"

export const AVATER_LIST = gql`
query($address:Bytes){
        avaters(where: {id: $address} ) {
        id
        avater{
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
      }
    }
  `;

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

export const MATERIAL_ALL_LIST = gql`
  query($first: Int, $orderBy: String, $orderDirection: String, $createID: BigInt, $owner: Bytes) {
    materials(
      first: $first,
      orderBy: "createID", 
      orderDirection: $orderDirection,
      where: {
        composed: 0,
        owner_not: "0x0000000000000000000000000000000000000000",
        createID_lt: $createID,
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

export const MATERIAL_ID_LIST = gql`
  query($first: Int, $orderBy: String, $orderDirection: String, $createID: BigInt, $id: [BigInt]) {
    materials(
      orderBy: "createID", 
      orderDirection: $orderDirection,
      where: {
        createID_lt: $createID,
        id_in: $id
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

export const MATERIAL_ADDRESS_LIST = gql`
  query($first: Int, $orderBy: String, $orderDirection: String, $createID: BigInt, $owner: [Bytes]) {
    materials(
      first: $first,
      orderBy: "createID", 
      orderDirection: $orderDirection,
      where: {
        createID_lt: $createID,
        owner_in: $owner
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

export const MATERIAL_ADDRESS_ID_LIST = gql`
  query($first: Int, $orderBy: String, $orderDirection: String, $createID: BigInt, $owner: [Bytes], $id: [BigInt]) {
    materials(
      first: $first,
      orderBy: "createID", 
      orderDirection: $orderDirection, 
      where: {
        createID_gt: $createID,
        id_in: $id,
        owner_in: $owner
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