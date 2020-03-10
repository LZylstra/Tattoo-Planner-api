const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Clients Endpoints", function() {
  let db;

  const { testUsers, testTattoos, testClients } = helpers.makeTattoosFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));
  before("seed users", () => helpers.seedUsers(db, testUsers));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`Route /api/clients`, () => {
    context(`GET: Given no clients`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/clients")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context(`GET: Given there are clients in the database`, () => {
      beforeEach("insert clients", () =>
        helpers.seedClients(db, testUsers, testClients)
      );

      it("responds with 200 and all of the clients", () => {
        let expectedClients = [];
        testClients.map(client => {
          expectedClients.push(helpers.makeExpectedClient(client));
        });

        return supertest(app)
          .get("/api/clients")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedClients);
      });
    });

    context(`POST `, () => {
      beforeEach("insert clients", () =>
        helpers.seedClients(db, testUsers, testClients)
      );

      it("responds with 201 and the new client", () => {
        const newClient = {
          full_name: "Test Name",
          phone: "123-456-7890",
          email: "testemail@email.com",
          client_rating: 3,
          artist: 1
        };
        return supertest(app)
          .post("/api/clients")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(newClient)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property("full_name");
            expect(res.body).to.have.property("client_rating");
            expect(res.body).to.have.property("artist");
            expect(res.body.full_name).to.eql(newClient.full_name);
            expect(res.body.phone).to.eql(newClient.phone);
            expect(res.body.email).to.eql(newClient.email);
            expect(res.body.client_rating).to.eql(newClient.client_rating);
            expect(res.body.artist).to.eql(newClient.artist);
          })
          .expect(res => {
            db.from("clients")
              .select("*")
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.full_name).to.eql(newClient.full_name);
                expect(row.phone).to.eql(newClient.phone);
                expect(row.email).to.eql(newClient.email);
                expect(row.client_rating).to.eql(newClient.client_rating);
                expect(row.artist).to.eql(newClient.artist);
              });
          });
      });
    });
  });

  describe(`Route /api/clients/:id`, () => {
    before("seed users", () => helpers.seedUsers(db, testUsers));
    context(`Get: Given no matching client id`, () => {
      it(`responds with 404`, () => {
        const clientId = 12345;
        const expected = {
          error: { message: `Client Not Found` }
        };
        return supertest(app)
          .get(`/api/clients/${clientId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, expected);
      });
    });
    context(`GET: Given there is a matching id`, () => {
      beforeEach("insert clients", () =>
        helpers.seedClients(db, testUsers, testClients)
      );
      it("responds with 200 and the matching tattoo", () => {
        let expectedClient = {
          id: 1,
          full_name: "Test Name",
          phone: "123-456-7890",
          email: "email@email.com",
          client_rating: 2,
          artist: 1
        };

        return supertest(app)
          .get("/api/clients/1")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedClient);
      });
    });
  });
  describe(`Route /api/clients/artist/:artistId`, () => {
    context(`GET: Given there is a matching artist id`, () => {
      beforeEach("insert clients", () =>
        helpers.seedClients(db, testUsers, testClients)
      );
      it("responds with 200 and the clients for that artist id", () => {
        let expectedClient = [
          {
            id: 1,
            full_name: "Test Name",
            phone: "123-456-7890",
            email: "email@email.com",
            client_rating: 2,
            artist: 1
          }
        ];
        return supertest(app)
          .get("/api/clients/artist/1")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedClient);
      });
    });
  });
  describe(`Route /api/clients/:id/tattoos`, () => {
    context(`GET: Given there is a matching id that has tattoos`, () => {
      beforeEach("insert tattoos", () =>
        helpers.seedTattoos(db, testUsers, testClients, testTattoos)
      );
      it("responds with 200 and the tattoos", () => {
        let expectedTattoo = [
          {
            id: 1,
            title: "First test tattoo",
            position: "Arm",
            info:
              "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt",
            curr_status: "In Progress",
            tattoo_rating: 3,
            client: 1
          }
        ];
        return supertest(app)
          .get("/api/clients/1/tattoos")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedTattoo);
      });
    });
  });
});
