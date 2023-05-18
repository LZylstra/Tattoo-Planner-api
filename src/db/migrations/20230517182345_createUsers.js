
exports.up = function(knex) {
    return knex.schema.createTable('tattoo_users', function (table) {
        table.increments('id').primary();
        table.string('user_name').notNullable().unique();
        table.string('full_name').notNullable();
        table.string('password').notNullable();
    })
    .then(() => {
        return knex.schema.alterTable('clients', function (table) {
            table.integer('artist').references('id').inTable('tattoo_users').onDelete('SET NULL');
        });
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('clients', function (table) {
        table.dropColumn('artist');
    })
    .then(() => {
        return knex.schema.dropTable('tattoo_users');
    })
};
