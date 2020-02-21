const ClientsService = {
  //might remove this later after get auth working better
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
      .where("id", id)
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
  }
};
const userFields = [
  "usr.id AS user:id",
  "usr.user_name AS user:user_name",
  "usr.full_name AS user:full_name"
];

module.exports = ClientsService;
