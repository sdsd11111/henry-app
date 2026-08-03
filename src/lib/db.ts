import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql.us.stackcp.com',
  port: parseInt(process.env.DB_PORT || '45127', 10),
  user: process.env.DB_USER || 'coach-154c',
  password: process.env.DB_PASS || 'XUxmvg/VtX>Z',
  database: process.env.DB_NAME || 'Portal-313931afac',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default pool;
