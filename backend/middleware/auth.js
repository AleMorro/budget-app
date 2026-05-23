/**
 * Autenticazione e autorizzazione (ownership su user_id).
 */

function publicUser(user) {
   if (!user) return null;
   const { password, ...safe } = user;
   return safe;
}

function isLoggedIn(req, res, next) {
   if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
   }
   return res.status(401).json({ statusCode: 401, message: "not authenticated" });
}

/** Verifica che :id nella URL corrisponda all'utente in sessione */
function assertOwnsUserParam(paramName = "id") {
   return (req, res, next) => {
      const requestedId = Number(req.params[paramName]);
      const sessionUserId = Number(req.user?.user_id);
      if (!sessionUserId || requestedId !== sessionUserId) {
         return res.status(403).json({
            statusCode: 403,
            message: "Accesso negato ai dati di un altro utente.",
         });
      }
      next();
   };
}

/** Forza user_id dal body/sessione per POST */
function forceSessionUserId(req, res, next) {
   const sessionUserId = req.user?.user_id;
   if (!sessionUserId) {
      return res.status(401).json({ statusCode: 401, message: "not authenticated" });
   }
   req.body.user_id = sessionUserId;
   next();
}

module.exports = {
   publicUser,
   isLoggedIn,
   assertOwnsUserParam,
   forceSessionUserId,
};
