
exports.up = function(knex) {
    return knex.raw("CREATE TYPE status_options AS ENUM ('New', 'Planning', 'Completed', 'In Progress')")
    .then(() => {
        return knex.schema.createTable('tattoos', function (table) {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.string('position');
            table.string('info');
            table.enu('curr_status', ['New', 'Planning', 'Completed', 'In Progress']).notNullable();
            table.integer('tattoo_rating');
            table.integer('client').references('id').inTable('clients').onDelete('SET NULL');
        });
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('tattoos')
    .then(() => {
        return knex.raw('DROP TYPE status_options');
    });
};
