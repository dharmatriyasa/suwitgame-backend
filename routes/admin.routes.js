const express = require("express");
const router = express.Router();

const authorize = require("../middlewares/authorize");
const isAdmin = require("../middlewares/isAdmin"); 

const AdminController = require('../controllers/admin.controller');

router.get("/api/v1/users", authorize, isAdmin, AdminController.getAllUser);
router.get("/api/v1/rooms", authorize, isAdmin, AdminController.getAllRoom);
router.get("/api/v1/rounds", authorize, isAdmin, AdminController.getAllRound);

router.post("/api/v1/admin/register", AdminController.postRegister);
router.post("/api/v1/admin/login", AdminController.postLogin);

module.exports = router;