export function resetDailyTasks(tasks) {
  return tasks.map(t => t.daily ? {...t, done : false} : t)
}

export function parseLocalMidnight(dateStr){
  return new Date(dateStr + 'T00:00:00') //parses back to date obj
}

export function consecutiveDays(prevDate, currDate){
  const MS_PER_DAY = 24 * 60 * 60 * 1000

  const prev = parseLocalMidnight(prevDate)
  const curr = parseLocalMidnight(currDate)
  return Math.round((curr.getTime() - prev.getTime()) / MS_PER_DAY) === 1
}

export function getLocalDateString(){
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function getSpriteEmotion(tasks, isInputFocused){
  const now = new Date()
  const hour = now.getHours()

  if(isInputFocused) {
    return "/BlueDoggyTHINKING1.1.png"
  }

  if(hour >= 23 || hour < 6) {
    return "/BlueDoggySLEEPY1.1.png"
  }

  if(tasks.length === 0){
    return "/BlueDoggyIDLE1.1.png"
  }

  const doneCount = tasks.filter(t => t.done).length

  if(doneCount === tasks.length){
    return "/BlueDoggyHAPPY1.1.png"
  }

  if(doneCount === 0){
    return "/BlueDoggySAD1.1.png"
  }

  return "/BlueDoggyIDLE1.1.png"   
}