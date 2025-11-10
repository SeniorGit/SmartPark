
const { hashPasword } = require('../src/lib/utils/password');

exports.seed = async function(knex) {

  await knex('users').del();

  // Hash password
  const adminPassword = await hashPasword('Admin1234');
  const userPassword = await hashPasword('User1234');

  // Insert users
  await knex('users').insert([
    {
      id: '550e8400-e29b-41d4-a716-446655440000', 
      first_name: 'SmartPark',
      last_name: 'Admin',
      email: 'admin@smartpark.com',
      password: adminPassword,
      phone_number: '+628123456789',
      role: 'ADMIN',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001', 
      first_name: 'John',
      last_name: 'User',
      email: 'user@smartpark.com',
      password: userPassword,
      phone_number: '+628987654321',
      role: 'USER',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
};