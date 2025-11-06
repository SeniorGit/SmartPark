exports.up = function(knex) {
  return knex.schema.createTable('parking_slots', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('building_id').references('id').inTable('buildings').onDelete('CASCADE');
    table.integer('floor').notNullable(); 
    table.string('slot_number').notNullable(); 
    table.enu('status', ['AVAILABLE', 'OCCUPIED']).defaultTo('AVAILABLE');
    
    table.unique(['building_id', 'slot_number']); 

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};


exports.down = function(knex) {
    return knex.schema.dropTable('parking_slots')
};
