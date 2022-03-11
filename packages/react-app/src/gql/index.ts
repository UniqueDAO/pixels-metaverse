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
  query($first: Int, $orderBy: BigInt, $orderDirection: String) {
    materials(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
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
}`