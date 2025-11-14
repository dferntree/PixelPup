import './App.css'
import { getSpriteEmotion, getLocalDateString, consecutiveDays, resetDailyTasks} from './utils/taskHelpers'
import SpriteDisplay from './components/SpriteDisplay';
import Header from './components/Header'
import TaskList from './components/TaskList'
import AIAdvisor from './components/AIAdvisor';
import { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import Auth from './components/Auth'
import { subscribeToAuthChanges, logoutUser} from './firebase';
import { getTasks, createTask as apiCreateTask, toggleTask as apiToggleTask, deleteTask as apiDeleteTask, getUserData, updateStreak, createUser } from './services/api'
import PomodoroTimer from './components/PomodoroTimer';


function App() {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [streak, setStreak] = useState(0)
  const [lastCheckDate, setLastCheckDate] = useState(null)
  const [studySessions, setStudySessions] = useState(0)
  

  const spriteSrc = getSpriteEmotion(tasks, isInputFocused)
  
  //listen for auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  //Load user data when user logs in 
  useEffect(() => {
    if(!user) return

    const loadUserData = async () => {
      try {
        //load user streak data from backend
        const userData = await getUserData(user.uid)
        setStreak(userData.streak || 0)
        setLastCheckDate(userData.lastCheckDate)
        setStudySessions(userData.studySessions || 0)

        //load user tasks from backend
        const userTasks = await getTasks(user.uid)
        setTasks(userTasks)
      } catch (error) {
        console.error('Error loading user data:', error.message)
        
        // If user doesn't exist in DB, create them
        if(error.message.includes('User not found') || error.message.includes('not been created yet')){
          console.log('Creating user record in DB...')
          try{
            await createUser(user.uid, user.email)
            console.log('User record created!')
            //retry loading data
            const userData = await getUserData(user.uid)
            setStreak(userData.streak || 0)
            setLastCheckDate(userData.lastCheckDate)
          } catch (createError) {
            console.error('Failed to create user:', createError)
          }
        }
      }
    }
    loadUserData()
  }, [user])
  
  useEffect(() => {
    if(!user || !lastCheckDate) return

    const todayStr = getLocalDateString()
    
    if(lastCheckDate === todayStr){
      return
    }
    const updateStreakData = async () => {

      let newStreak = 0
    
      if(consecutiveDays(lastCheckDate, todayStr)) {
        newStreak = streak + 1
        setTasks(resetDailyTasks)
      } else {
        newStreak = 0
        setTasks(resetDailyTasks)
      }
      setStreak(newStreak)
      setLastCheckDate(todayStr)

      //Update in DB
      await updateStreak(user.uid, newStreak, todayStr)
    }
    updateStreakData()
  }, [user, lastCheckDate])

  
  const toggleTask = async (id) => {
    //optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))

    try {
      const task = tasks.find(t => t.id === id)
      await apiToggleTask(id, !task.done)
    } catch (error) {
      console.error('Failed to toggle task:', error)
      // Revert on error
      setTasks(prev => prev.map(t => t.id === id ? {...t, done: !t.done} : t))
    }
  }

  const deleteTask = async (id) => { 
    //optimistic update
    setTasks(prev => prev.filter(t => t.id !== id))

    try {
      await apiDeleteTask(id)
    } catch (error) {
      console.error('Failed to delete tasks:', error)
    }
  }

  const addTask = async (task) => {
    // Optimistic Update with temp id
    const tempTask = {...task, id: Date.now()}
    setTasks(prev => [task, ...prev])

    try {
      const newTask = await apiCreateTask(user.uid, task.text, task.daily)
      // Replace temp task with real one from DB
      setTasks(prev => prev.map(t => t.id === tempTask.id ? newTask : t))
    } catch (error) {
      console.error('Failed to create task:', error)
      // Remove temp task on error
      setTasks(prev => prev.filter(t => t.id !== tempTask.id))
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      setTasks([])
      setStreak(0)
      setLastCheckDate(null)
      setStudySessions(0)    
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if(loading) {
    return <div className="loading">loading...</div>
  }

  // Show login if not authenticated
  if(!user) {
    return <Auth onAuthSuccess={() => {}} />
  }

  return (
    <div className = 'app'>
      
      <div className="top-header">
        <h1> PixelPup </h1>
      </div>

      <div className="wrapper">
        <div className="panel-card">
          <AIAdvisor
            tasks = {tasks}
           />
        </div>

        <div className="panel-card">
          
          <button onClick={handleLogout} className="logout-button">
              Logout
          </button>

          <div id = "top-section">
            <Header 
              streak = {streak}
            />
          </div>

            <SpriteDisplay spriteSrc = {spriteSrc}/>

            <TaskForm
              addTask = {addTask}
              onInputFocusChange = {setIsInputFocused}
            />
          
          <div className="scrollable-content">
            <TaskList
              tasks = {tasks}
              toggleTask = {toggleTask}
              deleteTask = {deleteTask}
            />
          </div>
        </div>

        <div className="panel-card"> 
          <PomodoroTimer
            userId={user.uid}
            initialSessions={studySessions}
            onSessionUpdate={setStudySessions}
          />
        </div>
        </div>      
    </div>
  );
}

export default App