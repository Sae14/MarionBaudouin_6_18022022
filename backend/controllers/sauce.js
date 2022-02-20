const Sauce = require("../models/Sauce");

const fs = require("fs");

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce sauvegardée" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  if (req.file) {
    const sauceObjectFile = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    };

    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObjectFile, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée" }))
          .catch((error) => res.status(400).json({ error }));
      });
    });
  } else {
    const sauceObject = { ...req.body };
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Sauce modifiée" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  const userLike = req.body.like;
  const sauceId = req.params.id;
  if (userLike == 1) {
    Sauce.updateOne(
      { _id: sauceId },
      { $inc: { likes: +1 }, $push: { usersLiked: userId } }
    )
      .then(() => res.status(200).json({ message: "Like de la sauce ajouté" }))
      .catch((error) => res.status(400).json({ error }));
  } else if (userLike == -1) {
    Sauce.updateOne(
      {
        _id: sauceId,
      },
      { $inc: { dislikes: +1 }, $push: { usersDisliked: userId } }
    )
      .then(() =>
        res.status(200).json({ message: "Dislike de la sauce ajouté" })
      )
      .catch((error) => res.status(400).json({ error }));
  } else if (userLike == 0) {
    Sauce.findOne({ _id: sauceId }).then((sauce) => {
      if (sauce.usersLiked.includes(userId)) {
        Sauce.updateOne(
          {
            _id: sauceId,
          },
          { $inc: { likes: -1 }, $pull: { usersLiked: userId } }
        )

          .then(() =>
            res.status(200).json({ message: "Like de la sauce retiré" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else if (sauce.usersDisliked.includes(userId)) {
        Sauce.updateOne(
          {
            _id: sauceId,
          },
          { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } }
        )

          .then(() =>
            res.status(200).json({ message: "Dislike de la sauce retiré" })
          )
          .catch((error) => res.status(400).json({ error }));
      }
    });
  }
};
