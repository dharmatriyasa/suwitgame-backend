const USERNAME_INFO = "dharmatriyasa";
const PASSWORD_INFO = "qwertyuiop";

const { User, Biodata, Game, UserGame } = require("../models");

exports.getLoginAdmin = async (req, res) => {
  if (!!req.session.name) return res.redirect("/admin/dashboard");
  res.render("admin/login");
};

exports.postLoginAdmin = async (req, res) => {
  const inputUsername = req.body.username;
  const inputPassword = req.body.password;

  console.log(inputUsername, inputPassword);

  if (USERNAME_INFO !== inputUsername && PASSWORD_INFO !== inputPassword) {
    console.log("WRONG USER OR PASS");
    res.redirect("/admin/login");
  }

  console.log("LOGGED IN!");
  req.session.name = USERNAME_INFO;
  res.redirect("/admin/dashboard");
};

exports.getDashboardPage = async (req, res) => {
  const users = await User.count();
  const games = await Game.count();

  console.log(users, games);
  res.render("admin/dashboard", { users, games });
};

exports.getUsersPage = async (req, res) => {
  const users = await User.findAll();
  console.log(users);
  res.render("admin/users", { users });
};

exports.getUserDetailsPage = async (req, res) => {
  const id = Number(req.params.id);
  const biodata = await Biodata.findByPk(id);
  console.log(biodata);

  res.render("admin/user-details", {
    id: biodata.id,
    fullname: biodata.fullname,
    address: biodata.address,
    email: biodata.email,
    phonenumber: biodata.phonenumber,
  });
};

exports.getAddUserPage = async (req, res) => {
  res.render("admin/add-user");
};

exports.postAddUser = async (req, res) => {
  const { username, nickname } = req.body;
  console.log(username, nickname);
  const user = await User.create({ username, nickname });

  console.log(user.id);

  res.redirect(`${user.id}/add-biodata`);
};

exports.getAddBiodataPage = async (req, res) => {
  const userId = req.params.id;
  res.render("admin/add-biodata", {
    id: userId,
  });
};

exports.postAddBiodata = async (req, res) => {
  const { fullname, address, email, phonenumber } = req.body;
  const userId = req.params.id;
  // console.log(Biodata);
  const biodata = await Biodata.create({
    fullname,
    address,
    email,
    phonenumber,
    userId,
  });

  res.redirect("/admin/dashboard");
};

exports.postPlayGame = async (req, res) => {
  const { firstPlayerSelect, secondPlayerSelect, winnerId } = req.body;
  const { firstPlayerId, secondPlayerId } = req.body;

  const game = await Game.create({
    firstPlayerSelect,
    secondPlayerSelect,
    winnerId,
  });

  const usergame = await UserGame.create({
    firstPlayerId,
    secondPlayerId,
    gameId: game.id,
  });

  console.log(game);
  console.log(usergame);

  res.status(201).json({
    status: "OK!",
    data: {
      game,
      usergame,
    },
  });
};

exports.getEditBiodata = async (req, res) => {
  const biodata = await Biodata.findByPk(Number(req.params.id));

  if (!biodata) return res.send("Not Found");

  res.render("admin/edit-biodata", {
    id: biodata.id,
    fullname: biodata.fullname,
    address: biodata.address,
    email: biodata.email,
    phonenumber: biodata.phonenumber,
  });
};

exports.getAllBiodata = async (req, res) => {
  const biodatas = await Biodata.findAll({
    include: User,
  });

  console.log(biodatas);

  res.render("admin/biodata", { biodatas });
};

exports.postEditBiodata = async (req, res) => {
  const biodata = await Biodata.findByPk(Number(req.params.id));

  if (!biodata) return res.send("Not Found");

  const { fullname, address, email, phonenumber } = req.body;

  await biodata.update({
    fullname,
    address,
    email,
    phonenumber,
  });

  res.redirect("/admin/dashboard");
};

exports.postDeleteBiodata = async (req, res) => {
  const biodata = await Biodata.findByPk(Number(req.params.id));

  if (!biodata) return res.send("Not Found");

  await biodata.destroy();

  res.redirect("/admin/biodata");
};

exports.getUserEditPage = async (req, res) => {
  const user = await User.findByPk(Number(req.params.id));

  if (!user) return res.send("Not Found");

  res.render("admin/edit-user", {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
  });
};

exports.postUserEdit = async (req, res) => {
  const user = await User.findByPk(Number(req.params.id));

  if (!user) return res.send("Not Found");

  await user.update({
    nickname: req.body.nickname,
  });

  res.redirect("/admin/users");
};

exports.postUserDelete = async (req, res) => {
  const user = await User.findByPk(Number(req.params.id));
  const biodata = await Biodata.findByPk(Number(req.params.id));

  if (!user && !biodata) return res.send("Not Found");

  await UserGame.destroy({
    where: {
      firstPlayerId: Number(req.params.id),
    },
  });

  await Game.destroy({
    where: {
      winnerId: Number(req.params.id),
    },
  });

  await biodata.destroy();
  await user.destroy();

  res.redirect("/admin/users");
};

exports.getGamesPage = async (req, res) => {
  const games = await Game.findAll();

  res.render("admin/games", { games });
};

exports.getGamesDetailsPage = async (req, res) => {
  const usergames = await UserGame.findAll();

  res.render("admin/games-details", { usergames });
};

exports.getGameDetailsPage = async (req, res) => {
  const usergame = await UserGame.findByPk(Number(req.params.id));

  console.log(usergame);

  res.render("admin/game-details", { usergame });
};

exports.getEditGame = async (req, res) => {
  const game = await Game.findByPk(Number(req.params.id));

  res.render("admin/edit-game", { game });
};

exports.getEditGameDetails = async (req, res) => {
  const usergame = await UserGame.findByPk(Number(req.params.id));

  res.render("admin/edit-game-details", { usergame });
};

exports.postEditGame = async (req, res) => {
  const game = await Game.findByPk(Number(req.params.id));

  if (!game) return res.send("Not Found");

  await game.update({
    firstPlayerSelect: req.body.firstPlayerSelect,
    secondPlayerSelect: req.body.secondPlayerSelect,
    winnerId: req.body.winnerId,
  });

  res.redirect("/admin/games");
};

exports.postDeleteGame = async (req, res) => {
  await UserGame.destroy({
    where: {
      gameId: Number(req.params.id),
    },
  });

  await Game.destroy({
    where: {
      id: Number(req.params.id),
    },
  });

  res.redirect("/admin/games");
};

exports.postEditGameDetails = async (req, res) => {
  const usergame = await UserGame.findByPk(Number(req.params.id));
  console.log(usergame);

  if (!usergame) return res.json(usergame);

  await usergame.update({
    firstPlayerId: req.body.firstPlayerId,
    firstPlayerId: req.body.firstPlayerId,
  });

  res.redirect("/admin/games/details");
};

exports.postDeleteGameDetails = async (req, res) => {
  const usergame = await UserGame.findByPk(Number(req.params.id));

  console.log(usergame);

  if (!usergame) return res.json(usergame);

  await usergame.destroy();

  res.redirect("/admin/games/details");
};
