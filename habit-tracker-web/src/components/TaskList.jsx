import TaskItem from './TaskItem'

function TaskList( { tasks, toggleTask, deleteTask } ){

    const dailyTasks = tasks.filter(t => t.daily)
    const regularTasks = tasks.filter(t => !t.daily)
    const allDailyDone = dailyTasks.length > 0 && dailyTasks.every(t => t.done)

    return (
        <div id = "scrollable-content">
            <ul id = "task-list">
                {dailyTasks.length > 0 && (
                    <>
                        <h3> Daily Tasks {allDailyDone &&  '🏆'}</h3>
                        {dailyTasks.map(task => (
                            <TaskItem
                                key = {task.id}
                                task = {task}
                                toggleTask = {toggleTask}
                                deleteTask = {deleteTask}
                            />
                        ))}
                    </>
                )}

                {regularTasks.length > 0 && (
                    <>
                        <h3> One-Time Tasks </h3>
                        {regularTasks.map(task => (
                            <TaskItem 
                                key = {task.id}
                                task = {task}
                                toggleTask = {toggleTask}
                                deleteTask = {deleteTask}
                            />
                        ))}
                    </>
                )}
            </ul>
        </div>
    )
}

export default TaskList