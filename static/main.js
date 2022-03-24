import { fetchJSON, fetchText } from "./fetch.js";

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
    cellElem.appendChild(document.createTextNode(i+1));    // td要素にテキストを追加

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
    detail.innerHTML = '<a href="./detail.html">詳細を見る</a>'
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
    detail.innerHTML = `<a href="./detail.html?id=${facilityList[i][0].toLocaleString()}">詳細を見る</a>`
    cellElem.appendChild(detail);    // td要素に追加
  }
};

const displayDatabase3 = async (id) => {
  const data = await fetchJSON("/api/database3", {
    message: id,
  });
  // データベースの内容でテーブルを書き換える
  const userInfo = data.message;
  // console.log(userInfo);

  document.getElementById('time').innerHTML = userInfo[0];
  document.getElementById('name').innerHTML = userInfo[2];
  document.getElementById('type').innerHTML = userInfo[3];
  document.getElementById('description').innerHTML = userInfo[4];
  if (userInfo[3] === "donor") {
    document.getElementById('fund').innerHTML = '不可';
  } else if (userInfo[3] === "facility") {
    document.getElementById('fund').innerHTML = `可<br><a href="./payment.html?id=${userInfo[1].toLocaleString()}">募金画面へ</a>`;
  }
};


window.onload = (event) => {
  // console.log(window.location.href);
  const params = (new URL(document.location)).searchParams;
  if (window.location.href.match('facility.html') != null) {
    displayDatabase2();
  } else if (window.location.href.match('detail.html') != null) {
    const id = params.get('id');
    // window.alert(`ID=${id}`);
    displayDatabase3(id);
  } else if (window.location.href.endsWith('/') || window.location.href.match('index.html')){
    displayDatabase1();
  }
};
