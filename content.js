// 既にタイマーがあるなら作らない
if (!document.getElementById("twitter-timer")) {

  let timeLeft = 60;

  // タイマー表示
  const timer = document.createElement("div");
  timer.id = "twitter-timer";
  timer.innerText = `残り ${timeLeft} 秒`;
  document.body.appendChild(timer);

  const interval = setInterval(() => {
    timeLeft--;
    timer.innerText = `残り ${timeLeft} 秒`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      blockTwitter();
    }
  }, 1000);

  function blockTwitter() {
    const overlay = document.createElement("div");
    overlay.id = "twitter-block";
    overlay.innerHTML = `
      <div class="block-message">
        1分経過しました<br>
        Twitterは終了です
      </div>
    `;
    document.body.appendChild(overlay);
  }
}
