const xss = require("xss");

const EventsService = {
  getAllEvents(db) {
    return db.select("*").from("events");
  },
  getById(db, id) {
    return db
      .from("events")
      .select("*")
      .where("events.id", id)
      .first();
  },
  getEventsByTattoo(db, tId) {
    return db
      .from("events as e")
      .select(
        "e.id",
        "e.title",
        "e.description",
        "e.eventdate",
        "e.start_time",
        "e.end_time",
        "e.in_person",
        "e.curr_status",
        "e.all_day",
        "e.tattoo",
        ...tattooFields
      )
      .leftJoin("tattoos AS t", "t.id", "e.tattoo")
      .where("t.id", tId);
    //.groupBy("t.id");
  },
  getTattoobyEventId(db, eId) {
    return db
      .from("tattoos as t")
      .select(
        "t.id",
        "t.title",
        "t.position",
        "t.info",
        "t.curr_status",
        "t.tattoo_rating",
        "t.client"
      )
      .where("t.id", eId)
      .first();
  },
  insertEvent(db, newEvent) {
    return db
      .insert(newEvent)
      .into("events")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteEvent(db, id) {
    return db("events")
      .where({ id })
      .delete();
  },
  updateEvent(db, id, newEventFields) {
    return db("events")
      .where({ id })
      .update(newEventFields);
  }
};

const tattooFields = [
  "t.id AS tattoo:id",
  "t.title AS tattoo:title",
  "t.position AS tattoo:position",
  "t.info AS tattoo:info",
  "t.curr_status AS tattoo:curr_status",
  "t.tattoo_rating AS tattoo:tattoo_rating",
  "t.client AS tattoo:client"
];

module.exports = EventsService;
