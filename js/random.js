let shuffled = [];
let currentIndex = 0;
let score = 0;

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function loadQuestion() {
  const data = shuffled[currentIndex];
  document.getElementById("currentCount").textContent = currentIndex + 1;
  document.getElementById("kanjiMask").textContent = "〇"; // 出題中は漢字本体を〇に
  document.getElementById("onReading").textContent = data.on; // 音読みはそのまま表示
  document.getElementById("kunReading").textContent = data.kun; // 訓読みはそのまま表示
  document.getElementById("reiText").textContent = data.rei.replace(data.kanji, "〇"); // 例文の漢字を〇に
  document.getElementById("svgArea").innerHTML = "";
  // clearCanvas() は canvas と ctx が初期化されている必要があるため、
  // setupCanvas() が呼び出された後に初めて呼ぶのが安全です。
  // ここでは canvas と ctx が初期化されている前提。
  clearCanvas(); // 新しい問題がロードされたときにキャンバスをクリア
}

function showAnswer() {
  const data = shuffled[currentIndex];
  document.getElementById("kanjiMask").textContent = data.kanji; // 回答後に漢字本体を表示
  document.getElementById("onReading").textContent = data.on; // 回答後に音読みを表示
  document.getElementById("kunReading").textContent = data.kun; // 回答後に訓読みを表示
  document.getElementById("reiText").textContent = data.rei; // 回答後に正しい例文を表示

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
        document.getElementById("svgArea").innerHTML = cleaned;
      })
      .catch(error => {
        document.getElementById("svgArea").textContent = "SVGファイルの読み込みに失敗しました。";
        console.error("SVGファイルの読み込みエラー:", error);
      });
  } else {
      document.getElementById("svgArea").textContent = "SVGファイル名が指定されていません。";
  }
}

function markAnswer(correct) {
  if (correct) score++;
  currentIndex++;
  if (currentIndex < 10) {
    loadQuestion();
  } else {
    document.getElementById("quizArea").style.display = "none";
    document.getElementById("resultArea").style.display = "block";
    document.getElementById("score").textContent = `正解数：${score} / 10`;
  }
}

// DOMContentLoadedイベントでHTML要素が完全に読み込まれてから処理を実行
document.addEventListener('DOMContentLoaded', (event) => {
  // kanjiList は kanji.js で定義されていると仮定
  if (typeof kanjiList === 'undefined' || !Array.isArray(kanjiList)) {
    console.error("kanjiListが定義されていないか、配列ではありません。kanji.jsの読み込みを確認してください。");
    // エラー表示などのFallback処理
    document.getElementById("kanjiMask").textContent = "エラー";
    return;
  }

  // 初期化処理
  shuffled = shuffleArray(kanjiList).slice(0, 10);
  // setupCanvas() を loadQuestion() の前に呼び出すことで、
  // loadQuestion() 内の clearCanvas() が機能するようにします。
  setupCanvas();
  loadQuestion();
});
