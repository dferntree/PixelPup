function allDailyTasksDone() {
  return tasks.filter(t => t.daily).every(t => t.done);
}

function resetDailyTasks() {
  tasks.forEach(t => {
    if (t.daily) t.done = false;
  });
}

function getLocalDateString(){
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function checkDailyStreak() {
  const todayStr = getLocalDateString();
  if (lastCheckDate !== todayStr) {
    if (lastCheckDate !== null) {
      if (!allDailyTasksDone()) streak = 0;
      else streak++;
    }
    resetDailyTasks();
    lastCheckDate = todayStr;
    saveTasks();
  }
}

function getEmotion(){
    
}