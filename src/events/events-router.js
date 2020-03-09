const express = require("express");
const logger = require("../middleware/logger");
const xss = require("xss");

const EventsService = require("./events-service");

const EventsRouter = express.Router();
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

const serializeEvent = event => ({
  id: event.id,
  title: xss(event.title),
  description: xss(event.description),
  eventdate: event.eventdate,
  start_time: event.start_time,
  end_time: event.end_time,
  in_person: event.in_person,
  curr_status: event.curr_status,
  all_day: event.all_day,
  tattoo: event.tattoo
});

EventsRouter.route("/")
  // .all(requireAuth)
  .get((req, res, next) => {
    EventsService.getAllEvents(req.app.get("db"))
      .then(events => {
        res.json(events.map(serializeEvent));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const {
      title,
      description,
      eventdate,
      start_time,
      end_time,
      in_person,
      curr_status,
      all_day,
      tattoo
    } = req.body;
    const newEvent = {
      title,
      description,
      eventdate,
      start_time,
      end_time,
      in_person,
      curr_status,
      all_day,
      tattoo
    };

    const required = {
      title,
      eventdate,
      in_person,
      curr_status,
      all_day,
      tattoo
    };

    for (const [key, value] of Object.entries(required)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
      }
    }

    EventsService.insertEvent(req.app.get("db"), newEvent)
      .then(event => {
        res
          .status(201)
          .location(`/`)
          .json(serializeEvent(event));
      })
      .catch(next);
  });
EventsRouter.route("/artist/:artistId")
  .all(requireAuth)
  .get((req, res, next) => {
    const { artistId } = req.params;
    EventsService.getAllUserEvents(req.app.get("db"), artistId)
      .then(events => {
        if (!events) {
          logger.error(`Event with Artist id ${artistId} not found.`);
          return res.status(404).json({
            error: { message: `Event not found` }
          });
        }
        res.json(events.map(serializeEvent));
      })
      .catch(next);
  });

EventsRouter.route("/:id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.params;
    EventsService.getById(req.app.get("db"), id)
      .then(event => {
        if (!event) {
          logger.error(`Event with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Event Not Found` }
          });
        }
        res.json(serializeEvent(event));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    EventsService.deleteEvent(req.app.get("db"), id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

// Get the tattoo that links to given Event id
EventsRouter.route("/:id/tattoo")
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.params;
    EventsService.getTattoobyEventId(req.app.get("db"), id)
      .then(tattoo => {
        if (!tattoo) {
          logger.error(`Tattoo with Event id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Tattoo Event Not Found` }
          });
        }
        res.json(serializeTattoo(tattoo));
      })
      .catch(next);
  });

// Get a list of events for a particular tattoo
EventsRouter.route("/tattoo/:id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.params;
    EventsService.getEventsByTattoo(req.app.get("db"), id)
      .then(events => {
        if (!events) {
          logger.error(`Events for tattoo id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Events For Tattoo Not Found` }
          });
        }
        res.json(events.map(serializeEvent));
      })
      .catch(next);
  });

module.exports = EventsRouter;
