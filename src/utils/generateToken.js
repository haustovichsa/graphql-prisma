import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
    return jwt.sign({ userId }, 'this is secret',  { expiresIn: '7 days' }) // TODO: read the secret from node env
}

export { generateToken as default }