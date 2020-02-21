const express = require("express");
const logger = require("../middleware/logger");
const xss = require("xss");
const ClientsService = require("./clients-service");
const { check, validationResult } = require("express-validator");

const ClientsRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");

const serializeClient = client => ({
  id: client.id,
  full_name: xss(client.full_name),
  phone: xss(client.phone),
  email: xss(client.email),
  client_rating: Number(client.client_rating),
  artist: client.artist
});

//not sure i need this route might delete it later when auth implemented fully
ClientsRouter.route("/")
  // .all(requireAuth)
  .get((req, res, next) => {
    ClientsService.getAllClients(req.app.get("db"))
      .then(clients => {
        res.json(clients.map(serializeClient));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { full_name, phone, email, client_rating } = req.body;
    const newClient = { full_name, phone, email, client_rating };
    if (!req.body.full_name) {
      logger.error(`Client's full name is required`);
      return res.status(400).send(`'full_name' is required`);
    }
    console.log(client_rating);
    if (client_rating !== undefined) {
      if (
        !Number.isInteger(client_rating) ||
        client_rating < 0 ||
        client_rating > 5
      ) {
        logger.error(`Invalid rating '${client_rating}' supplied`);
        return res
          .status(400)
          .send(`'client_rating' must be a number between 0 and 5`);
      }
    }
    check("email").isEmail();
    check("phone").isMobilePhone();

    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    ClientsService.insertClient(req.app.get("db"), newClient)
      .then(client => {
        res
          .status(201)
          .location(`/`)
          .json(serializeClient(client));
      })
      .catch(next);
  });

//gets all clients for a particular artist id
ClientsRouter.route("/artist/:id")
  // .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.params;
    ClientsService.getByArtistId(req.app.get("db"), id)
      .then(clients => {
        if (!clients) {
          logger.error(`Client with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Client not found` }
          });
        }
        res.json(clients.map(serializeClient));
      })
      .catch(next);
  });

ClientsRouter.route("/:id")
  .get((req, res, next) => {
    const { id } = req.params;
    ClientsService.getById(req.app.get("db"), id)
      .then(client => {
        if (!client) {
          logger.error(`Client with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Client Not Found` }
          });
        }
        res.json(serializeClient(client));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    ClientsService.deleteClient(req.app.get("db"), id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = ClientsRouter;
