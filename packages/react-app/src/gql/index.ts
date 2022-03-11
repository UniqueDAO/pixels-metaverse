import { gql } from "@apollo/client"

export const pixelsGraphavaterLists = gql`
query($address:Bytes){
        avaterLists(where: {id: $address} ) {
        id
        avater
      }
    }
  `;

export const materialLists = gql`
  query($first: Int, $orderBy: String, $orderDirection: String, $composed: BigInt) {
    materials(first: $first, orderBy: "createID", orderDirection: $orderDirection, where: { composed: $composed, burned: false }) {
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