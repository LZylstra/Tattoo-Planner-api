const TattoosService = {
  //might remove this later after get auth working better
  getAllTattoos(db) {
    return db.select("*").from("tattoos");
  },
  getByClientId(db, id) {
    return db
      .from("tattoos AS t")
      .select(
        "t.id",
        "t.title",
        "t.position",
        "t.info",
        "t.curr_status",
        "t.tattoo_rating",
        "t.client",
        ...clientFields
      )
      .leftJoin("clients AS c", "t.client", "c.id")
      .where("c.id", id);
  },
  // getByClientandId(db, id) {
  //   return db
  //     .from("tattoos AS t")
  //     .select(
  //       "t.id",
  //       "t.title",
  //       "t.position",
  //       "t.info",
  //       "t.curr_status",
  //       "t.tattoo_rating",
  //       "t.client",
  //       ...clientFields
  //     )
  //     .leftJoin("clients AS c", "t.client", "c.id")
  //     .where("t.id", id);
  // },
  getClientByTattooId(db, tattoo_id) {
    return db
      .from("clients AS c")
      .select(
        "c.id",
        "c.full_name",
        "c.phone",
        "c.email",
        "c.client_rating",
        "c.artist",
        ...tattooFields
      )
      .leftJoin("tattoos AS t", "t.client", "c.id")
      .where("t.id", tattoo_id)
      .first();
  },
  getById(db, id) {
    return db
      .from("tattoos")
      .select("*")
      .where("id", id)
      .first();
  },
  insertTattoo(db, newTattoo) {
    return db
      .insert(newTattoo)
      .into("tattoos")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteTattoo(db, id) {
    return db("tattoos")
      .where({ id })
      .delete();
  },
  updateTattoo(db, id, newTattooFields) {
    return db("tattoos")
      .where({ id })
      .update(newTattooFields);
  }
  // getClients(db, cid){
  //   return db('tattoos')
  //   .
  // }
};
const clientFields = [
  "c.id AS clients:id",
  "c.full_name AS clients:full_name",
  "c.phone AS clients:phone",
  "c.email AS clients:email",
  "c.client_rating AS clients:clients_rating",
  "c.artist AS clients:artist"
];

const tattooFields = [
  "t.id AS tattoo:id",
  "t.title AS tattoo:title",
  "t.position AS tattoo:position",
  "t.info AS tattoo:info",
  "t.curr_status AS tattoo:curr_status",
  "t.tattoo_rating AS tattoo:tattoo_rating",
  "t.client AS tattoo:client"
];

module.exports = TattoosService;
