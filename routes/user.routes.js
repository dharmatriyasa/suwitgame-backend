const express = require("express");
const router = express.Router();

const authorize = require('../middlewares/authorize');
const isUser = require('../middlewares/isUser');

const UserController = require("../controllers/user.controller");

router.get("/", UserController.getMainPage);
router.get("/games", UserController.getGamesPage);

router.get("/api/v1/user/game-history/:id", authorize, isUser, UserController.getGameHistory);

router.post("/register", UserController.postRegister);
router.post("/login", UserController.postLogin);
router.post("/api/v1/create-room", authorize, UserController.postCreateRoom);
router.put("/api/v1/join-room/:id", authorize, UserController.putJoinRoom);
router.post("/api/v1/fight/:room_id", authorize, UserController.postRoundGame);


module.exports = router;
