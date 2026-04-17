const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;

async function setupDatabase() {
  let connection;
  
  try {
    // Connect to MySQL without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    console.log('Connected to MySQL server');

    // Reset database (drop and recreate)
    console.log('Resetting database...');
    await connection.query(`DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\``);
    await connection.query(`CREATE DATABASE \`${process.env.DB_NAME}\``);
    await connection.query(`USE \`${process.env.DB_NAME}\``);
    console.log('✓ Database reset complete');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    console.log('Creating database and tables...');
    await connection.query(schema);
    console.log('✓ Database schema created successfully');

    // Read and execute seed data
    const seedPath = path.join(__dirname, 'seed.sql');
    const seed = await fs.readFile(seedPath, 'utf8');
    
    console.log('Seeding database with sample data...');
    await connection.query(seed);
    console.log('✓ Database seeded successfully');

    console.log('\n✓ Database setup complete!');
    console.log(`Database "${process.env.DB_NAME}" is ready to use.`);

  } catch (error) {
    console.error('Error setting up database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
