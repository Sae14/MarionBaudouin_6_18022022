const jwt = require("jsonwebtoken");

const MY_SECRET = process.env.SECRET;

module.exports = (req, res, next) => {
  // Authentification de l'utilisateur : vérification si le userId de la requête correspond à celui du token de connexion de l'utilisateur
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, MY_SECRET);
    const userId = decodedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID non valable !";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | "Requête non autorisée" });
  }
};
