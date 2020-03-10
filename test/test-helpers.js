const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "test-user-1",
      full_name: "Test user 1",
      password: "password"
    },
    {
      id: 2,
      user_name: "test-user-2",
      full_name: "Test user 2",
      password: "password"
    },
    {
      id: 3,
      user_name: "test-user-3",
      full_name: "Test user 3",
      password: "password"
    },
    {
      id: 4,
      user_name: "test-user-4",
      full_name: "Test user 4",
      password: "password"
    }
  ];
}

function makeTattoosArray(clients) {
  return [
    {
      id: 1,
      title: "First test tattoo",
      position: "Arm",
      info:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt",
      curr_status: "In Progress",
      tattoo_rating: 3,
      client: clients[0].id
    },
    {
      id: 2,
      title: "Second test tattoo",
      position: "Neck",
      info:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt",
      curr_status: "Completed",
      tattoo_rating: 5,
      client: clients[1].id
    },
    {
      id: 3,
      title: "Third test tattoo",
      position: "Chest",
      info:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt",
      curr_status: "New",
      tattoo_rating: 2,
      client: clients[2].id
    }
  ];
}
function makeClientsArray(artists) {
  return [
    {
      id: 1,
      full_name: "Test Name",
      phone: "123-456-7890",
      email: "email@email.com",
      client_rating: 2,
      artist: artists[0].id
    },
    {
      id: 2,
      full_name: "Test Name2",
      phone: "123-456-7890",
      email: "email@email.com",
      client_rating: 3,
      artist: artists[1].id
    },
    {
      id: 3,
      full_name: "Test Name3",
      phone: "123-456-7890",
      email: "email@email.com",
      client_rating: 5,
      artist: artists[2].id
    }
  ];
}

function makeEventsArray(tattoos) {
  return [
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
      tattoo: tattoos[0].id
    },
    {
      id: 2,
      title: "Event2",
      description: "test description",
      eventdate: "2029-01-22T16:28:32.615Z",
      start_time: "12:34:00",
      end_time: "01:32:00",
      in_person: true,
      curr_status: "Upcoming",
      all_day: false,
      tattoo: tattoos[1].id
    },
    {
      id: 3,
      title: "Event2",
      description: "test description",
      eventdate: "2029-01-22T16:28:32.615Z",
      start_time: "12:34:00",
      end_time: "01:32:00",
      in_person: true,
      curr_status: "Upcoming",
      all_day: false,
      tattoo: tattoos[2].id
    }
  ];
}

function makeExpectedTattoo(tattoos) {
  let tattoo = {
    id: tattoos.id,
    title: tattoos.title,
    position: tattoos.position,
    info: tattoos.info,
    curr_status: tattoos.curr_status,
    tattoo_rating: tattoos.tattoo_rating,
    client: tattoos.client
  };

  return tattoo;
}
function makeExpectedClient(client) {
  return {
    id: client.id,
    full_name: client.full_name,
    phone: client.phone,
    email: client.email,
    client_rating: client.client_rating,
    artist: client.artist
  };
}

function makeExpectedEvent(event) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    eventdate: event.eventdate.toLocaleString(),
    start_time: event.start_time,
    end_time: event.end_time,
    in_person: event.in_person,
    curr_status: event.curr_status,
    all_day: event.all_day,
    tattoo: event.tattoo
  };
}

function makeTattoosFixtures() {
  const testUsers = makeUsersArray();
  const testClients = makeClientsArray(testUsers);
  const testTattoos = makeTattoosArray(testClients);
  const testEvents = makeEventsArray(testTattoos);
  return { testUsers, testClients, testTattoos, testEvents };
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx
      .raw(
        `TRUNCATE
             tattoo_users,
             clients,
             tattoos,
             events
           `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE tattoo_users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE clients_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE tattoos_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE events_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('tattoo_users_id_seq', 0)`),
          trx.raw(`SELECT setval('clients_id_seq', 0)`),
          trx.raw(`SELECT setval('tattoos_id_seq', 0)`),
          trx.raw(`SELECT setval('events_id_seq', 0)`)
        ])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db
    .into("tattoo_users")
    .insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('tattoo_users_id_seq', ?)`, [
        users[users.length - 1].id
      ])
    );
}

function seedClients(db, users, clients) {
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into("clients").insert(clients);
    await trx.raw(`SELECT setval('clients_id_seq', ?)`, [
      clients[clients.length - 1].id
    ]);
  });
}

function seedTattoos(db, users, clients, tattoos) {
  return db.transaction(async trx => {
    await seedClients(trx, users, clients);
    await trx.into("tattoos").insert(tattoos);
    await trx.raw(`SELECT setval('tattoos_id_seq', ?)`, [
      tattoos[tattoos.length - 1].id
    ]);
  });
}

function seedEvents(db, users, clients, tattoos, events) {
  return db.transaction(async trx => {
    await seedTattoos(trx, users, clients, tattoos);
    await trx.into("events").insert(events);
    await trx.raw(`SELECT setval('events_id_seq', ?)`, [
      events[events.length - 1].id
    ]);
  });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ id: user.id }, secret, {
    subject: user.user_name,
    algorithm: "HS256"
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeTattoosFixtures,
  makeUsersArray,
  makeClientsArray,
  makeTattoosArray,
  makeEventsArray,
  cleanTables,
  makeAuthHeader,
  seedUsers,
  seedClients,
  seedTattoos,
  seedEvents,
  makeExpectedClient,
  makeExpectedTattoo,
  makeExpectedEvent
};
