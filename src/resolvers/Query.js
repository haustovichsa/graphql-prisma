import getUserId from '../utils/getUserId'

const query =  {
    users(parent, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        }

        if(args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }]
            }
        }

        return prisma.query.users(opArgs, info)
    },
    posts(parent, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                published: true
            }
        }

        if(args.query) {
            opArgs.where.OR =[{
                    title_contains: args.query
                }, {
                    body_contains: args.query
                }]            
        }
        
        return prisma.query.posts(opArgs, info)
    },

    myPost(parent, args, { prisma, query }, info) {
        const userId = getUserId(request)

        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                author: {
                    id: userId
                }
            }
        }

        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            },{
                body_contains: args.query
            }]
        }

        return prisma.query.posts(opArgs, info)
    },

    comments(parent, args, { prisma }, info){
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        }

        if(args.query) {
            opArgs.where = { text_contains: args.query }
        }

        return prisma.query.comments(opArgs, info)
    },
  
    async post(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false)

        // not argee with that logic
        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [{
                    published: true
                }, {
                    author: {
                        id: userId
                    }
                }]
            }
        }, info)

        if (posts.length === 0) {
            throw new Error('Post not found')
        }

        return posts[0]
    },

    me(parent, args, {prisma, request}, info) {
        const userId = getUserId(request)

        return prisma.query.user({ where: { id: userId } })
    }
    
};

export { query as default }