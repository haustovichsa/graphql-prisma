import getUserId from '../utils/getUserId'

const User =  {
    posts: {
        fragment: 'fragment userId on User { id }',
         resolve(parent, args, { prisma }, info) {
            return prisma.query.posts({
                where: {
                    published: true,
                    author: {
                        id: parent.id
                    }
                }
            }).then((dd) => {
                console.log(JSON.stringify(dd, null, 2))
                return dd;
            })
        }
    },
    email: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { request }, info) {
            const userId = getUserId(request, false)
     
            if (userId && userId === parent.id) {
                return parent.email
            }
     
            return null
        }
    }
};

export { User as default }