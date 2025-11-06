exports.up = function(knex) {
  return knex.schema.createTable('buildings', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable(); 
    table.text('address');
    table.integer('total_floors').defaultTo(1);

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};


exports.down = function(knex) {
    return knex.schema.dropTable('buildings')
};
