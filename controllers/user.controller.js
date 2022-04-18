const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const ROLE = {
  "ADMIN": "admin",
  "USER": "user"
}

const {User,Room, Round, UserRoom} = require('../models');

const { JWT_SIGNATURE_KEY = "RAHASIA" } = process.env;

const gameplay = require('../middlewares/gameplayLogic');

const {Op, where} = require("sequelize");


function isUsernameValid(inputUsername, usernameInDB){
  if(inputUsername === usernameInDB) return true;
  return false;
}

function isPasswordValid(inputPassword, encryptedPassword){
  return bcrypt.compareSync(inputPassword, encryptedPassword);
}

exports.getMainPage = async (req, res) => {
  res.render("user/index");
};

exports.getGamesPage = async (req, res) => {
  res.render("user/games");
};

exports.postRegister = async (req, res) => {
  try {
    const { username, name, password } = req.body;
    const encryptedPassword = bcrypt.hashSync(password, 10);

    const getUser = await User.findOne({
      where:{
        username,
      }
    });

    console.log(getUser);
    // check username data
    if(getUser){
      return res.status(400).json({
        status: "FAIL",
        data:{
          message: "Username already exist"
        }
      })
    }

    console.log(ROLE.USER);
    await User.create({
      username,
      name,
      password: encryptedPassword,
      role: ROLE.USER
    });

    res.status(201).json({
      status: "OK",
      data: {
        message: "Register success!"
      }
    })
  } catch (err) {
    console.log(err);
    return res.status(422).json({
      status: "FAIL",
      data: {
        message: "Cannot register user",
        error: err
      }
    })
  }
}

exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: {
        username
      },
      attributes: ['id','username', 'password', 'role']
    });

    // check user exist
    if(!user){
      res.status(400).json({
        status: "FAIL",
        data:{
          message: "username doesn't exist"
        }
      });
    }

    console.log(isUsernameValid(username, user.username), isPasswordValid(password, user.password));
    // check username and password
    if((!isUsernameValid(username, user.username)) || !isPasswordValid(password, user.password)){
      req.session.isAuthenticated = false;
      res.status(400).json({
        status: "FAIL",
        data:{
          message: "username and password not match"
        }
      });
    }

    req.session.isAuthenticated = true;
    req.session.user = user;
  
    res.status(201).json({
      status: "SUCCESS",
      data:{
        username,
        message: "Login success",
        token: jwt.sign({id: user.id, username, role: user.role}, JWT_SIGNATURE_KEY)
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(422).json({
      status: "FAIL",
      data: {
        message: "Cannot login",
      }
    })
  }
}

exports.postCreateRoom = async(req, res) => {
  try {
    const {roomName} = req.body;
    const {id, username} = req.user;

    const room = await Room.create({
      roomName,
    });

    await UserRoom.create({
      roomMasterId: id,
      roomId: room.id
    });

    res.status(201).json({
      status: "OK",
      data:{
        info: room,
        message: "Create room success"
      }
    })
  } catch (error) {
    console.log("test");
    console.log(error.message);
    return res.status(422).json({
      status: "FAIL",
      data: {
        info: "Error",
        message: err.message,
      }
    })
  }
  
}

exports.putJoinRoom = async(req,res) => {
  try {
    const roomId = req.params.id;
    const {id} = req.user;

    const userroom = await UserRoom.findOne({
      where:{
        roomId,
      }
    });

    await userroom.update({
      roomEnemyId: id,
    });

    console.log(userroom);

    res.status(201).json({
      status: "OK",
      data: userroom
    })
  } catch (err) {
    res.status(401).json({
      status: "FAIL",
      data:{
        message: err.message
      }
    })
  }
}

exports.postRoundGame = async(req, res) => {
  try {
    const roomId = req.params.room_id;
    const {playerSelect} = req.body;
    const {id} = req.user;

    const room = await Room.findOne({
      where:{
        id: roomId,
      }
    })
    const userroom = await UserRoom.findOne({
      where:{
        roomId,
      },
      attributes: ['roomMasterId']
    });
    console.log(room);
    console.log(userroom);

    // handle player 2 input
    if(!(id === userroom.roomMasterId)){
      userroom.roomEnemyId = id;
      const player2Select = playerSelect;
      const round = await Round.findOne({
        where:{
          roomId,
        },
        order: [
          ['createdAt', 'DESC']
        ]
      });

      await round.update({
        player2Select,
      });

      const resultId = gameplay(userroom.roomMasterId, userroom.roomEnemyId,round.player1Select, player2Select);

      await round.update({
        resultId,
      });

      const arrayRound = await Round.findAll({
        where:{
          roomId,
        },
        attributes: ['resultId']
      });

      console.log(arrayRound[0].resultId);

      if(arrayRound.length >= 3){
        const player1ResultCount =  (arrayRound.filter(round => round.resultId === userroom.roomMasterId)).length;
        const player2ResultCount =  (arrayRound.filter(round => round.resultId === userroom.roomEnemyId)).length;
        console.log(player1ResultCount, player2ResultCount);
        let playerWinId;
        if(player1ResultCount>player2ResultCount){
          console.log("Player 1 Win!");
          playerWinId = userroom.roomMasterId;
        }else{
          console.log("Player 2 Win!");
          playerWinId = userroom.roomEnemyId;
        }

        await room.update({
          playerWinId,
          where:{
            id: roomId
          }
        })

        res.status(201).json({
          status: "OK",
          data:{
            round,
            message: "end game!"
          }
        });

        return;
      }

      res.status(201).json({
        status: "OK",
        data:{
          round,
          message: "game success!"
        }
      });

      return;
    }

    console.log("lewat sini gak?");
    // handle player 1 input
    const round = await Round.create({
      player1Select: playerSelect,
      roomId
    });

    res.status(201).json({
      status: "OK",
      data: {
        info: "User 1 input success!",
        message: round
      }
    })

  } catch (err) {
    res.status(401).json({
      status: "FAIL",
      data:{
        message: err.message
      }
    });
  }
}

exports.getGameHistory = async(req, res) => {
  try {
    const {id} = req.user;

    const userrooms = await UserRoom.findAll({
      where:{
        [Op.or]: [{roomMasterId: id}, {roomEnemyId: id}]
      },
    });

    const userroomsId = userrooms.map(userroom => userroom.roomId);

    const rooms = await Room.findAll({
      include: [Round]  
    });

    const rounds = rooms.filter(room => {
      if(userroomsId.includes(room.id)){
        return room;
      } 
    });

    const winner = rounds.filter(round => round.playerWinId === id);
    const countWinner = winner.length;
    // console.log(winner);
    // console.log(countWinner);

    res.status(201).json({
      status: "OK!",
      userId: id,
      gameHistory: userrooms,
      roundHistory: rounds,
      gamePoints: countWinner
    })
  } catch (err) {
    res.status(401).json({
      status: "FAIL",
      data:{
        message: err.message
      }
    })
  }
}