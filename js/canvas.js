// グローバル変数としてisDrawingのみを定義
let isDrawing = false; // 描画中かどうかを示すフラグ

// canvasとctxの取得はsetupCanvas関数内で行う
let canvas;
let ctx;

function setupCanvas() {
  // DOMContentLoadedが発火した後に要素を取得することを保証
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  // 初期化設定
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";

  // マウスイベントリスナー
  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    ctx.beginPath(); // 新しいパスを開始
    ctx.moveTo(e.offsetX, e.offsetY); // 開始点を設定
  });
  canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
      ctx.lineTo(e.offsetX, e.offsetY); // 現在の点まで線を引く
      ctx.stroke(); // 線を描画
    }
  });
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mouseleave', () => isDrawing = false);

  // タッチイベントリスナー（スマホ対応）
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // デフォルトのタッチ動作（スクロールなど）を防止
    const t = e.touches[0]; // 最初のタッチポイントを取得
    const r = canvas.getBoundingClientRect(); // キャンバスの位置とサイズを取得
    ctx.beginPath();
    ctx.moveTo(t.clientX - r.left, t.clientY - r.top); // キャンバス内の相対座標を開始点に設定
    isDrawing = true;
  });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // デフォルトのタッチ動作を防止
    if (!isDrawing) return;
    const t = e.touches[0];
    const r = canvas.getBoundingClientRect();
    ctx.lineTo(t.clientX - r.left, t.clientY - r.top); // キャンバス内の相対座標まで線を引く
    ctx.stroke();
  });

  canvas.addEventListener('touchend', () => isDrawing = false);
  canvas.addEventListener('touchcancel', () => isDrawing = false); // タッチがキャンセルされた場合
}

// キャンバスをクリアする関数（HTMLの「けす」ボタンから呼び出される）
function clearCanvas() {
  // canvasとctxがsetupCanvasで正しく初期化されていることを前提とする
  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    console.warn("CanvasまたはContextが初期化されていません。");
  }
}
