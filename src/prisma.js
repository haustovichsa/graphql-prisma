import { Prisma } from 'prisma-binding'
import { create } from 'domain'
import { fragmentReplacements } from './resolvers/index'
const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    fragmentReplacements,
})


export { prisma as default }

/*prisma.query.users(null, '{ id name posts { id title body published } }')
    .then((data) => { console.log(JSON.stringify(data, undefined, 2)) })   */

/*prisma.query.posts(null, '{ id title body published author { id name } }')
    .then((data) => { console.log(JSON.stringify(data, undefined, 2)) })    

prisma.query.comments(null, '{ id text author { id name } }')
    .then((data) => { console.log(JSON.stringify(data, undefined, 2)) })*/


/*prisma.mutation.createPost({
    data: {
        title: "My new Graphql post is live!!!",
        body: "You can find the new course here",
        published: true,
        author: {
            connect: {
                id: 'ck4jz670700m40872qcpohu70'
            }
        }
    }
}, '{id title body published}').then((data) => {
    return prisma.query.users(null, '{ id name posts { id title } }')
}).then(data => {
    console.log(JSON.stringify(data, undefined, 2))
})*/

/*prisma.mutation.updatePost({
    where: {
        id: "ck4lb42iy04wy08727qcpcsvd"
    },
    data: {
        body: "This is how to get started with Graphql...!",
        published: true
    }
}, '{ id }')
.then(data => prisma.query.posts(null, '{ id title body published }'))
.then(data => console.log(data))*/


const createPostForUser = async (authorId, data) => {
    const userExists = await prisma.exists.User({ id: authorId })

    if (!userExists) {
        throw new Error('User not found')
    }

    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    }, '{ author { id name email posts { id title published } } }')
    const user = await prisma.query.user({
        where: {
            id: authorId
        }
    }, '{ id name email posts { id title published} }')

    return post.author
}

/*createPostForUser(
    'ck4jz670700m40872qcpohu70',
     {
         title: 'new title',
         body: 'new body',
         published: true
     })
     .then((user) => console.log(JSON.stringify(user, undefined, 2)))
     .catch(error => console.log(error))*/


const updatePostForUser = async (postId, data) => {
    const postExists = await prisma.exists.Post({ id: postId })

    if (!postExists) {
        throw new Error('Post not found')
    }

   const post = await prisma.mutation.updatePost({
        where: {
            id: postId
        },
        data
    }, '{ author { id name email posts { id title published }} }')

    return post.author
}

/*updatePostForUser(
    "ck4jzt8p9011t087277xwfeei",
    { published: true })
    .then(data => console.log(JSON.stringify(data, undefined, 2)))
    .catch(error => console.log(error))
*/
