import bcrypt from 'bcryptjs'
import prisma from '../../src/prisma'
import jwt from 'jsonwebtoken'

const userOne = {
    input: {
        name: 'Pavel Chan',
        email: 'PavelChan@gmail.com',
        password: bcrypt.hashSync('Qwerty12')
    },
    user: undefined,
    jwt: undefined
}

const userTwo = {
    input: {
        name: 'Andrey Chan',
        email: 'AndreyChan@gmail.com',
        password: bcrypt.hashSync('Qwerty12')
    },
    user: undefined,
    jwt: undefined
}

const postOne = {
    input: {
        title: 'My published post',
        body: '',
        published: true,
    },
    post: undefined
}

const postTwo = {
    input: {
        title: 'My draft post',
        body: '',
        published: false,
    },
    post: undefined
}

const commentOne = {
    input: {
        text: "Great post. Thanks for sharing!"
    },
    comment: undefined
}

const commentTwo = {
    input: {
        text: "I am glad you enjoyed it."
    },
    comment: undefined
}

const seedDatabase = async () => {
    // delete test data
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()
    
    // create user one
    userOne.user = await prisma.mutation.createUser({ data: userOne.input })

    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

    // create user two
    userTwo.user = await prisma.mutation.createUser({ data: userTwo.input })

    userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)

    // create post one
    postOne.post = await prisma.mutation.createPost({
        data: {
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    // create two post
    postTwo.post = await prisma.mutation.createPost({
        data: {
            ...postTwo.input,
            author: {               
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    // create comment one 
    commentOne.comment = await prisma.mutation.createComment({
        data: {
            ...commentOne.input,
            author: {
                connect: {
                    id: userTwo.user.id
                }
            },
            post: {
                connect: {
                    id: postOne.post.id
                }
            }
        }
    })

     // create comment two
     commentTwo.comment = await prisma.mutation.createComment({
        data: {
            ...commentTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            },
            post: {
                connect: {
                    id: postOne.post.id
                }
            }
        }
    })
}

export { seedDatabase as default, userOne, postOne, postTwo, commentOne, commentTwo }