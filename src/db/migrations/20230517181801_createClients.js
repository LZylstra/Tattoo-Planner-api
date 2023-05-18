
exports.up = function(knex) {
    return knex.schema.createTable("clients", (table) => {
        table.increments("client_id").primary(); 
        table.string('full_name').notNullable();
        table.string('phone');
        table.string('email');
        table.integer('client_rating');
        table.timestamps(true, true); // Adds created_at and updated_at columns
      });
  
};

exports.down = function(knex) {
    return knex.schema.dropTable("clients");
};
