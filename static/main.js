import { fetchJSON, fetchText } from "./fetch.js";

// timeButton.onclick = async () => {
//   // 現在の日時を返す API にアクセスする
//   // サーバからのレスポンスはただのテキスト形式
//   const data = await fetchText("/api/time");
//   console.log(data);

//   // アラートで表示
//   alert(data);
// };

// asmdButton.onclick = async () => {
//   // 四則演算の API にアクセスする
//   // クエリパラメータで使ってパラメータを送る
//   // サーバからのレスポンスは JSON 形式
//   const url = `/api/asmd?x=${xNumber.value}&y=${yNumber.value}`;
//   const data = await fetchJSON(url);
//   console.log(data);

//   // 計算結果の JSON を DOM 操作して画面に表示する
//   const x = data.x;
//   const y = data.y;
//   asmdResult.innerText = `${x} + ${y} = ${data.addition}
//         ${x} - ${y} = ${data.subtraction}
//         ${x} * ${y} = ${data.multiplication}
//         ${x} / ${y} = ${data.division}`;
// };

// reverseButton.onclick = async () => {
//   // 文字列を反転する API にアクセスする
//   // JSON 形式のパラメータを送る
//   // サーバからのレスポンスも JSON 形式
//   const data = await fetchJSON("/api/reverse", {
//     message: reverseInput.value,
//   });
//   console.log(data);

//   // 反転した文字列でテキストボックスを書き換える
//   reverseInput.value = data.message;
// };

// todoAddButton.onclick = async () => {
//   // ToDo を登録する API にアクセスする
//   // JSON 形式のパラメータを送る
//   // サーバからのレスポンスはテキスト形式
//   const data = await fetchText("/api/todo/add", { todo: todoInput.value });
//   console.log(data);

//   // 最新の ToDo の一覧を表示する
//   displayTodoList();
// };

// const displayTodoList = async () => {
//   // サーバに保存されている ToDo の一覧を取得する API にアクセスする
//   // サーバからのレスポンスは JSON 形式（ルートが配列）
//   const data = await fetchJSON("/api/todo/list");
//   console.log(data);

//   // ul タグの li を入れ替えて ToDo を表示する
//   todoList.innerHTML = "";
//   data.forEach((todo) => {
//     const li = document.createElement("li");
//     li.textContent = todo;
//     todoList.appendChild(li);
//   });
// };

const displayDatabase1 = async () => {
  const data = await fetchJSON("/api/database1", {
    message: 0,
  });

  // データベースの内容でテーブルを書き換える
  const fundraisingRanking = data.message;
  console.log(fundraisingRanking);

  // table要素を取得
  const tableElem = document.getElementById('targetTable');

  for (let i=0; i<fundraisingRanking.length; i++) {
    // tbody要素にtr要素（行）を最後に追加
    const trElem = tableElem.tBodies[0].insertRow(-1);

    let cellElem = trElem.insertCell(0);    // td要素を追加
    cellElem.appendChild(document.createTextNode(i));    // td要素にテキストを追加

    cellElem = trElem.insertCell(1);    // td要素を追加
    cellElem.appendChild(document.createTextNode(fundraisingRanking[i][0]));    // td要素にテキストを追加


    cellElem = trElem.insertCell(2);    // td要素を追加
    const d = document.createElement('div');
    d.classList.add('text-right');
    const money = Number(fundraisingRanking[i][1]).toLocaleString();
    d.innerHTML = '¥' + money;
    cellElem.appendChild(d);    // td要素にテキストを追加

    cellElem = trElem.insertCell(3);    // td要素を追加
    const detail = document.createElement('div');
    detail.innerHTML = '<a href="./payment.html">詳細を見る</a>'
    cellElem.appendChild(detail);    // td要素に追加
  }
};


const displayDatabase2 = async () => {
  const data = await fetchJSON("/api/database2", {
    message: 0,
  });

  // データベースの内容でテーブルを書き換える
  const facilityList = data.message;

  // table要素を取得
  const tableElem = document.getElementById('targetTable');

  for (let i=0; i<facilityList.length; i++) {
    // tbody要素にtr要素（行）を最後に追加
    const trElem = tableElem.tBodies[0].insertRow(-1);

    let cellElem = trElem.insertCell(0);    // td要素を追加
    cellElem.appendChild(document.createTextNode(facilityList[i][0].toLocaleString()));    // td要素にテキストを追加

    cellElem = trElem.insertCell(1);    // td要素を追加
    cellElem.appendChild(document.createTextNode(facilityList[i][1]));    // td要素にテキストを追加


    cellElem = trElem.insertCell(2);    // td要素を追加
    const d = document.createElement('div');
    d.classList.add('text-right');
    const money = Number(facilityList[i][2]).toLocaleString();
    d.innerHTML = '¥' + money;
    cellElem.appendChild(d);    // td要素にテキストを追加

    cellElem = trElem.insertCell(3);    // td要素を追加
    const detail = document.createElement('div');
    detail.innerHTML = '<a href="./payment.html">詳細を見る</a>'
    cellElem.appendChild(detail);    // td要素に追加
  }
};

window.onload = (event) => {
  // console.log(window.location.href);
  if (window.location.href.endsWith('facility.html')) {
    displayDatabase2();
  } else {
    displayDatabase1();
  }
};
