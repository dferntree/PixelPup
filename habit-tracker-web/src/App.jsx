import './App.css'
import { getSpriteEmotion, getLocalDateString, consecutiveDays, resetDailyTasks} from './utils/taskHelpers'
import SpriteDisplay from './components/SpriteDisplay';
import Header from './components/Header'
import TaskList from './components/TaskList'
import { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';


function App() {

  const [tasks, setTasks] = useState([])
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [streak, setStreak] = useState(0)
  const [lastCheckDate, setLastCheckDate] = useState(null)
  

  const spriteSrc = getSpriteEmotion(tasks, isInputFocused)


  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const deleteTask = (id) => { 
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const addTask = (task) => {
    setTasks(prev => [task, ...prev])
  }
  
  useEffect(() => {
    const todayStr = getLocalDateString()
    
    if(lastCheckDate === null){
      setLastCheckDate(todayStr)
      return
    }

    if(lastCheckDate === todayStr){
      return
    }

    if(consecutiveDays(lastCheckDate, todayStr)) {
      setStreak(s => s + 1)
      setTasks(resetDailyTasks)
    } else {
      setStreak(0)
      setTasks(resetDailyTasks)
    }
    setLastCheckDate(todayStr)
  })

  return (
    <div className = 'app'>
      <div id = "top-section">
        <Header 
          streak = {streak}
        />
      </div>
        <SpriteDisplay spriteSrc = {spriteSrc}/>
      <div>
        <TaskForm
          addTask = {addTask}
          onInputFocusChange = {setIsInputFocused}
        />
      </div>
      
      <div>
        <TaskList
          tasks = {tasks}
          toggleTask = {toggleTask}
          deleteTask = {deleteTask}
        />
      </div>      
    </div>
  );
}

export default App