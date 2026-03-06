import { Pool } from "pg";

// PostgreSQL接続プール
// 環境変数からDB接続情報を取得する
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
