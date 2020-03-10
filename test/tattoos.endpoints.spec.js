const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Tattoos Endpoints", function() {
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

  describe(`GET /api/tattoos`, () => {
    context(`Given no tattoos`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/tattoos")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context(`Given there are tattoos in the database`, () => {
      beforeEach("insert tattoos", () =>
        helpers.seedTattoos(db, testUsers, testClients, testTattoos)
      );

      it("responds with 200 and all of the tattoos", () => {
        let expectedTattoos = [];
        testTattoos.map(tattoo => {
          expectedTattoos.push(helpers.makeExpectedTattoo(tattoo));
        });

        return supertest(app)
          .get("/api/tattoos")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedTattoos);
      });

      context(`/artist/:artistId get all tattoos for logged in artist`, () => {
        it("responds with 200 and all of the tattoos for the artist", () => {
          let expectedTattoo = [
            {
              id: 1,
              title: "First test tattoo",
              position: "Arm",
              info:
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt",
              curr_status: "In Progress",
              tattoo_rating: 3,
              client: testClients[0].id
            }
          ];

          return supertest(app)
            .get("/api/tattoos/artist/1")
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(200, expectedTattoo);
        });
      });

      context(`/client/:id get all tattoos for a specific client`, () => {
        it("responds with 200 and all of the tattoos for the client", () => {
          let expectedTattoo = [
            {
              id: 1,
              title: "First test tattoo",
              position: "Arm",
              info:
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt",
              curr_status: "In Progress",
              tattoo_rating: 3,
              client: testClients[0].id
            }
          ];

          return supertest(app)
            .get("/api/tattoos/client/1")
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(200, expectedTattoo);
        });
      });
    });
  });

  describe(`GET /api/tattoos/:id`, () => {
    before("seed users", () => helpers.seedUsers(db, testUsers));
    context(`Given no matching tattoo id`, () => {
      it(`responds with 404`, () => {
        const tattooId = 12345;
        const expected = {
          error: { message: `Tattoo Not Found` }
        };
        return supertest(app)
          .get(`/api/tattoos/${tattooId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, expected);
      });
    });

    context(`Given there is a matching tattoo id`, () => {
      beforeEach("insert tattoos", () =>
        helpers.seedTattoos(db, testUsers, testClients, testTattoos)
      );

      it("responds with 200 and the matching tattoo", () => {
        let expectedTattoo = {
          id: 1,
          title: "First test tattoo",
          position: "Arm",
          info:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt",
          curr_status: "In Progress",
          tattoo_rating: 3,
          client: testClients[0].id
        };
        return supertest(app)
          .get("/api/tattoos/1")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedTattoo);
      });

      context(`/client`, () => {
        it("responds with 200 and the client information of the given tattoo", () => {
          let expectedClient = {
            id: 1,
            full_name: "Test Name",
            phone: "123-456-7890",
            email: "email@email.com",
            client_rating: 2,
            artist: testUsers[0].id
          };

          return supertest(app)
            .get("/api/tattoos/1/client")
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(200, expectedClient);
        });
      });
    });
  });

  describe(`POST /api/tattoos/artist/:artistId`, () => {
    beforeEach("insert clients", () =>
      helpers.seedClients(db, testUsers, testClients)
    );
    it("responds with 201 and the new tattoo", () => {
      const newTattoo = {
        title: "Test",
        position: "Arm",
        info: "test description for test tattoo",
        curr_status: "New",
        tattoo_rating: 3,
        client: 1
      };
      return supertest(app)
        .post("/api/tattoos/artist/1")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(newTattoo)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property("title");
          expect(res.body).to.have.property("position");
          expect(res.body).to.have.property("curr_status");
          expect(res.body).to.have.property("client");
          expect(res.body.title).to.eql(newTattoo.title);
          expect(res.body.position).to.eql(newTattoo.position);
          expect(res.body.info).to.eql(newTattoo.info);
          expect(res.body.curr_status).to.eql(newTattoo.curr_status);
          expect(res.body.tattoo_rating).to.eql(newTattoo.tattoo_rating);
          expect(res.body.client).to.eql(newTattoo.client);
        })
        .expect(res => {
          db.from("tattoos")
            .select("*")
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.title).to.eql(newTattoo.title);
              expect(row.position).to.eql(newTattoo.position);
              expect(row.info).to.eql(newTattoo.info);
              expect(row.curr_status).to.eql(newTattoo.curr_status);
              expect(row.tattoo_rating).to.eql(newTattoo.tattoo_rating);
              expect(row.client).to.eql(newTattoo.client);
            });
        });
    });
  });
});
