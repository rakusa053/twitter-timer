// ストレージから状態を取得して初期化
chrome.storage.local.get(['stock', 'lastDate'], (result) => {
  const today = new Date().toLocaleDateString();
  let stock = result.stock;

  // 新しい日ならストックを10にリセット
  if (result.lastDate !== today) {
    stock = 10;
    chrome.storage.local.set({ stock: stock, lastDate: today });
  }

  if (stock <= 0) {
    blockTwitter(true); // ストック切れ
    return;
  }

  startTimer(stock);
});

function startTimer(currentStock) {
  if (document.getElementById("twitter-timer")) return;

  let timeLeft = 60;

  // タイマー表示
  const container = document.createElement("div");
  container.id = "twitter-timer-container";
  container.innerHTML = `
    <div id="twitter-timer">残り ${timeLeft} 秒</div>
    <div id="twitter-stock">残りストック: ${currentStock} 回</div>
  `;
  document.body.appendChild(container);

  const timerElement = document.getElementById("twitter-timer");

  const interval = setInterval(() => {
    timeLeft--;
    timerElement.innerText = `残り ${timeLeft} 秒`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      decrementStock();
    }
  }, 1000);
}

function decrementStock() {
  chrome.storage.local.get(['stock'], (result) => {
    const newStock = Math.max(0, (result.stock || 10) - 1);
    chrome.storage.local.set({ stock: newStock }, () => {
      blockTwitter(false); // 通常の終了
    });
  });
}

function blockTwitter(isOutOfStock) {
  if (document.getElementById("twitter-block")) return;

  const overlay = document.createElement("div");
  overlay.id = "twitter-block";
  
  const message = isOutOfStock 
    ? "今日のストックがなくなりました<br>また明日お会いしましょう 💤"
    : "1分経過しました<br>Twitterは終了です";

  overlay.innerHTML = `
    <div class="block-message">
      ${isOutOfStock ? "🚫" : "⏰"} ${message}
    </div>
  `;
  document.body.appendChild(overlay);
}

