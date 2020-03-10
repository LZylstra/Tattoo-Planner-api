const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Events Endpoints", function() {
  let db;

  const {
    testUsers,
    testTattoos,
    testClients,
    testEvents
  } = helpers.makeTattoosFixtures();

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

  describe(`Route /api/events`, () => {
    context(`GET: Given no events`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/events")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context(`GET: Given there are events in the database`, () => {
      beforeEach("insert events", () =>
        helpers.seedEvents(db, testUsers, testClients, testTattoos, testEvents)
      );

      it("responds with 200 and all of the events", () => {
        let expectedEvents = [];
        testEvents.map(event => {
          expectedEvents.push(helpers.makeExpectedEvent(event));
        });

        return supertest(app)
          .get("/api/events")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedEvents);
      });
    });

    context(`POST `, () => {
      beforeEach("insert events", () =>
        helpers.seedEvents(db, testUsers, testClients, testTattoos, testEvents)
      );

      it("responds with 201 and the new event", () => {
        const newEvent = {
          title: "Test Event",
          description: "test event description",
          eventdate: "2029-01-22T16:28:32.615Z",
          start_time: "12:34:00",
          end_time: "01:32:00",
          in_person: true,
          curr_status: "New",
          all_day: false,
          tattoo: 1
        };
        return supertest(app)
          .post("/api/events")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(newEvent)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property("title");
            expect(res.body).to.have.property("eventdate");
            expect(res.body).to.have.property("in_person");
            expect(res.body).to.have.property("curr_status");
            expect(res.body).to.have.property("all_day");
            expect(res.body).to.have.property("tattoo");
            expect(res.body.title).to.eql(newEvent.title);
            expect(res.body.description).to.eql(newEvent.description);
            expect(res.body.eventdate).to.eql(newEvent.eventdate);
            expect(res.body.start_time).to.eql(newEvent.start_time);
            expect(res.body.end_time).to.eql(newEvent.end_time);
            expect(res.body.in_person).to.eql(newEvent.in_person);
            expect(res.body.curr_status).to.eql(newEvent.curr_status);
            expect(res.body.all_day).to.eql(newEvent.all_day);
            expect(res.body.tattoo).to.eql(newEvent.tattoo);
          })
          .expect(res => {
            db.from("events")
              .select("*")
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.title).to.eql(newEvent.title);
                expect(row.description).to.eql(newEvent.description);
                expect(row.eventdate).to.eql(newEvent.eventdate);
                expect(row.start_time).to.eql(newEvent.start_time);
                expect(row.end_time).to.eql(newEvent.end_time);
                expect(res.body.in_person).to.eql(newEvent.in_person);
                expect(res.body.curr_status).to.eql(newEvent.curr_status);
                expect(res.body.all_day).to.eql(newEvent.all_day);
                expect(res.body.tattoo).to.eql(newEvent.tattoo);
              });
          });
      });
    });
  });

  describe(`Route /api/events/:id`, () => {
    beforeEach("insert events", () =>
      helpers.seedEvents(db, testUsers, testClients, testTattoos, testEvents)
    );
    context(`Get: Given no matching event id`, () => {
      it(`responds with 404`, () => {
        const eventId = 12345;
        const expected = {
          error: { message: `Event Not Found` }
        };
        return supertest(app)
          .get(`/api/events/${eventId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, expected);
      });
    });

    context(`GET: Given there is a matching id`, () => {
      it("responds with 200 and the matching event", () => {
        let expectedEvent = {
          id: 1,
          title: "Event1",
          description: "test description",
          eventdate: "2029-01-22T16:28:32.615Z",
          start_time: "12:34:00",
          end_time: "01:32:00",
          in_person: true,
          curr_status: "Upcoming",
          all_day: false,
          tattoo: 1
        };

        return supertest(app)
          .get("/api/events/1")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedEvent);
      });
    });
  });

  describe(`Route /api/events/artist/:artistId`, () => {
    beforeEach("insert events", () =>
      helpers.seedEvents(db, testUsers, testClients, testTattoos, testEvents)
    );

    context(`GET: Given there is a matching artist id`, () => {
      it("responds with 200 and the matching events", () => {
        let expectedEvent = [
          {
            id: 1,
            title: "Event1",
            description: "test description",
            eventdate: "2029-01-22T16:28:32.615Z",
            start_time: "12:34:00",
            end_time: "01:32:00",
            in_person: true,
            curr_status: "Upcoming",
            all_day: false,
            tattoo: 1
          }
        ];

        return supertest(app)
          .get("/api/events/artist/1")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedEvent);
      });
    });
  });
  describe(`Route /api/events/:id/tattoo`, () => {
    beforeEach("insert events", () =>
      helpers.seedEvents(db, testUsers, testClients, testTattoos, testEvents)
    );

    context(`Get: Given no matching event id`, () => {
      it(`responds with 404`, () => {
        const eventId = 1234;
        const expected = {
          error: { message: `Tattoo Event Not Found` }
        };
        return supertest(app)
          .get(`/api/events/${eventId}/tattoo`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, expected);
      });
    });

    context(`GET: Given there is a matching event id`, () => {
      it("responds with 200 and the events tattoos", () => {
        let expectedTattoo = {
          id: 1,
          title: "First test tattoo",
          position: "Arm",
          info:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt",
          curr_status: "In Progress",
          tattoo_rating: 3,
          client: 1
        };
        return supertest(app)
          .get("/api/events/1/tattoo")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedTattoo);
      });
    });
  });

  describe(`Route /api/events/tattoo/:id`, () => {
    beforeEach("insert events", () =>
      helpers.seedEvents(db, testUsers, testClients, testTattoos, testEvents)
    );

    context(`Get: Given no matching tattoo id`, () => {
      it(`responds with 404`, () => {
        const tattooId = 1234;
        const expected = {
          error: { message: `Events For Tattoo Not Found` }
        };
        return supertest(app)
          .get(`/api/events/tattoo/${tattooId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, expected);
      });
    });

    context(`GET: Given there is a matching tattoo id`, () => {
      it("responds with 200 and the tattoos events", () => {
        let expectedEvent = [
          {
            id: 1,
            title: "Event1",
            description: "test description",
            eventdate: "2029-01-22T16:28:32.615Z",
            start_time: "12:34:00",
            end_time: "01:32:00",
            in_person: true,
            curr_status: "Upcoming",
            all_day: false,
            tattoo: 1
          }
        ];
        return supertest(app)
          .get("/api/events/tattoo/1")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedEvent);
      });
    });
  });
});
