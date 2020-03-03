const express = require("express");
const path = require("path");
const xss = require("xss");
const UsersService = require("./users-service");

const usersRouter = express.Router();
const jsonBodyParser = express.json();

const serializeUser = user => ({
  id: user.id,
  user_name: xss(user.user_name),
  full_name: xss(user.full_name)
});
usersRouter
  .route("/:userName")
  //.all(requireAuth)
  .get((req, res, next) => {
    const { userName } = req.params;
    UsersService.getUserId(req.app.get("db"), userName)
      .then(user => {
        if (!user) {
          logger.error(`User with username ${userName} not found.`);
          return res.status(404).json({
            error: { message: `User not found` }
          });
        }
        res.json(user);
      })
      .catch(next);
  });

usersRouter.post("/", jsonBodyParser, (req, res, next) => {
  const { password, user_name, full_name } = req.body;
  for (const field of ["full_name", "user_name", "password"])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });
  const passwordError = UsersService.validatePassword(password);

  if (passwordError) return res.status(400).json({ error: passwordError });
  UsersService.hasUserWithUserName(req.app.get("db"), user_name)
    .then(hasUserWithUserName => {
      if (hasUserWithUserName)
        return res.status(400).json({ error: `Username already taken` });
      return UsersService.hashPassword(password).then(hashedPassword => {
        const newUser = {
          user_name,
          password: hashedPassword,
          full_name
        };

        return UsersService.insertUser(req.app.get("db"), newUser).then(
          user => {
            const sub = user.username;
            const payload = { user_id: user.id };
            let jwt = AuthService.createJwt(sub, payload);

            res
              .status(201)
              // .location(path.posix.join(req.originalUrl, `/${user.id}`))
              //.json(UsersService.serializeUser(user));
              .json(jwt);
          }
        );
      });
    })
    .catch(next);
});

module.exports = usersRouter;
