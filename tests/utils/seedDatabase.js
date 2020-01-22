import bcrypt from 'bcryptjs'
import prisma from '../../src/prisma'
import jwt from 'jsonwebtoken'

const userOne = {
    input: {
        name: 'Pavel Khaustovich',
        email: 'PavelKhaustovich@gmail.com',
        password: bcrypt.hashSync('Qwerty12')
    },
    user: undefined,
    jwt: undefined
}

const seedDatabase = async () => {
    // delete test data
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()
    
    // create user one
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })

    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

    await prisma.mutation.createPost({
        data: {
            title: 'My published post',
            body: '',
            published: true,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    await prisma.mutation.createPost({
        data: {
            title: 'My draft post',
            body: '',
            published: false,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })
}

export { seedDatabase as default, userOne }