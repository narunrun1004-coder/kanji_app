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
  clearCanvas();
}

function showAnswer() {
  const data = shuffled[currentIndex];
  document.getElementById("kanjiMask").textContent = data.kanji; // 回答後に漢字本体を表示
  document.getElementById("onReading").textContent = data.on; // 回答後に音読みを表示
  document.getElementById("kunReading").textContent = data.kun; // 回答後に訓読みを表示
  document.getElementById("reiText").textContent = data.rei; // 回答後に正しい例文を表示

  fetch(`svg/${data.kakijun}.svg`)
    .then(res => res.text())
    .then(svg => {
      document.getElementById("svgArea").innerHTML = svg.replace("]>", "");
    });
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

// 初期化
shuffled = shuffleArray(kanjiList).slice(0, 10);
loadQuestion();