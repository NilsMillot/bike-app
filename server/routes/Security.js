const { Router } = require("express");
const { User } = require("../models/postgres");
const { ValidationError } = require("sequelize");
const bcryptjs = require("bcryptjs");
const { createToken, checkToken } = require("../lib/jwt");
const router = new Router();

const formatError = (validationError) => {
  return validationError.errors.reduce((acc, error) => {
    acc[error.path] = error.message;
    return acc;
  }, {});
};

router.post("/register", async (req, res) => {
  try {
    const result = await User.create(req.body);
    console.log('%cSecurity.js line:18 req.body', 'color: #007acc;', req.body);
    console.log('%cSecurity.js line:19 result', 'color: #007acc;', result);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      res.sendStatus(500);
    }
  }
});

router.post("/checkToken", async (req, res) => {
  try {
    const user = await checkToken(req.body.token);
    if (user) {
      req.user = await User.findByPk(user.id);
      const userData = {
        id: req.user.id,
        email: req.user.email,
        firstname: req.user.firstname,
        isAdmin: req.user.isAdmin,
      };
      res.status(200).json(userData);
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post("/login", async (req, res) => {
  try {
    // in theory it is supposed to allow us to authorize the sources where our api is called
    // (I don't think it is enough :))
    // *
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header(
    //   "Access-Control-Allow-Methods",
    //   "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    // );
    // res.header(
    //   "Access-Control-Allow-Headers",
    //   "Origin, Content-Type, X-Auth-Token"
    // );
    // res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    const result = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!result) {
      res.status(401).json({
        email: "Email not found",
      });
      return;
    }
    if (result.status != "active") {
      return res.status(401).send({
        pendingAccount: "Pending Account. Please Verify Your Email!",
      });
    }
    if (!(await bcryptjs.compare(req.body.password, result.password))) {
      res.status(401).json({
        password: "Password is incorrect",
      });
      return;
    }
    res.json({ token: await createToken(result) });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post("/password-reset", async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user)
      return res.status(400).send("user with given email doesn't exist");

    let shortPayload = {
      id: user.id,
    };
    let token = await createToken(shortPayload, "120s");
    token = token.replace(/\./g, "---");

    const link = `<span>Changer mon mot de passe : <a href="localhost:3001/password-reset/${user.id}/${token}">localhost:3001/password-reset/${user.id}/${token}</a></span>`;
    // await sendMailBasic(
    //   user.email,
    //   "Modification de votre mot de passe | COMMUNITY",
    //   link
    // );

    res.send("password reset link sent to your email account");
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post("/password-reset/:userId/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.userId,
      },
    });
    if (!user) return res.status(400).send("invalid link or expired");

    const token = req.params.token;
    if (!token) return res.status(400).send("Invalid link or expired");
    if (!(await checkToken(token)))
      return res.status(400).send("Invalid link or expired");

    user.password = req.body.password;
    user.save((err) => {
      if (err) {
        res.status(502).send({ message: err });
        return;
      }
    });

    res.send("password reset sucessfully.");
  } catch (error) {
    res.send("An error occured while trying to reset password");
  }
});

module.exports = router;
