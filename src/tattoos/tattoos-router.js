const express = require("express");
const logger = require("../middleware/logger");
const xss = require("xss");
const TattoosService = require("./tattoos-service");
const { check, validationResult } = require("express-validator");

const TattoosRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");

const serializeTattoo = tattoo => ({
  id: tattoo.id,
  title: xss(tattoo.title),
  position: xss(tattoo.position),
  info: xss(tattoo.info),
  curr_status: tattoo.curr_status,
  tattoo_rating: Number(tattoo.tattoo_rating),
  client: tattoo.client
});

const serializeClient = client => ({
  id: client.id,
  full_name: xss(client.full_name),
  phone: xss(client.phone),
  email: xss(client.email),
  client_rating: Number(client.client_rating),
  artist: client.artist
});

TattoosRouter.route("/")
  // .all(requireAuth)
  .get((req, res, next) => {
    TattoosService.getAllTattoos(req.app.get("db"))
      .then(tattoos => {
        res.json(tattoos.map(serializeTattoo));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const {
      title,
      position,
      info,
      curr_status,
      tattoo_rating,
      client
    } = req.body;
    const newTattoo = {
      title,
      position,
      info,
      curr_status,
      tattoo_rating,
      client
    };
    //console.log(newTattoo);
    const required = { title, curr_status, client };
    for (const [key, value] of Object.entries(required))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
    if (tattoo_rating !== undefined) {
      if (
        !Number.isInteger(tattoo_rating) ||
        tattoo_rating < 0 ||
        tattoo_rating > 5
      ) {
        logger.error(`Invalid rating '${tattoo_rating}' supplied`);
        return res
          .status(400)
          .send(`'tattoo_rating' must be a number between 0 and 5`);
      }
    }
    TattoosService.insertTattoo(req.app.get("db"), newTattoo)
      .then(tattoo => {
        res
          .status(201)
          .location(`/`)
          .json(serializeTattoo(tattoo));
      })
      .catch(next);
  });

//gets all tattoos for a particular client id
TattoosRouter.route("/client/:id")
  // .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.params;
    TattoosService.getByClientId(req.app.get("db"), id)
      .then(tattoos => {
        if (!tattoos) {
          logger.error(`Tattoo with client id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Client not found` }
          });
        }
        res.json(tattoos.map(serializeTattoo));
      })
      .catch(next);
  });

TattoosRouter.route("/:id")
  .get((req, res, next) => {
    const { id } = req.params;
    TattoosService.getById(req.app.get("db"), id)
      .then(tattoo => {
        if (!tattoo) {
          logger.error(`Tattoo with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Tattoo Not Found` }
          });
        }
        res.json(serializeTattoo(tattoo));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    TattoosService.deleteTattoo(req.app.get("db"), id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

TattoosRouter.route("/:id/client").get((req, res, next) => {
  const { id } = req.params;
  TattoosService.getClientByTattooId(req.app.get("db"), id)
    .then(client => {
      if (!client) {
        logger.error(`Tattoo with id ${id} not found.`);
        return res.status(404).json({
          error: { message: `Tattoo Not Found` }
        });
      }
      res.json(serializeClient(client));
    })
    .catch(next);
});

module.exports = TattoosRouter;
