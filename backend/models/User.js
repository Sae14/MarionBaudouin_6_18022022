const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

// Mise en place de la structure de chaque utilisateur pour la base de données, avec email unique :
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
