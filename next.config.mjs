const withCors = require('nextjs-cors');

module.exports = withCors({
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
});
