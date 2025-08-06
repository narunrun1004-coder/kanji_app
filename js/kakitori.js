// URLからindex取得
const params = new URLSearchParams(window.location.search);
const index = parseInt(params.get("index") || "0");

// DOMContentLoadedイベントでHTML要素が完全に読み込まれてから処理を実行
document.addEventListener('DOMContentLoaded', (event) => {
  // 該当漢字データを表示
  // kanjiList は kanji.js で定義されていると仮定
  const data = kanjiList[index];
  document.getElementById("kanjiChar").textContent = data.kanji;
  document.getElementById("onReading").textContent = data.on;
  document.getElementById("kunReading").textContent = data.kun;
  document.getElementById("rei").textContent = data.rei;

  // SVG書き順読み込み
  fetch(`svg/${data.kakijun}.svg`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.text();
    })
    .then(svg => {
      const cleaned = svg.replace("]>", ""); // 表示崩れ対策
      document.getElementById("kakijunSvg").innerHTML = cleaned;
    })
    .catch(err => {
      document.getElementById("kakijunSvg").textContent = "SVGの読み込みに失敗しました。ファイルパスまたはデータを確認してください。";
      console.error(err);
    });

  // キャンバスのセットアップ関数を呼び出す
  setupCanvas();
});
