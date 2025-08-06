// URLからindex取得
const params = new URLSearchParams(window.location.search);
const index = parseInt(params.get("index") || "0");

// 該当漢字データを表示
const data = kanjiList[index];
document.getElementById("kanjiChar").textContent = data.kanji;
document.getElementById("onReading").textContent = data.on;
document.getElementById("kunReading").textContent = data.kun;
document.getElementById("rei").textContent = data.rei;

// SVG書き順読み込み
fetch(`svg/${data.kakijun}.svg`)
  .then(res => res.text())
  .then(svg => {
    const cleaned = svg.replace("]>", ""); // 表示崩れ対策
    document.getElementById("kakijunSvg").innerHTML = cleaned;
  })
  .catch(err => {
    document.getElementById("kakijunSvg").textContent = "SVGの読み込みに失敗しました。";
    console.error(err);
  });
