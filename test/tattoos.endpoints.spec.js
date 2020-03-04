const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const bcrypt = require("bcryptjs");

describe.only("Tattoos Endpoints", function() {
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
  // before("seed users"), () => helpers.seedUsers(db, testUsers);

  afterEach("cleanup", () => helpers.cleanTables(db));

  //   describe(`Protected endpoints`, () => {
  //     beforeEach("insert articles", () =>
  //       helpers.seedArticlesTables(db, testUsers, testArticles, testComments)
  //     );

  //     const protectedEndpoints = [
  //       {
  //         name: "GET /api/articles/:article_id",
  //         path: "/api/articles/1"
  //       },
  //       {
  //         name: "GET /api/articles/:article_id/comments",
  //         path: "/api/articles/1/comments"
  //       }
  //     ];

  //     protectedEndpoints.forEach(endpoint => {
  //       describe(endpoint.name, () => {
  //         it(`responds with 401 'Missing basic token' when no basic token`, () => {
  //           return supertest(app)
  //             .get(endpoint.path)
  //             .expect(401, { error: `Missing basic token` });
  //         });
  //         it(`responds 401 'Unauthorized request' when no credentials in token`, () => {
  //           const userNoCreds = { user_name: "", password: "" };
  //           return supertest(app)
  //             .get(endpoint.path)
  //             .set("Authorization", helpers.makeAuthHeader(userNoCreds))
  //             .expect(401, { error: `Unauthorized request` });
  //         });
  //         it(`responds 401 'Unauthorized request' when invalid user`, () => {
  //           const userInvalidCreds = {
  //             user_name: "user-not",
  //             password: "existy"
  //           };
  //           return supertest(app)
  //             .get(endpoint.path)
  //             .set("Authorization", helpers.makeAuthHeader(userInvalidCreds))
  //             .expect(401, { error: `Unauthorized request` });
  //         });
  //         it(`responds 401 'Unauthorized request' when invalid password`, () => {
  //           const userInvalidPass = {
  //             user_name: testUsers[0].user_name,
  //             password: "wrong"
  //           };
  //           return supertest(app)
  //             .get(endpoint.path)
  //             .set("Authorization", helpers.makeAuthHeader(userInvalidPass))
  //             .expect(401, { error: `Unauthorized request` });
  //         });
  //       });
  //     });
  //   });

  describe(`GET /api/tattoos`, () => {
    preppedUser = {
      id: 1,
      full_name: "Test User",
      password: bcrypt.hashSync("password", 1),
      user_name: "testuser"
    };
    beforeEach("seed user", () => db.into("tattoo_users").insert(preppedUser));

    context(`Given no tattoos`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/tattoos")
          .set("Authorization", helpers.makeAuthHeader(preppedUser))
          .expect(200, []);
      });
    });

    // context("Given there are articles in the database", () => {
    //   beforeEach("insert articles", () =>
    //     helpers.seedArticlesTables(db, testUsers, testArticles, testComments)
    //   );

    //   it("responds with 200 and all of the articles", () => {
    //     const expectedArticles = testArticles.map(article =>
    //       helpers.makeExpectedArticle(testUsers, article, testComments)
    //     );
    //     return supertest(app)
    //       .get("/api/articles")
    //       .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
    //       .expect(200, expectedArticles);
    //   });
    // });

    // context(`Given an XSS attack article`, () => {
    //   const testUser = helpers.makeUsersArray()[1];
    //   const {
    //     maliciousArticle,
    //     expectedArticle
    //   } = helpers.makeMaliciousArticle(testUser);

    //   beforeEach("insert malicious article", () => {
    //     return helpers.seedMaliciousArticle(db, testUser, maliciousArticle);
    //   });

    //   it("removes XSS attack content", () => {
    //     return supertest(app)
    //       .get(`/api/articles`)
    //       .expect(200)
    //       .expect(res => {
    //         expect(res.body[0].title).to.eql(expectedArticle.title);
    //         expect(res.body[0].content).to.eql(expectedArticle.content);
    //       });
    //   });
    // });
  });

  //   describe(`GET /api/articles/:article_id`, () => {
  //     context(`Given no articles`, () => {
  //       beforeEach(() => helpers.seedUsers(db, testUsers));
  //       it(`responds with 404`, () => {
  //         const articleId = 123456;
  //         return supertest(app)
  //           .get(`/api/articles/${articleId}`)
  //           .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
  //           .expect(404, { error: `Article doesn't exist` });
  //       });
  //     });

  //     context("Given there are articles in the database", () => {
  //       beforeEach("insert articles", () =>
  //         helpers.seedArticlesTables(db, testUsers, testArticles, testComments)
  //       );

  //       it("responds with 200 and the specified article", () => {
  //         const articleId = 2;
  //         const expectedArticle = helpers.makeExpectedArticle(
  //           testUsers,
  //           testArticles[articleId - 1],
  //           testComments
  //         );

  //         return supertest(app)
  //           .get(`/api/articles/${articleId}`)
  //           .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
  //           .expect(200, expectedArticle);
  //       });
  //     });

  //     context(`Given an XSS attack article`, () => {
  //       const testUser = helpers.makeUsersArray()[1];
  //       const {
  //         maliciousArticle,
  //         expectedArticle
  //       } = helpers.makeMaliciousArticle(testUser);

  //       beforeEach("insert malicious article", () => {
  //         return helpers.seedMaliciousArticle(db, testUser, maliciousArticle);
  //       });

  //       it("removes XSS attack content", () => {
  //         return supertest(app)
  //           .get(`/api/articles/${maliciousArticle.id}`)
  //           .set("Authorization", helpers.makeAuthHeader(testUser))
  //           .expect(200)
  //           .expect(res => {
  //             expect(res.body.title).to.eql(expectedArticle.title);
  //             expect(res.body.content).to.eql(expectedArticle.content);
  //           });
  //       });
  //     });
  //   });

  //   describe(`GET /api/articles/:article_id/comments`, () => {
  //     context(`Given no articles`, () => {
  //       beforeEach(() => helpers.seedUsers(db, testUsers));
  //       it(`responds with 404`, () => {
  //         const articleId = 123456;
  //         return supertest(app)
  //           .get(`/api/articles/${articleId}/comments`)
  //           .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
  //           .expect(404, { error: `Article doesn't exist` });
  //       });
  //     });

  //     context("Given there are comments for article in the database", () => {
  //       beforeEach("insert articles", () =>
  //         helpers.seedArticlesTables(db, testUsers, testArticles, testComments)
  //       );

  //       it("responds with 200 and the specified comments", () => {
  //         const articleId = 1;
  //         const expectedComments = helpers.makeExpectedArticleComments(
  //           testUsers,
  //           articleId,
  //           testComments
  //         );

  //         return supertest(app)
  //           .get(`/api/articles/${articleId}/comments`)
  //           .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
  //           .expect(200, expectedComments);
  //       });
  //     });
  //   });
});
