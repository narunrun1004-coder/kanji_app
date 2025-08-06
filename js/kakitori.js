// URLからindex取得
const params = new URLSearchParams(window.location.search);
const index = parseInt(params.get("index") || "0");

// DOMContentLoadedイベントでHTML要素が完全に読み込まれてから処理を実行
document.addEventListener('DOMContentLoaded', (event) => {
  // kanjiList は kanji.js で定義されていると仮定
  // 念のためkanjiListが存在するかチェック
  if (typeof kanjiList === 'undefined' || !Array.isArray(kanjiList)) {
    console.error("kanjiListが定義されていないか、配列ではありません。kanji.jsの読み込みを確認してください。");
    // エラー表示などのFallback処理
    document.getElementById("kanjiChar").textContent = "エラー";
    return;
  }

  // 該当漢字データを表示
  const data = kanjiList[index];
  if (!data) {
    console.error(`指定されたindex (${index}) の漢字データが見つかりません。`);
    document.getElementById("kanjiChar").textContent = "データなし";
    return;
  }

  document.getElementById("kanjiChar").textContent = data.kanji;
  document.getElementById("onReading").textContent = data.on;
  document.getElementById("kunReading").textContent = data.kun;
  document.getElementById("rei").textContent = data.rei;

  // SVG書き順読み込み
  // data.kakijun が undefined でないか確認する方が安全です
  if (data.kakijun) {
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
  } else {
    document.getElementById("kakijunSvg").textContent = "SVGファイル名が指定されていません。";
  }

  // キャンバスのセットアップ関数を呼び出す
  setupCanvas();
});
