import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'
import '@babel/polyfill/noConflict'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'

const client = getClient()

beforeEach(seedDatabase)

test('Should Create a new user', async () => {
    const createUser = gql`
        mutation {
            createUser( 
                data: {
                    name: "Sergey KhaustovichTest",
                    email: "SergeyKhaustovich@test.test"
                    password: "Qwerty12"
                }
            ){
               token,
               user {
                   id
               }
            }
        }
    `

    const responce = await client.mutate({
        mutation: createUser
    })

    const exists = await prisma.exists.User({ id: responce.data.createUser.user.id })

    expect(exists).toBe(true)

})

test('Should expose public author profile', async () => {
    const getUsers = gql`
        query {
            users {
                id
                name
                email
            }
        }
    `

    const responce = await client.query({ query: getUsers })

    expect(responce.data.users.length).toBe(1)
    expect(responce.data.users[0].email).toBe(null)
    expect(responce.data.users[0].name).toBe("Pavel Khaustovich")
})

test('should not login with bad credentials', async () => {
    const login = gql`
        mutation {
            login(
                data: {
                    email: "PavelKhaustovich@gmail.com"
                    password: "testpassword"
                }
            ) {
                token
            }
        }
    `

    await expect(
        client.mutate({ mutation: login })   
    ).rejects.toThrow()
})

test('Should not signup user with invalid password', async () => {
    const createUser = gql`
        mutation {
            createUser(
                data: {
                    email: "NinaKhaustovich@gmail.com"
                    password: "pass"
                }
            ) {
                token
            }
        }
    `

    await expect(
        client.mutate({ mutation: createUser })
    ).rejects.toThrow()
})  

test('should fetch user profile', async () => {
    const client = getClient(userOne.jwt)

    const getProfile = gql`
        query {
            me {
                id
                name
                email
            }
        }
    `

    const { data } = await client.query({ query: getProfile })

    expect(data.me.id).toBe(userOne.user.id)
    expect(data.me.name).toBe(userOne.user.name)
    expect(data.me.email).toBe(userOne.user.email)
})