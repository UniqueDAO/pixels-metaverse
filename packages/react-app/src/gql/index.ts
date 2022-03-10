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
        materials(first: 50) {
            id
            owner
            rawData
            remake
            config{
                id
                name
                time
                position
                zIndex
                decode
                sort
            }
            compose{
              composed
              composes
            }
        }
    }
`