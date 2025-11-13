import { useEffect, useState } from "react"

import BlueDoggyComputerDown from '../../public/BlueDoggyComputerDown.png'
import BlueDoggyComputerUp from '../../public/BlueDoggyComputerUp.png'

function PomodoroTimer() {
    const [minutes, setMinutes] = useState(25)
    const [seconds, setSeconds] = useState(0)
   const [isActive, setIsActive] = useState(false)
   const [isWorkMode, setIsWorkMode] = useState(true)
   const [sessionsCompleted, setSessionsCompleted] = useState(0)
   const [isHeadUp, setIsHeadUp] = useState(false)

   useEffect(() => {
    let interval = null
    if(isActive && (minutes > 0 || seconds > 0)) {
        // run timer if active and time left
        interval = setInterval(() => {
            setIsHeadUp(prev => !prev)
            if(seconds === 0) { // if seconds hit 0, handle minutes
                if(minutes === 0){
                    setIsActive(false) // timer is done, stop it
                    if (isWorkMode) {
                        setSessionsCompleted(prev => prev + 1) // increment session counter by 1
                        setIsWorkMode(false) // switch to break mode
                        setMinutes(5) // set timer to break duration
                    } else {
                        // must have finished a break session
                        setIsWorkMode(true) //switch back to work mode
                        setMinutes(25) //set timer to work duration
                    }
                    setSeconds(0)
                } else {
                    // seconds hit 0 but minutes remain
                    setMinutes(minutes-1)
                    setSeconds(59)
                }
            } else {
                setSeconds(seconds-1)
            }
        }, 1000)
    }
    return () => clearInterval(interval) //Cleanup function: when the component unmounts or effect re-runs, clear the interval
   }, [isActive, minutes, seconds, isWorkMode])

const toggleTimer = () => setIsActive(!isActive)

const resetTimer = () => {
    setIsActive(false)
    setIsWorkMode(true)
    setMinutes(25)
    setSeconds(0)
}

const skipToBreak = () => {
    setIsActive(false)
    setIsWorkMode(false)
    setMinutes(5)
    setSeconds(0)
}

const skipToWork = () => {
    setIsActive(false)
    setIsWorkMode(true)
    setMinutes(25)
    setSeconds(0)
}

return (
    <div className="pomodoro-container">
        <div className="mode-indicator">
            {isWorkMode ? '🎯 Focus Time' : '☕ Break Time'}
        </div>

        <div className="sessions-counter">
            Sessions completed: {sessionsCompleted}
        </div>

        <div className="Computer-Screen">
            <img 
                src={isHeadUp ? BlueDoggyComputerUp : BlueDoggyComputerDown}
                className="Sprite-PC" 
            />

            <div className="timer-display">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

        </div>

        <div className="timer-controls">
            <button
                className="Pomodoro-Buttons" 
                onClick={toggleTimer}>{isActive ? 'Pause' : 'Start'}
            </button>

            <button
                className="Pomodoro-Buttons" 
                onClick={resetTimer}>Reset
            </button>

            {isWorkMode ? (
                <button
                    className="Pomodoro-Buttons" 
                    onClick={skipToBreak}> 
                    Skip to Break 
                </button>
            ) : (
                <button
                    className="Pomodoro-Buttons" 
                    onClick={skipToWork}> 
                    Skip to Work 
                </button> 
            )}
        </div>
    </div>
)
}

export default PomodoroTimer