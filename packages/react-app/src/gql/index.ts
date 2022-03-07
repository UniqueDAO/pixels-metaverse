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


export const pixelsGraphmaterialLists = gql`
    {
        materialLists(first: 50){
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