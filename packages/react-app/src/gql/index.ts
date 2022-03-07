import { gql } from "@apollo/client"

export const pixelsGraphAvaterLists = gql`
    {
        avaterLists(first: 5){
            id
            onwer
            avater
        }
    }
`

/* 

export const pixelsGraphAvaterLists = gql`
    query transcoders($address:Bytes){
        avaterLists(first: 5){
            id
            onwer
            avater
        }
        materialLists(first: 5){
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
*/