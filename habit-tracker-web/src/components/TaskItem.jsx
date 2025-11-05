function TaskItem({ task, toggleTask, deleteTask }){
    return (
        <li id = "task-item">
            <input
                type = "checkbox"
                checked = {task.done}
                onChange = {() => toggleTask(task.id)}
            />
            <span>{task.text}</span>
            <button className = "task-list button"
                onClick = {() => deleteTask(task.id)}
                title = "Remove task"
            >
                ✕
            </button>
                
        </li>
    )
}

export default TaskItem