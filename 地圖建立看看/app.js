// ========================
// 0) 地圖實際尺寸（你的圖片像素大小）
// ========================
const MAP_WIDTH = 2419;
const MAP_HEIGHT = 2419;

// ========================
// 1) 建立 Leaflet 地圖（虛擬座標系）
// ========================
const map = L.map("map", {
  crs: L.CRS.Simple,
  minZoom: -2,
  maxZoom: 2,
});

// === 編輯模式：關閉拖曳，才能點擊取座標（要拖曳就把這三行註解）===
map.dragging.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();


// ========================
// 側邊欄（點擊人員顯示說明）
// 需要 index.html 有：#sidebar、#sidebarClose、#sidebarContent
// 並在 style.css 內設定：body.sidebar-open #map { width: calc(100vw - 320px); }
// ========================
const sidebarEl = document.getElementById("sidebar");
const sidebarCloseBtn = document.getElementById("sidebarClose");
const sidebarContentEl = document.getElementById("sidebarContent");

function openSidebar(person) {
  if (!sidebarEl || !sidebarContentEl) return;

  sidebarContentEl.innerHTML = `
    <div class="sidebar-title">${person.name ?? "（未命名）"}</div>
    <div class="sidebar-text">${(person.desc ?? person.info ?? "").toString() || "（沒有說明）"}</div>
  `;

  sidebarEl.classList.remove("hidden");
  document.body.classList.add("sidebar-open");

  // 讓 Leaflet 在地圖尺寸變動後重新計算
  setTimeout(() => map.invalidateSize(), 80);
}

function closeSidebar() {
  if (!sidebarEl) return;
  sidebarEl.classList.add("hidden");
  document.body.classList.remove("sidebar-open");
  setTimeout(() => map.invalidateSize(), 80);
}

if (sidebarCloseBtn) {
  sidebarCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeSidebar();
  });
}

// ========================
// 2) 定義地圖邊界（以圖片像素當座標）
// ========================
const bounds = [[0, 0], [MAP_HEIGHT, MAP_WIDTH]];

// ========================
// 3) 圖層：底圖/地形（imageOverlay）
// ========================
const baseLayer = L.imageOverlay("maps/底層方格圖.png", bounds);
const riverLayer = L.imageOverlay("maps/河川.png", bounds);
const buildingLayer = L.imageOverlay("maps/鐵路.png", bounds);
const transpointLayer = L.imageOverlay("maps/轉運點.png", bounds);

// ✅ 人員 PNG（你要保留的圖層）
let unitImageLayer = L.imageOverlay("maps/人員.png", bounds);

// ✅ 人員 hover 熱區（透明，不顯示圓圈，只顯示 tooltip）
const peopleHitLayer = L.layerGroup();

// ✅ 把「人員PNG + hover熱區」包成一個群組，右上角只會顯示一個「人員」
const unitLayer = L.layerGroup([unitImageLayer, peopleHitLayer]);

// ========================
// 4) 預設顯示哪些底圖層
// ========================
baseLayer.addTo(map);
riverLayer.addTo(map);
buildingLayer.addTo(map);
transpointLayer.addTo(map);
unitLayer.addTo(map);

map.fitBounds(bounds);


// ========================
// 6) 點擊地圖輸出座標（到 Console）
// ========================
map.on("click", function (e) {
  const y = Math.round(e.latlng.lat);
  const x = Math.round(e.latlng.lng);
  console.log(`y: ${y}, x: ${x}`);
});


