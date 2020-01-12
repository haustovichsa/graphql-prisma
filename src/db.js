let users = [{
    id: '1',
    name: 'Sergey',
    email: 'sergey@example.com'
},{
    id: '2',
    name: 'Mike',
    email: 'mike@example.com'
},{
    id: '3',
    name: 'Nik',
    email: 'nik@example.com'
}];

let posts = [{
    id: '10',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: true,
    author: '1'
},
{
    id: '11',
    title: 'GraphQL 201',
    body: 'this is advanced GraphQL post...',
    published: false,
    author: '1'
},{
    id: '12',
    title: 'Programming music',
    body: '',
    published: true,
    author: '2'
}];

let comments = [{
    id: '102',
    text: 'This worked well for me. Thanks!',
    author: '3',
    post: '10',
},{
    id: '103',
    text: 'Glad you enjoyed it.',
    author: '1',
    post: '10',
},{
    id: '104',
    text: 'This did no work.',
    author: '2',
    post: '11',
},{
    id: '105',
    text: 'Nevermind. I got it to work',
    author: '1',
    post: '11',
}]

const db = {
    users,
    posts,
    comments
}

export { db as default } 