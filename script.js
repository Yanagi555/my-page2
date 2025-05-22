let time = 25 * 60;
let timerId = null;
let workCount = 0;
let isWorking = true;
let stTimeM = 0;
let stTimeS = 0;
let stopInterval = null;

function updateDisplay() {
  const min = String(Math.floor(time / 60)).padStart(2, '0');
  const sec = String(time % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${min}:${sec}`;
  
  const modeText = isWorking ? '作業中' : '休憩中';
  document.getElementById('mode').textContent = modeText;
}

function updateCountDisplay() {
  document.getElementById('count').textContent = `作業回数: ${workCount}`;
}

function updateStopedTimer() {
  const min = String(stTimeM).padStart(2, '0');
  const sec = String(stTimeS).padStart(2, '0');
  document.getElementById('stopedT').textContent = `作業中止時間: ${min}:${sec}`;
}

function startTimer() {
  if (timerId) return;

  // ストップ時間のカウント停止
  if (stopInterval) {
    clearInterval(stopInterval);
    stopInterval = null;
  }

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
        time = 5 * 60; // 休憩
      } else {
        time = 25 * 60; // 作業
      }

      isWorking = !isWorking;
      updateBackground();
      updateDisplay();
      startTimer();
    }
  }, 1000);
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;

    // 停止中の経過時間をカウント
    if (!stopInterval) {
      stopInterval = setInterval(() => {
        stTimeS++;
        if (stTimeS === 60) {
          stTimeS = 0;
          stTimeM++;
        }
        updateStopedTimer();
      }, 1000);
    }
  }
}

function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  clearInterval(stopInterval);
  stopInterval = null;

  isWorking = true;
  time = 0.05 * 60;
  stTimeM = 0;
  stTimeS = 0;
  updateDisplay();
  updateBackground();
  updateStopedTimer();
}

function updateBackground() {
  document.body.style.backgroundColor = isWorking ? '#fc7878' : '#478aff';
}

function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (text === '') return;

  const li = document.createElement('li');

  const timeStamp = document.createElement('span');
  timeStamp.style.fontSize = '12px';
  timeStamp.style.color = '#555';
  timeStamp.style.width = '60px';
  timeStamp.textContent = '';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  const taskText = document.createElement('span');
  taskText.textContent = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '✕';
  deleteBtn.style.marginLeft = 'auto';
  deleteBtn.style.background = 'transparent';
  deleteBtn.style.border = 'none';
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.style.fontSize = '18px';
  deleteBtn.style.color = '#888';

  deleteBtn.addEventListener('click', () => {
    li.remove();
  });

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

  li.appendChild(timeStamp);
  li.appendChild(checkbox);
  li.appendChild(taskText);
  li.appendChild(deleteBtn);

  document.getElementById('todoList').appendChild(li);
  input.value = '';
}

// 初期表示
updateDisplay();
updateCountDisplay();
updateStopedTimer();
