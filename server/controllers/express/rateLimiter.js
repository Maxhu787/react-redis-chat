const redisClient = require("../../config/redis");

const rateLimiter =
  (secondsInterval, intervalCount, status) => async (req, res, next) => {
    const ip = req.connection.remoteAddress;
    const [responce] = await redisClient
      .multi()
      .incr(ip)
      .expire(ip, secondsInterval)
      .exec();
    // console.log(responce[1])
    if (responce[1] > intervalCount * 1000) {
      if (status) {
        res.json({ status });
      } else {
        res.json({
          loggedIn: false,
          status: "Too many requests. Try again in a minute.",
        });
      }
    } else {
      next();
    }
  };

module.exports = rateLimiter;
