const { drizzle } = require('drizzle-orm/postgres-js')
//Imports Drizzle's PostGres adapter

const postgres = require('postgres')
// Imports the postgres client library & connects to the PostgreSQL DB

require('dotenv').config()
//load environment variables from .env file, allows use to use process.env.DATABASE_URL

const connectionString = process.env.DATABASE_URL
// Get database URL from environment

const client = postgres(connectionString)
// Creates connection to PostgreSQL

const db = drizzle(client)
//Wraps PostgreSQL client with drizzle, so we can use db.select(), db.insert(), etc.

module.exports = { db }
// Exports db for other files to use

/*
Steps to connect Drizzle to postgres:

1. Import Drizzle, Postgres, and load env variables

2. Get DB url from env variables

3. Connect postgres to DB url

4. Wrap postgres in drizzle

*/