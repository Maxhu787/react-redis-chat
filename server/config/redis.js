const Redis = require("ioredis");
const redisClient = new Redis();
// const redisClient = new Redis("rediss://default:AVNS_WseQo5ncsS38AReZWCe@caching-4751e7a-g4o2.h.aivencloud.com:12989");
// const redisClient = new Redis(process.env.REDIS_URL);
// setInterval(() => {
//   redisClient.ping(function (err, result) {
//     console.log(result);
//   })
// }, 5000)

module.exports = redisClient;
