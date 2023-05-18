exports.up = function(knex) {
    return knex.raw("CREATE TYPE tattoo_status AS ENUM ('New', 'Upcoming', 'Next', 'Completed')")
        .then(() => {
            return knex.schema.createTable('events', function (table) {
                table.increments('id').primary();
                table.string('title').notNullable();
                table.string('description');
                table.timestamp('eventDate').notNullable();
                table.time('start_time');
                table.time('end_time');
                table.boolean('in_person');
                table.enu('curr_status', ['New', 'Upcoming', 'Next', 'Completed']).notNullable();
                table.boolean('all_day');
                table.integer('tattoo').references('id').inTable('tattoos').onDelete('SET NULL');
            });
        });
};

exports.down = function(knex) {
    return knex.schema.dropTable('events')
        .then(() => {
            return knex.raw('DROP TYPE tattoo_status');
        });
};