// next.config.js
module.exports = {
    async rewrites() {
        return [
          {
            source: '/api/pilgrim',
            destination: 'https://47.236.149.95:8201/pilgrim',
          },
        ]
      },
  };