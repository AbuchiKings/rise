import 'core-js/stable';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
//import queries from '../queries/queries';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', () => {
  console.log('Error connecting to the database');
});

const users = `CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_DATE NOT NULL
);`;

const posts = `CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    body VARCHAR(300),
    userId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_DATE NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);`;

const comments = `CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY NOT NULL,
    userId INT NOT NULL,
    postId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_DATE NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
);`;

const logins = `CREATE TABLE IF NOT EXISTS logins (
  id SERIAL PRIMARY KEY NOT NULL,
  name TEXT UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_DATE NOT NULL
);`;

const indexes = [`CREATE INDEX IF NOT EXISTS idx_posts_userId ON posts (userId);`,
  `CREATE INDEX IF NOT EXISTS idx_comments_userId ON comments (userId);`]

const checkUsers = 'SELECT * FROM logins';


export async function init(): Promise<void> {
  try {
    await pool.query(logins);
    const { rowCount } = await pool.query(checkUsers);
    if (rowCount < 1) {
      const pass = process.env.PASS || 'qwerty';
      const hashedPassword = await bcrypt.hash(pass, 10);
      await pool.query(`INSERT INTO logins (abuchikings, ${hashedPassword});`)
    }
    await pool.query(users);
    await pool.query(posts);
    await pool.query(comments);
    let promises = indexes.map(idx => pool.query(idx));
    await Promise.all(promises);
    await pool.end();
    return;
  } catch (error) {
    console.log(error);
  }
};
