import { serve } from "https://deno.land/std@0.127.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.127.0/http/file_server.ts";

import * as postgres from "https://deno.land/x/postgres@v0.14.2/mod.ts";

// Get the connection string from the environment variable "DATABASE_URL"
const databaseUrl = Deno.env.get("DATABASE_URL");


// Create a database pool with three connections that are lazily established
const pool = new postgres.Pool(databaseUrl, 3, true);

// Connect to the database
const connection = await pool.connect();
try {
  // Create the table
  await connection.queryObject`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL
    )
  `;
} finally {
  // Release the connection back into the pool
  connection.release();
}

console.log("Listening on http://localhost:8000");
serve((req) => {
    const url = new URL(req.url);
    const pathname = url.pathname;

    console.log("Request:", req.method, pathname);

    // /api/ で始まる場合、API サーバっぽく処理して返す
    if (pathname.startsWith("/api/")) {
        switch (pathname) {
            case "/api/database1":
                return apiDatabase1(req);
            case "/api/database2":
                return apiDatabase2(req);
            case "/api/database3":
                return apiDatabase3(req);
            case "/api/database4":
                return storeDatabase(req);
        }
    }

    // pathname に対応する static フォルダのファイルを返す（いわゆるファイルサーバ機能）
    return serveDir(req, {
        fsRoot: "static",
        urlRoot: "",
        showDirListing: true,
        enableCors: true
    });
});

// JSON のレスポンスを生成する
const createJsonResponse = (obj: any) => new Response(JSON.stringify(obj), {
    headers: {
        "content-type": "application/json; charset=utf-8"
    }
});


const apiDatabase1 = async (req: Request) => {
    const connection = await pool.connect();
    const result = await connection.queryObject`
                    SELECT from_name, from_id, SUM(money) as sum_money FROM fundraising
                    GROUP BY from_name, from_id
                    ORDER BY SUM(money) DESC
                    `;
    const numDonor = (result.rows).length;
    const fundraisingRanking : any[] = new Array(numDonor);
    // console.log(result.rows);
    for (let i=0; i<numDonor; i++){
        const element : any = result.rows[i];
        fundraisingRanking[i] = [element['from_name'], element['sum_money'], Number(element['from_id']).toLocaleString()];
    }
    connection.release();
    return createJsonResponse({ message: fundraisingRanking });  
};


const apiDatabase2 = async (req: Request) => {
    const connection = await pool.connect();
    const result = await connection.queryObject`
                    SELECT to_id, to_name, SUM(money) as sum_money FROM fundraising
                    GROUP BY to_id, to_name
                    ORDER BY to_id, to_name
                    `;
    const numFacility = (result.rows).length;
    const facilityList : any[] = new Array(numFacility);
    for (let i=0; i<numFacility; i++){
        const element : any = result.rows[i];
        facilityList[i] = [Number(element['to_id']).toLocaleString(), element['to_name'], element['sum_money']];
    }
    connection.release();
    return createJsonResponse({ message: facilityList });  
};

const apiDatabase3 = async (req: Request) => {
    const json = (await req.json());
    const id = json.message;
    console.log(id);

    // Connect to the database
    const connection = await pool.connect();
    const result = await connection.queryObject`
                    SELECT * FROM user_data
                    WHERE userid=${id}
                    `;
    const info : any = result.rows[0];
    const userInfo = [info['time'], Number(info['userid']).toLocaleString() , info['name'], info['type'], info['description']];
    console.log(userInfo);
    connection.release();

    return createJsonResponse({ message: userInfo });  
};

const storeDatabase = async (req: Request) => {
    const json = (await req.json());
    const id = json.message;

    // Connect to the database
    const connection = await pool.connect();
    const result = await connection.queryObject`
                    INSERT INTO fundraising(from_id, from_name, money, to_id, to_name)
                    VALUES (1, 'azumaru', 50, 4, 'jig');
                    `;
    const status = '1';
    connection.release();

    return createJsonResponse({ message: status});  
};
