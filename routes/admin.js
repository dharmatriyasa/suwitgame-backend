const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");

router.get("/admin/login", adminController.getLoginAdmin);
router.get("/admin/dashboard", checkSession, adminController.getDashboardPage);
router.get("/admin/users", adminController.getUsersPage);
router.get("/admin/biodata", adminController.getAllBiodata);
router.get("/admin/user/:id/details", adminController.getUserDetailsPage);
router.get("/admin/user/:id/edit", adminController.getUserEditPage);
router.get("/admin/add-user", adminController.getAddUserPage);
router.get("/admin/:id/add-biodata", adminController.getAddBiodataPage);
router.get("/admin/user/:id/details/edit", adminController.getEditBiodata);
router.get("/admin/games", adminController.getGamesPage);
router.get("/admin/game/:id/details", adminController.getGameDetailsPage);
router.get("/admin/game/:id/edit", adminController.getEditGame);
router.get("/admin/games/details", adminController.getGamesDetailsPage);
router.get("/admin/game/details/:id/edit", adminController.getEditGameDetails);

router.post("/admin/login", adminController.postLoginAdmin);
router.post("/admin/add-user", adminController.postAddUser);
router.post("/admin/user/:id/edit", adminController.postUserEdit);
router.post("/admin/user/:id/delete", adminController.postUserDelete);
router.post("/admin/:id/add-biodata", adminController.postAddBiodata);
router.post("/admin/user/:id/details/edit", adminController.postEditBiodata);
router.post(
  "/admin/user/:id/details/delete",
  adminController.postDeleteBiodata
);
router.post("/admin/api/v1/playgame", adminController.postPlayGame);
router.post("/admin/game/:id/edit", adminController.postEditGame);
router.post("/admin/game/:id/delete", adminController.postDeleteGame);
router.post(
  "/admin/game/details/:id/edit",
  adminController.postEditGameDetails
);
router.post(
  "/admin/game/details/:id/delete",
  adminController.postDeleteGameDetails
);

module.exports = router;

async function checkSession(req, res, next) {
  if (!!req.session.name) return next();

  return res.redirect("/admin/login");
}
