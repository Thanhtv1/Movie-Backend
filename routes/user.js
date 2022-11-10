const middlewareController = require("../controllers/middlewareControllers");
const userController = require("../controllers/userControllers");
const router = require("express").Router();

router.get(
  "/profile",
  middlewareController.verifyToken,
  userController.getUserProfile
);

router.put(
  "/updateProfile",
  middlewareController.verifyToken,
  userController.updateUserProfile
);

router.delete(
  "/delete",
  middlewareController.verifyToken,
  userController.deleteUser
);

router.post(
  "/addFlim",
  middlewareController.verifyToken,
  userController.addToFavoriteLists
);

router.delete(
  "/removeAnItem",
  middlewareController.verifyToken,
  userController.removeAFilm
);
router.delete(
  "/removeAllItem",
  middlewareController.verifyToken,
  userController.removeAllFilms
);

module.exports = router;
