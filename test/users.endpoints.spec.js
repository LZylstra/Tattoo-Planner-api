const knex = require("knex");
const bcrypt = require("bcryptjs");
const app = require("../src/app");
const helpers = require("./test-helpers");
const AuthService = require("../src/auth/auth-service");

describe("Users Endpoints", function() {
  let db;

  const { testUsers } = helpers.makeTattoosFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

      const requiredFields = ["user_name", "password", "full_name"];

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          user_name: "test user_name",
          password: "test password",
          full_name: "test full_name"
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post("/api/users")
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`
            });
        });

        it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
          const userShortPassword = {
            user_name: "test user_name",
            password: "1234567",
            full_name: "test full_name"
          };
          return supertest(app)
            .post("/api/users")
            .send(userShortPassword)
            .expect(400, {
              error: `Password must be longer than 8 characters`
            });
        });

        it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
          const userLongPassword = {
            user_name: "test user_name",
            password: "*".repeat(73),
            full_name: "test full_name"
          };

          return supertest(app)
            .post("/api/users")
            .send(userLongPassword)
            .expect(400, { error: `Password must be less than 72 characters` });
        });

        it(`responds 400 error when password starts with spaces`, () => {
          const userPasswordStartsSpaces = {
            user_name: "test user_name",
            password: " 1Aa!2Bb@",
            full_name: "test full_name"
          };
          return supertest(app)
            .post("/api/users")
            .send(userPasswordStartsSpaces)
            .expect(400, {
              error: `Password must not start or end with empty spaces`
            });
        });

        it(`responds 400 error when password ends with spaces`, () => {
          const userPasswordEndsSpaces = {
            user_name: "test user_name",
            password: "1Aa!2Bb@ ",
            full_name: "test full_name"
          };
          return supertest(app)
            .post("/api/users")
            .send(userPasswordEndsSpaces)
            .expect(400, {
              error: `Password must not start or end with empty spaces`
            });
        });

        it(`responds 400 error when password ends with spaces`, () => {
          const userPasswordEndsSpaces = {
            user_name: "test user_name",
            password: "1Aa!2Bb@ ",
            full_name: "test full_name"
          };
          return supertest(app)
            .post("/api/users")
            .send(userPasswordEndsSpaces)
            .expect(400, {
              error: `Password must not start or end with empty spaces`
            });
        });
        context(`Happy path`, () => {
          it(`responds 201, serialized user, storing bcryped password`, () => {
            const newUser = {
              user_name: "test user_name",
              password: "11AAaa!!",
              full_name: "test full_name"
            };
            const sub = newUser.user_name;
            const payload = { id: newUser.id };
            let jwt = AuthService.createJwt(sub, payload);

            return supertest(app)
              .post("/api/users")
              .send(newUser)
              .expect(201)
              .expect(res => {
                expect(res.body).to.have.property("user");
                expect(res.body).to.have.property("authToken");
                expect(res.body.user.full_name).to.eql(newUser.full_name);
                expect(res.body.user.user_name).to.eql(newUser.user_name);
                expect(res.body.user).to.not.have.property("password");
              })
              .expect(res =>
                db
                  .from("tattoo_users")
                  .select("*")
                  .where({ id: res.body.user.id })
                  .first()
                  .then(row => {
                    expect(row.user_name).to.eql(newUser.user_name);
                    expect(row.full_name).to.eql(newUser.full_name);
                    return bcrypt.compare(newUser.password, row.password);
                  })
                  .then(compareMatch => {
                    expect(compareMatch).to.be.true;
                  })
              );
          });
        });
      });
    });
  });
});
