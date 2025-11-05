export function resetDailyTasks() {
  tasks.forEach(t => {
    if (t.daily) t.done = false;
  });
}

export function getLocalDateString(){
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function checkDailyStreak(tasks, lastCheckDate, streak) {

}

export function getSpriteEmotion(tasks, isInputFocused){
  const now = new Date()
  const hour = now.getHours()

  if(isInputFocused) {
    return "../public/BlueDoggyTHINKING1.1.png"
  }

  if(hour >= 23 || hour < 6) {
    return "../public/BlueDoggySLEEPY1.1.png"
  }

  if(tasks.length === 0){
    return "../public/BlueDoggyIDLE1.1.png"
  }

  const doneCount = tasks.filter(t => t.done).length

  if(doneCount === tasks.length){
    return "../public/BlueDoggyHAPPY1.1.png"
  }

  if(doneCount === 0){
    return "../public/BlueDoggySAD1.1.png"
  }

  return "/BlueDoggyIDLE1.1.png"   
}