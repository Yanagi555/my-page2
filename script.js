let time = 25 * 60; // 最初は25分＝25＊60秒を示す
let timerId = null;
let workCount = 0;
let isWorking = true; // 作業中かどうか

function updateDisplay() {
  const min = String(Math.floor(time / 60)).padStart(2, '0');
  const sec = String(time % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${min}:${sec}`;
  
  const modeText = isWorking ? '作業中' : '休憩中';//True:False
  document.getElementById('mode').textContent = modeText;
}

function updateCountDisplay() {
  document.getElementById('count').textContent = `作業回数: ${workCount}`;
}

function startTimer() {
  if (timerId) return;//すでに起動しているときは何も反応せず

  timerId = setInterval(() => {
    if (time > 0) {
      time--;
      updateDisplay();
    } else {
      clearInterval(timerId);
      timerId = null;

      if (isWorking) {
        workCount++;
        updateCountDisplay();
        //alert('休憩しましょう！');//ここをコメントアウトしているため自動で変位する＝一回ごとに止めたい場合は消す
        time = 5 * 60; // 休憩5分
      } else {
        //alert('作業を再開しましょう！');//ここをコメントアウトしているため自動で変位する＝一回ごとに止めたい場合は消す
        time = 25 * 60; // 作業25分
      }

      isWorking = !isWorking; // 状態を切り替え（作業~休憩）True~False
      updateBackground();  //  ここで背景色変更
      updateDisplay();
      startTimer(); // 次のタイマーを自動開始
    }
  }, 1000);
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId); // タイマーstop
    timerId = null;         // 状態をリセット
  }
}

function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  isWorking = true;
  time = 25 * 60;
  updateDisplay();
  updateBackground();//休憩中にリセット押すと色が変わる
}

function updateBackground() {
  document.body.style.backgroundColor = isWorking ? '#fc7878' : '#478aff'; //作業：休憩(色：色)
  
}

function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (text === '') return;

  const li = document.createElement('li');

  // 完了時刻を表示 <span>（チェックボックスの左）
  const timeStamp = document.createElement('span');
  timeStamp.style.fontSize = '12px';
  timeStamp.style.color = '#555';
  timeStamp.style.width = '60px'; // 幅固定で整列しやすく
  timeStamp.textContent = ''; // 初期は空

  // チェックボックス
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  // タスクのテキスト
  const taskText = document.createElement('span');
  taskText.textContent = text;

  // 削除ボタン
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '✕';
  deleteBtn.style.marginLeft = 'auto';
  deleteBtn.style.background = 'transparent✕';
  deleteBtn.style.border = 'none';
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.style.fontSize = '18px';
  deleteBtn.style.color = '#888';

  deleteBtn.addEventListener('click', () => {
    li.remove();
  });

  // チェック時の処理
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      taskText.style.textDecoration = 'line-through';

      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      timeStamp.textContent = `完了 ${hh}:${mm}`;
    } else {
      taskText.style.textDecoration = 'none';
      timeStamp.textContent = '';
    }
  });

  // 要素を組み立て
  li.appendChild(timeStamp);   // 時刻を一番左に
  li.appendChild(checkbox);
  li.appendChild(taskText);
  li.appendChild(deleteBtn);

  document.getElementById('todoList').appendChild(li);
  input.value = '';
}


// 初期表示
updateDisplay();
updateCountDisplay();
