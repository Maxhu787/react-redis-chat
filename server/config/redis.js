const Redis = require("ioredis");
const redisClient = new Redis();
// const redisClient = new Redis(process.env.REDIS_URL);
// setInterval(() => {
//   redisClient.ping(function (err, result) {
//     console.log(result);
//   })
// }, 5000)

module.exports = redisClient;
