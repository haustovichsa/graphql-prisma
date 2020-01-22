import 'cross-fetch/polyfill'
import '@babel/polyfill/noConflict'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createUser, login, getUsers, getProfile } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('Should create a new user', async () => {
    const variables = {
        data: {
            name: 'Sergey KhaustovichTest',
            email: 'SergeyKhaustovich@test.test',
            password: 'Qwerty12'    
        }
    }
   
    const responce = await client.mutate({ mutation: createUser, variables })

    const exists = await prisma.exists.User({ id: responce.data.createUser.user.id })

    expect(exists).toBe(true)

})

test('Should expose public author profile', async () => {
   const responce = await client.query({ query: getUsers })

    expect(responce.data.users.length).toBe(1)
    expect(responce.data.users[0].email).toBe(null)
    expect(responce.data.users[0].name).toBe("Pavel Khaustovich")
})

test('should not login with bad credentials', async () => {
    const variables = {
        data: {
            email: 'PavelKhaustovich@gmail.com',
            password: 'testpassword'
        }
    }

    await expect(
        client.mutate({ mutation: login, variables })   
    ).rejects.toThrow()
})

test('Should not signup user with invalid password', async () => {
    const variables = {
        data: {
            name: 'Nina',
            email: 'NinaKhaustovich@gmail.com',
            password: 'pass'
        }
    }

    await expect(
        client.mutate({ mutation: createUser, variables })
    ).rejects.toThrow()
})  

test('should fetch user profile', async () => {
    const client = getClient(userOne.jwt)

    const { data } = await client.query({ query: getProfile })

    expect(data.me.id).toBe(userOne.user.id)
    expect(data.me.name).toBe(userOne.user.name)
    expect(data.me.email).toBe(userOne.user.email)
})