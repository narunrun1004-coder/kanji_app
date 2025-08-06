// グローバル変数としてcanvas要素とその2D描画コンテキスト、描画状態を定義
// これらはDOMが読み込まれてからcanvas要素が利用可能になるため、
// setupCanvas()が呼び出される前（またはcanvas.jsの読み込み時）に取得します。
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let isDrawing = false; // 描画中かどうかを示すフラグ

function setupCanvas() {
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

  // 「けす」ボタンはHTMLのonclick属性でclearCanvas()関数を直接呼び出しているため、
  // ここでのイベントリスナー設定は不要です。
  // document.getElementById("clearBtn").onclick = () => {
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  // };
}

// キャンバスをクリアする関数（HTMLの「けす」ボタンから呼び出される）
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 注意: このファイルではDOMの読み込み完了を待たずにcanvasとctxを取得しています。
// スクリプトがHTMLのcanvas要素の前に配置されている場合は問題ありません。
// または、kakitori.js の中で DOMContentLoaded を使って setupCanvas() を呼び出すとより安全です。
