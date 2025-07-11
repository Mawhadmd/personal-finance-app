import pool from "@/db/postgres";

export async function GET(request: Request) {
    const connection = await pool.connect()
}