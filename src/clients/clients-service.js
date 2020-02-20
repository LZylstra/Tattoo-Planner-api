const xss = require("xss");
const Treeize = require("treeize");

const ClientsService = {
  getAllClients(db) {
    return db
      .from("clients")
      .select(
        "clients.id",
        "clients.full_name",
        "clients.phone",
        "clients.email",
        "clients.artist",
        "clients.rating",
        ...userFields
      )
      .leftJoin("tattoo_users AS usr", "clients.artist", "usr.id")
      .groupBy("clients.artist", "usr.id");
  },

  getById(db, id) {
    return ClientsService.getAllClients(db)
      .where("clients.id", id)
      .first();
  },

  getReviewsForClient(db, client_id) {
    return db
      .from("tattoos")
      .select(
        "tattoos.id",
        "tattoos.title",
        "tattoos.location",
        "tattoos.description",
        "tattoos.status",
        ...userFields
      )
      .where("tattoos.client", client_id)
      .leftJoin("clients", "tattoos.client", "clients.id")
      .groupBy("tattoos.id", "clients.id");
  },

  serializeClients(clients) {
    return clients.map(this.serializeClient);
  },

  serializeClient(client) {
    const ClientTree = new Treeize();

    // Some light hackiness to allow for the fact that `treeize`
    // only accepts arrays of objects, and we want to use a single
    // object.
    const clientData = clientTree.grow([client]).getData()[0];

    return {
      id: clientData.id,
      full_name: xss(clientData.full_name),
      phone: xss(clientData.phone),
      email: xss(clientData.email),
      client_rating: clientData.rating
    };
  },

  serializeClientTattoos(tattoos) {
    return tattoos.map(this.serializeClientTattoos);
  },

  serializeClientTattoos(tattoo) {
    const tattooTree = new Treeize();

    // Some light hackiness to allow for the fact that `treeize`
    // only accepts arrays of objects, and we want to use a single
    // object.
    const tattooData = tattooTree.grow([tattoo]).getData()[0];

    return {
      id: tattooData.id,
      title: xss(tattooData.title),
      location: xss(tattooData.location),
      description: xss(tattooData.description),
      status: xss(tattooData.status),
      tattoo_rating: tattooData.rating
    };
  }
};

const userFields = [
  "usr.id AS user:id",
  "usr.user_name AS user:user_name",
  "usr.full_name AS user:full_name"
];

module.exports = ClientsService;
