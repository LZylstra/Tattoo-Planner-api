const express = require("express");
const ClientsService = require("./clients-service");
const { requireAuth } = require("../middleware/jwt-auth");

const clientsRouter = express.Router();

clientsRouter
  .route("/")
  //.all(requireAuth)
  .get((req, res, next) => {
    ClientsService.getAllClients(req.app.get("db"))
      .then(client => {
        res.json(ClientsService.serializeClients(clients));
      })
      .catch(next);
  });

clientsRouter
  .route("/:client_id")
  .all(requireAuth)
  .all(checkClientExists)
  .get((req, res) => {
    res.json(ClientsService.serializeClient(res.client));
  });

clientsRouter
  .route("/:client_id/tattoo/")
  .all(requireAuth)
  .all(checkClientExists)
  .get((req, res, next) => {
    ClientsService.getTattoosForClient(req.app.get("db"), req.params.tattooid) //might be params.id?
      .then(reviews => {
        res.json(ClientsService.serializeClientTattoos(tattoos));
      })
      .catch(next);
  });

/* async/await syntax for promises */
async function checkClientExists(req, res, next) {
  try {
    const client = await ClientsService.getById(
      req.app.get("db"),
      req.params.tattooid
    );

    if (!client)
      return res.status(404).json({
        error: `Client doesn't exist`
      });

    res.client = client;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = clientsRouter;
