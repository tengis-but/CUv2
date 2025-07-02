// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://18.143.182.219/:path*', // Updated to remove :5002
      },
    ];
  },
};