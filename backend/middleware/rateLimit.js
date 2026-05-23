/**
 * Rate limit in-memory (adeguato per singola istanza / dev).
 */

function createRateLimiter({ windowMs = 60_000, max = 60, message } = {}) {
   const hits = new Map();

   return (req, res, next) => {
      const key = req.ip || req.socket?.remoteAddress || "unknown";
      const now = Date.now();
      let bucket = hits.get(key);

      if (!bucket || now - bucket.start >= windowMs) {
         bucket = { start: now, count: 0 };
      }
      bucket.count += 1;
      hits.set(key, bucket);

      if (bucket.count > max) {
         return res.status(429).json({
            message:
               message ||
               "Troppe richieste. Attendi qualche secondo e riprova.",
         });
      }
      next();
   };
}

module.exports = { createRateLimiter };
