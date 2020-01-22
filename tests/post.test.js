import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'
import '@babel/polyfill/noConflict'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'

const client = getClient()

beforeEach(seedDatabase)

test('should expose published posts', async () => {
    const getPosts = gql`
        query {
            posts {
                id
                title
                body
                published
            }
        }
    `

    const responce = await client.query({ query: getPosts })

    expect(responce.data.posts.length).toBe(1)
    expect(responce.data.posts[0].published).toBe(true)
})

test('should fetch users posts', async () => {
    const client = getClient(userOne.jwt)
    const myPosts = gql`
        query {
            myPosts {
                id
                title
                body
                published
            }
        }
    `
    const { data } = await client.query({ query: myPosts })
    
    expect(data.myPosts.length).toBe(2)
})