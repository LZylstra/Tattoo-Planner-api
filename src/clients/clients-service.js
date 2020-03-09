const xss = require("xss");

const ClientsService = {
  getAllClients(db) {
    return db.select("*").from("clients");
  },
  getByArtistId(db, id) {
    return db
      .from("clients AS c")
      .select(
        "c.id",
        "c.full_name",
        "c.phone",
        "c.email",
        "c.client_rating",
        "c.artist",
        ...userFields
      )
      .leftJoin("tattoo_users AS usr", "c.artist", "usr.id")
      .where("usr.id", id);
  },
  getById(db, id) {
    return db
      .from("clients")
      .select("*")
      .where("clients.id", id)
      .first();
  },
  insertClient(db, newClient) {
    return db
      .insert(newClient)
      .into("clients")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteClient(db, id) {
    return db("clients")
      .where({ id })
      .delete();
  },
  updateClient(db, id, newClientFields) {
    return db("clients")
      .where({ id })
      .update(newClientFields);
  },
  getClientsTattoos(db, client_id) {
    return (
      db
        .from("tattoos as t")
        .select(
          "t.id",
          "t.title",
          "t.position",
          "t.info",
          "t.curr_status",
          "t.tattoo_rating",
          "t.client"
          //  ...clientFields,
        )
        .where("t.client", client_id)
        // .leftJoin('clients AS c', 't.client', 'c.artist')
        .groupBy("t.id")
    );
  },

  serializeClientsTattoos(tattoos) {
    return tattoos.map(this.serializeClientsTattoo);
  },

  serializeClientsTattoo(tattoo) {
    return {
      id: tattoo.id,
      title: xss(tattoo.title),
      position: xss(tattoo.position),
      info: xss(tattoo.info),
      curr_status: tattoo.curr_status,
      tattoo_rating: Number(tattoo.tattoo_rating),
      client: tattoo.client
    };
  }
};
const userFields = [
  "usr.id AS user:id",
  "usr.user_name AS user:user_name",
  "usr.full_name AS user:full_name"
];

const clientFields = [
  "c.id AS client:id",
  "c.full_name AS Client:full_name",
  "c.phone AS client:phone",
  "c.email AS client:email",
  "c.client_rating AS client:client_rating",
  "c.artist AS client:artist"
];

module.exports = ClientsService;
