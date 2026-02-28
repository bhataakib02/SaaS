const { Client } = require('pg');
const url = "postgresql://postgres.yxrsmzanqekdttzmphlz:B%21%40ckB1rD%40%24%2685@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function test() {
    const client = new Client({ connectionString: url });
    try {
        console.log("Connecting to:", url);
        await client.connect();
        console.log("Connected successfully!");
        const res = await client.query('SELECT NOW()');
        console.log("Query result:", res.rows[0]);
        await client.end();
    } catch (err) {
        console.error("Connection failed:", err);
    }
}

test();
