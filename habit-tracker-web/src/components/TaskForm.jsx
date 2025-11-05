import { useState } from 'react'

function TaskForm( {addTask, onInputFocusChange} ){
    const [text, setText] = useState('')
    const [daily, setDaily] = useState(true)

    function submit(e) {
        e.preventDefault() // Prevents page reload on form submit
        const trimmed = text.trim()
        if (!trimmed) return // Don't add empty tasks

        const task = {
            id: Date.now(),
            text: trimmed,
            done: false,
            daily, //state set by the select input
        }

        addTask && addTask(task) //adds task only if the prop is provided
        setText('') // reset text input
        setDaily(true) // reset select input to daily
    }

    return (
        <form id = "task-form" onSubmit={submit}> 
            <input 
                id = "task-form input"
                value = {text}
                onChange = {e => setText(e.target.value)}
                placeholder = "Add a task..."
                onFocus = {() => onInputFocusChange && onInputFocusChange(true)} 
                onBlur = {() => onInputFocusChange && onInputFocusChange(false)}
            />
            <select
                id = "task-type"
                value= {daily ? 'daily' : 'one-time'}
                onChange= {e => setDaily(e.target.value === 'daily')}
            >
                <option value = "daily">Daily</option>
                <option value = "one-time">One-Time</option>
            </select>
            <button type = "submit">Add</button>
        </form>
    )
}

export default TaskForm