// ========================
// 7) 時間軸資料：每個時間點一組點（名字+座標）
// ========================
const timeline = {
  "258": [
	//臨時部隊T1
    {name: "T01-1歌川遼", y: 1984, x: 1229, info: "<b>職業<b>｜<br><b>移動<b>｜ 與前線T2會合<br><b>觸發配置<b>" },
    { name: "T01-2志岐小夜子", y: 1984, x: 1258, info: "<b>職業<b>｜T01-OP<br><br><b>移動<b>｜與前線T2會合<br><b>觸發配置<b>" },
    { name: "T01-3漆間恒", y: 1984, x: 1287, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T2會合<br><b>觸發配置<b>" },
    { name: "T01-4空閑遊真", y: 1984, x: 1316, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T2會合<br><b>觸發配置<b>" },
    { name: "T01-5巴虎太郎", y: 1984, x: 1345, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T2會合<br><b>觸發配置<b>" },
	//臨時部隊T2
    { name: "T02-1王子一彰", y: 1680, x: 1076, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "T02-2仁礼光", y: 1680, x: 1105, info: "<b>職業<b>｜T02-OP<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "T02-3辻新之助", y: 1680, x: 1134, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "T02-4生駒達人", y: 1680, x: 1163, info: "<b>職業<b>｜<br><b>移動<b>｜領取便當(0/10)<br><b>觸發配置<b>" },
    { name: "T02-5帯島ユカリ", y: 1680, x: 1192, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
	//臨時部隊T3
    { name: "T03-1柿崎国治", y: 1228, x: 1379, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "T03-2藤丸のの", y: 1228, x: 1408, info: "<b>職業<b>｜T03-OP<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "T03-3影浦雅人", y: 1228, x: 1437, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "T03-4別役太一", y: 1228, x: 1466, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "T03-5犬飼澄晴", y: 1228, x: 1495, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
	//臨時部隊T4
    { name: "T04-1北添尋", y: 772, x: 1530, info: "<b>職業<b>｜<<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "T04-2染井華", y: 772, x: 1559, info: "<b>職業<b>｜T04-OP<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "T04-3外岡一斗", y: 772, x: 1588, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "T04-4菊地原士郎", y: 772, x: 1617, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "T04-5南沢海", y: 772, x: 1646, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
	//臨時部隊T5
    { name: "T05-1来馬辰也", y: 320, x: 1832, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "T05-2小佐野瑠衣", y: 320, x: 1861, info: "<b>職業<b>｜T05-OP<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "T05-3穂刈篤", y: 320, x: 1890, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "T05-4小荒井登", y: 320, x: 1919, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "T05-5弓場拓磨", y: 320, x: 1948, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
	//臨時部隊T6
    { name: "T06-1古寺章平", y: 1984, x: 1682, info: "<b>職業<b>｜臨時部隊總指揮<br><b>移動<b>｜與前線T2會合<br><b>觸發配置<b>" },
    { name: "T06-2六田梨香", y: 1984, x: 1711, info: "<b>職業<b>｜T06-OP<br><b>移動<b>｜與前線T2會合<br><b>觸發配置<b>" },
    { name: "T06-3奥寺常幸", y: 1984, x: 1740, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T2會合<br><b>觸發配置<b>" },
    { name: "T06-4三浦雄太", y: 1984, x: 1769, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T2會合<br><b>觸發配置<b>" },
    { name: "T06-5木虎藍", y: 1984, x: 1798, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T2會合<br><b>觸發配置<b>" },
	//臨時部隊T7
    { name: "T07-1諏訪洸太郎", y: 1534, x: 1682, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T3會合<br><b>觸發配置<b>" },
    { name: "T07-2宇井真登華", y: 1534, x: 1711, info: "<b>職業<b>｜T07-OP<br><b>移動<b>｜T3<br><b>觸發配置<b>" },
    { name: "T07-3隠岐孝二", y: 1534, x: 1740, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T3會合<br><b>觸發配置<b>" },
    { name: "T07-4三雲修", y: 1534, x: 1769, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T3會合<br><b>觸發配置<b>" },
    { name: "T07-5香取葉子", y: 1534, x: 1798, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T3會合<br><b>觸發配置<b>" },
	//臨時部隊T8
    { name: "T08-1二宮匡貴", y: 1078, x: 1832, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T4會合<br><b>觸發配置<b>" },
    { name: "T08-2加賀美倫", y: 1078, x: 1861, info: "<b>職業<b>｜T08-OP<br><b>移動<b>｜與前線T4會合<br><b>觸發配置<b>" },
    { name: "T08-3東春秋", y: 1078, x: 1890, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T4會合<br><b>觸發配置<b>" },
    { name: "T08-4雨取千佳", y: 1078, x: 1919, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T4會合<br><b>觸發配置<b>" },
    { name: "T08-5絵馬ユズル", y: 1078, x: 1948, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T4會合<br><b>觸發配置<b>" },
	//臨時部隊T9
    { name: "T09-1水上敏志", y: 624, x: 1984, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T5會合<br><b>觸發配置<b>" },
    { name: "T09-2今結花", y: 624, x: 2013, info: "<b>職業<b>｜T09-OP<br><b>移動<b>｜與前線T5會合<br><b>觸發配置<b>" },
    { name: "T09-3荒船哲次", y: 624, x: 2042, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T5會合<br><b>觸發配置<b>" },
    { name: "T09-4樫尾由多加", y: 624, x: 2071, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T5會合<br><b>觸發配置<b>" },
    { name: "T09-5照屋文香", y: 624, x: 2100, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T5會合<br><b>觸發配置<b>" },
	//臨時部隊T10
    { name: "T10-1村上鋼", y: 1834, x: 1984, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T2會合<br><b>觸發配置<b>" },
    { name: "T10-2氷見亜季", y: 1834, x: 2013, info: "<b>職業<b>｜T10-OP<br><b>移動<b>｜與前線T2會合<br><b>觸發配置<b>" },
    { name: "T10-3堤大地", y: 1834, x: 2042, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T2會合<br><b>觸發配置<b>" },
    { name: "T10-4熊谷友子", y: 1834, x: 2071, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T2會合<br><b>觸發配置<b>" },
    { name: "T10-5蔵内和紀", y: 1834, x: 2100, info: "<b>職業<b>｜<br><b>移動<b>｜與前線T2會合<br><b>觸發配置<b>" },
	//臨時部隊T11
    { name: "T11-1若村麓郎", y: 2136, x: 2136, info: "<b>職業<b>｜<br><b>移動<b>｜與前線會合<br><b>觸發配置<b>" },
    { name: "T11-2細井真織", y: 2136, x: 2165, info: "<b>職業<b>｜T11-OP<br><b>移動<b>｜與前線會合<br><b>觸發配置<b>" },
    { name: "T11-3半崎義人", y: 2136, x: 2194, info: "<b>職業<b>｜<br><b>移動<b>｜與前線會合<br><b>觸發配置<b>" },
    { name: "T11-4笹森日佐人", y: 2136, x: 2223, info: "<b>職業<b>｜<br><b>移動<b>｜與前線會合<br><b>觸發配置<b>" },
    { name: "T11-5ヒュース", y: 2136, x: 2252, info: "<b>職業<b>｜<br><b>移動<b>｜與前線會合<br><b>觸發配置<b>" },
	//A01
    { name: "A01-1太刀川慶", y: 471, x: 1239, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A01-2國近柚宇", y: 471, x: 1268, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A01-3出水公平", y: 471, x: 1297, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A01-4唯我尊", y: 471, x: 1326, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
	//A02
    { name: "A02-1冬島慎次", y: 772, x: 804, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A02-2真木理佐", y: 772, x: 832, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A02-3当真勇", y: 772, x: 860, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
	//A03
    { name: "A03-1風間蒼也", y: 1078, x: 938, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A03-2三上歌歩", y: 1078, x: 968, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A03-3寺島雷蔵", y: 1078, x: 998, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A03-4Ｍ・クローニン", y: 1078, x: 1028, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
	//A04
    { name: "A04-1草壁早紀", y: 1530, x: 622, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A04-2佐伯竜司", y: 1530, x: 651, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A04-3里見一馬", y: 1530, x: 680, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A04-4緑川駿", y: 1530, x: 709, info: "<b>職業<b>｜<br><b>移動<b>｜｜<br><b>觸發配置<b>" },
    { name: "A04-5宇野隼人", y: 1530, x: 738, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
	//A05
    { name: "A05-1嵐山准", y: 1984, x: 470, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A05-2綾辻遥", y: 1984, x: 499, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A05-3時枝充", y: 1984, x: 528, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A05-4佐鳥賢", y: 1984, x: 557, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A05-5澤村響子", y: 1984, x: 586, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
	//A06
    { name: "A06-1加古望", y: 168, x: 788, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A06-2小早川杏", y: 168, x: 817, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A06-3黒江双葉", y: 168, x: 846, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A06-4喜多川真衣", y: 168, x: 875, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
 	//A07
    { name: "A07-1三輪秀次", y: 1228, x: 472, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A07-2月見蓮", y: 1228, x: 501, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A07-3米屋陽介", y: 1228, x: 530, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A07-4奈良坂透", y: 1228, x: 559, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A07-5林藤匠", y: 1228, x: 588, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
	//A08
    { name: "A08-1片桐隆明", y: 1680, x: 320, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A08-2結束夏凛", y: 1680, x: 320, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A08-3一条雪丸", y: 1680, x: 378, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A08-4桃園藤一郎", y: 1680, x: 407, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A08-5尼倉亜澄", y: 1680, x: 436, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
	//A09
    { name: "A08-1木崎レイジ", y: 622, x: 320, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A08-2林藤ゆうり", y: 622, x: 320, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A08-3小南桐絵", y: 622, x: 378, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A08-4烏丸京介", y: 622, x: 407, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },
    { name: "A08-5迅悠一", y: 622, x: 436, info: "<b>職業<b>｜<br><b>移動<b>｜<br><b>觸發配置<b>" },


  ],
  "259": [
    { name: "三輪秀次", y: 860, x: 1300 },
    { name: "奈良坂透", y: 520, x: 1000 },
  ],
  "260": [
    { name: "三輪秀次", y: 860, x: 1300 },
    { name: "奈良坂透", y: 520, x: 1000 },
  ],
};

// ========================
// 8) 不同時間對應不同「人員 PNG」檔案（可選）
//    如果你每個時間都有一張人員PNG，請在這裡填檔名
//    沒填的時間會使用預設 maps/人員.png
// ========================
const unitImageByTime = {
  // "258": "maps/人員_1.png",
  // "259": "maps/人員_1.png",
  // "260": "maps/人員_1.png",
};

// ========================
// 9) 產生 hover 熱區（透明）
// ========================
function renderPeopleHit(points) {
  peopleHitLayer.clearLayers();

  points.forEach(p => {
    const marker = L.circleMarker([p.y, p.x], {
      radius: 3,      // 命中範圍（看不見但很好 hover + 好點擊）
      opacity: 0,
      fillOpacity: 0,
      weight: 0,
      interactive: true
    })
      .addTo(peopleHitLayer)
      // 你說不需要狀態欄，所以 hover 只顯示名字
      .bindTooltip(`<b>${p.name}</b>`, {
        direction: "top",
        sticky: true,
        opacity: 0.95
      });

    // 點擊顯示右側欄
    marker.on("click", () => openSidebar(p));
  });
}


// ========================
// 10) 切換時間：
//     - 更新 hover 熱區點
//     - 若該時間有對應人員 PNG，就替換 imageOverlay
//     - （重點）unitLayer 仍然是同一個，右上角勾選狀態不會壞
// ========================
let currentTime = Object.keys(timeline)[0];

function swapUnitImageIfNeeded(t) {
  const url = unitImageByTime[t];
  if (!url) return;

  // 用新的 imageOverlay 取代舊的
  const newLayer = L.imageOverlay(url, bounds);

  // 如果 unitLayer 目前在地圖上，需要先移除舊的，換新的再加回去
  const unitLayerIsOn = map.hasLayer(unitLayer);

  if (unitLayerIsOn) map.removeLayer(unitLayer);

  unitLayer.removeLayer(unitImageLayer);
  unitImageLayer = newLayer;
  unitLayer.addLayer(unitImageLayer);

  if (unitLayerIsOn) map.addLayer(unitLayer);
}

function showTime(t) {
  currentTime = t;

  // 1) 更新 hover 點
  renderPeopleHit(timeline[t] || []);

  // 2) 若這個時間點有對應的人員 PNG，替換它
  swapUnitImageIfNeeded(t);
}

// 預設顯示第一個時間點
showTime(currentTime);

// ===== 圖表面板：收合控制 + 禁止點面板時拖曳地圖 =====
const chartPanel = document.getElementById("chartPanel");
const chartToggle = document.getElementById("chartToggle");

if (chartPanel) {
  // 點圖表面板不要拖曳地圖
  L.DomEvent.disableClickPropagation(chartPanel);
  L.DomEvent.disableScrollPropagation(chartPanel);
}

if (chartPanel && chartToggle) {
  chartToggle.addEventListener("click", () => {
    chartPanel.classList.toggle("collapsed");

    // 箭頭方向
    chartToggle.textContent = chartPanel.classList.contains("collapsed") ? "▲" : "▼";

    // 讓 Leaflet 重新計算（避免有時候面板影響互動）
    setTimeout(() => map.invalidateSize(), 50);
  });
}


// ========================
// 12) 圖表 PNG + 熱區（不更動你現有參數）
// click 熱區 -> 呼叫 showTime("258") 這種，切換人員熱區/人員PNG
// ========================
const chartImg = document.getElementById("chartImg");
const hotspotLayer = document.getElementById("hotspotLayer");
const chartTip = document.getElementById("chartTip");

// 你在這裡填「圖表 PNG 的原始像素座標」
// x,y,w,h 以 chart.png 的像素為準（不是地圖的像素）
// targetTime 對應你的 timeline key，例如 "258"
const HOTSPOTS_PX = [
  { id: "t258", label: "258", x: 40,  y: 120, w: 40, h: 40, targetTime: "258" },
  { id: "t259", label: "259", x: 120, y: 110, w: 40, h: 40, targetTime: "259" },
  { id: "t260", label: "260", x: 200, y: 105, w: 40, h: 40, targetTime: "260" },
];

// tooltip 顯示/隱藏
function showChartTip(text, clientX, clientY) {
  if (!chartTip || !chartPanel) return;
  chartTip.innerHTML = text;
  chartTip.classList.remove("hidden");

  const rect = chartPanel.getBoundingClientRect();
  chartTip.style.left = (clientX - rect.left + 10) + "px";
  chartTip.style.top = (clientY - rect.top + 10) + "px";
}

function hideChartTip() {
  if (!chartTip) return;
  chartTip.classList.add("hidden");
}

// 像素 -> 百分比（讓圖片縮放時熱區仍對齊）
function pxToPercent(px, py, pw, ph, imgW, imgH) {
  return {
    left: (px / imgW) * 100,
    top: (py / imgH) * 100,
    width: (pw / imgW) * 100,
    height: (ph / imgH) * 100,
  };
}

function buildChartHotspots() {
  if (!chartImg || !hotspotLayer) return;
  if (!chartImg.complete || !chartImg.naturalWidth || !chartImg.naturalHeight) return;

  hotspotLayer.innerHTML = "";

  const imgW = chartImg.naturalWidth;
  const imgH = chartImg.naturalHeight;

  HOTSPOTS_PX.forEach(h => {
    const p = pxToPercent(h.x, h.y, h.w, h.h, imgW, imgH);

    const el = document.createElement("div");
    el.className = "hotspot";
    el.style.left = p.left + "%";
    el.style.top = p.top + "%";
    el.style.width = p.width + "%";
    el.style.height = p.height + "%";

    // hover 顯示提示（你也可以改成顯示更多資訊）
    el.addEventListener("mouseenter", (ev) => showChartTip(`<b>${h.label}</b>`, ev.clientX, ev.clientY));
    el.addEventListener("mousemove",  (ev) => showChartTip(`<b>${h.label}</b>`, ev.clientX, ev.clientY));
    el.addEventListener("mouseleave", hideChartTip);

    // click 切換時間（這會觸發你的 showTime -> renderPeopleHit + swapUnitImageIfNeeded）
    el.addEventListener("click", () => {
      if (typeof showTime === "function" && h.targetTime) {
        showTime(h.targetTime);
        setTimeout(() => map.invalidateSize(), 50);
      }
    });

    hotspotLayer.appendChild(el);
  });
}

// 圖片載入後建立熱區
if (chartImg) {
  chartImg.addEventListener("load", buildChartHotspots);
}

// 視窗大小改變時也重建（避免面板縮放後對不齊）
window.addEventListener("resize", buildChartHotspots);

// 如果圖片早就載好了（快取），主動建一次
buildChartHotspots();
