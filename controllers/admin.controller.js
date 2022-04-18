const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const ROLE = {
  "ADMIN": "admin",
  "USER": "user"
}

const {User, UserRoom, Room, Round} = require('../models');

const { JWT_SIGNATURE_KEY = "RAHASIA" } = process.env;

function isUsernameValid(inputUsername, usernameInDB){
    if(inputUsername === usernameInDB) return true;
    return false;
}
  
function isPasswordValid(inputPassword, encryptedPassword){
    return bcrypt.compareSync(inputPassword, encryptedPassword);
}

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
      role: ROLE.ADMIN
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
    const {username, password} = req.body;

    const user = await User.findOne({
        where:{
            username,
        },
      attributes: ['username', 'password', 'role']
    });

    if(user.role !== ROLE.ADMIN){
        res.status(403).json({
            status: "FAIL",
            data:{
                name: "FORBIDDEN",
                message: "You're not admin!"
            }
        });
    }

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
}

exports.getAllUser = async(req, res) => {
  try {
    const users = await User.findAll({
      where:{
        role: ROLE.USER
      }
    });

    res.status(201).json({
      status: "OK!",
      data: users
    });
  } catch (err) {
    res.status(401).json({
      status: "FAIL",
      data:{
        message: err.message
      }
    });
  }
}

exports.getAllRoom = async(req, res) => {
  try {
    const rooms = await Room.findAll({
      include:[{
        model: User,
        through:{
          attributes:['roomMasterId', 'roomEnemyId']
        }
      }],
      order: [
        ['createdAt', 'ASC']
      ]
    });

    const gameHistory = rooms.map(room => {
      return {
        id: room.id,
        roomName: room.roomName,
        roomMasterId: room.Users[0].UserRooms.roomMasterId,
        roomEnemyId: room.Users[0].UserRooms.roomEnemyId,
        playerWinId: room.playerWinId
      };
            
    });

    res.status(201).json({
      status: "OK!",
      data: gameHistory
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

exports.getAllRound = async(req, res) => {
  try {
    const rounds = await Round.findAll();

    res.status(201).json({
      status: "OK!",
      data: rounds
    });
  } catch (err) {
    res.status(401).json({
      status: "FAIL",
      data:{
        message: err.message
      }
    });
  }
}
