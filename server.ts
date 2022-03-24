import { serve } from "https://deno.land/std@0.127.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.127.0/http/file_server.ts";
import { format } from "https://deno.land/std@0.127.0/datetime/mod.ts";
import { Todo } from "./todo.ts";

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

// ToDo の API は Todo クラスにまとめてある
const todo = new Todo();

console.log("Listening on http://localhost:8000");
serve((req) => {
    const url = new URL(req.url);
    const pathname = url.pathname;

    console.log("Request:", req.method, pathname);

    // /api/ で始まる場合、API サーバっぽく処理して返す
    if (pathname.startsWith("/api/")) {
        switch (pathname) {
            // case "/api/time":
            //     return apiTime(req);
            // case "/api/asmd": // addition, subtraction, multiplication, division の頭文字
            //     return apiFourArithmeticOperations(req);
            // case "/api/reverse":
            //     return apiReverse(req);
            case "/api/todo/list":
                return todo.apiList(req);
            case "/api/todo/add":
                return todo.apiAdd(req);
            case "/api/todo/delete":
                return todo.apiDelete(req);
            case "/api/database1":
                return apiDatabase1(req);
            case "/api/database2":
                return apiDatabase2(req);
            case "/api/database3":
                return apiDatabase3(req);
        }
    }

    // pathname に対応する static フォルダのファイルを返す（いわゆるファイルサーバ機能）
    // / → static/index.html
    // /hoge → static/hoge/index.html
    // /fuga.html → static/fuga.html
    // /img/piyo.jpg → static/img/piyo.jpg
    return serveDir(req, {
        fsRoot: "static",
        urlRoot: "",
        showDirListing: true,
        enableCors: true
    });
});

// // 従来の function を使った関数宣言
// // 現在の日時を返す API
// function apiTime(req: Request) {
//     return new Response(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
// }

// // アロー関数を使った関数宣言
// // クエリパラメータの x と y の四則演算の結果を JSON で返す API
// const apiFourArithmeticOperations = (req: Request) => {
//     const params = parseSearchParams(new URL(req.url));
//     const x = params.x;
//     const y = params.y;

//     let addition = 0;
//     let subtraction = 0;
//     let multiplication = 0;
//     let division = 0;
//     if (typeof x === "number" && typeof y === "number") {
//         addition = x + y;
//         subtraction = x - y;
//         multiplication = x * y;
//         division = x / y;
//     }
//     return createJsonResponse({ x, y, addition, subtraction, multiplication, division });
// }

// // URL のクエリパラメータをパースする
// const parseSearchParams = (url: URL) => {
//     const params: Record<string, string | number | boolean> = {};
//     for (const p of url.searchParams) {
//         const n = p[0], v = p[1];
//         if (v === "")
//             params[n] = true;
//         else if (v === "true")
//             params[n] = true;
//         else if (v === "false")
//             params[n] = false;
//         else if (!isNaN(Number(v)))
//             params[n] = +v;
//         else
//             params[n] = v;
//     }
//     return params;
// };

// JSON のレスポンスを生成する
const createJsonResponse = (obj: any) => new Response(JSON.stringify(obj), {
    headers: {
        "content-type": "application/json; charset=utf-8"
    }
});

// // クライアントから送られてきた JSON の message の文字列を反転して返す API
// // curl -X POST -d '{ "message": "hello" }' http://localhost:8000/api/reverse
// // → {"message":"olleh"}
// const apiReverse = async (req: Request) => {
//     const json = (await req.json()) as ApiReversePayload;
//     const message = json.message;
//     const reversedMessage = message.split("").reverse().join("");
//     return createJsonResponse({ message: reversedMessage });
// };

const apiDatabase1 = async (req: Request) => {
    const connection = await pool.connect();
    const result = await connection.queryObject`
                    SELECT from_name, SUM(money) as sum_money FROM fundraising
                    GROUP BY from_name
                    ORDER BY SUM(money) DESC
                    `;
    const numDonor = (result.rows).length;
    const fundraisingRanking : any[] = new Array(numDonor);
    // console.log(result.rows);
    for (let i=0; i<numDonor; i++){
        const element : any = result.rows[i];
        fundraisingRanking[i] = [element['from_name'], element['sum_money']];
    }
    // console.log(text);
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
    // console.log(result.rows);
    for (let i=0; i<numFacility; i++){
        const element : any = result.rows[i];
        facilityList[i] = [Number(element['to_id']), element['to_name'], element['sum_money']];
    }
    // console.log(facilityList);
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
    // console.log(result);
    const info : any = result.rows[0];
    const userInfo = [info['time'], Number(info['userid']).toLocaleString() , info['name'], info['type'], info['description']];
    console.log(userInfo);
    connection.release();

    return createJsonResponse({ message: userInfo });  
};

// type ApiReversePayload = {
//     message: string;
// };
