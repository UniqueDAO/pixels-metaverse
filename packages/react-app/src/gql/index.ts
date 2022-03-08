import { gql } from "@apollo/client"

export const pixelsGraphavaterLists = gql`
    {
        avaterLists(first: 5){
            id
            avater
        }
    }
`

export const happyRedPacketsGraph = gql`
query getRedPacket($address:Bytes){
        avaterLists(where: {id: $address} ) {
        id
        avater
      }
    }
  `;


export const materialLists = gql`
    {
        materialLists(first: 10){
            id
            owner
            dataBytes
            rawData
            dataID
            configID
            remake
        }
    }
`