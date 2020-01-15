require('@babel/register')
require('@babel/polyfill/noConflict')

const server = require('../../src/server.js').default

module.exports = async () => {
    global.httpServer = await server.start({ port: 4000 })
}