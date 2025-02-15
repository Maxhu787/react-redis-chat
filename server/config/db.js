const { Pool } = require("pg");
require("dotenv").config();

// const pools = new Pool({
//   database: process.env.DBNAME,
//   host: process.env.DBHOST,
//   user: process.env.DBUSER,
//   port: process.env.DBPORT,
// });

// const pool = new Pool({
//   user: "hukaixiang",
//   host: "localhost",
//   port: 5432,
//   database: "tcsn",
// });

const pool = new Pool({
  // connectionString: process.env.DATABASE_URL,
  connectionString: "postgres://hukaixiang@localhost:5432/tcsn",
  // connectionString: "postgres://avnadmin:AVNS_DbZr0Dfh671WyJA1TuF@pg-2846de8b-g4o2.i.aivencloud.com:12988/defaultdb?sslmode=require"
});
module.exports = pool;
