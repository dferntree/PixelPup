const API_BASE = 'http://localhost:3001'

// HOW FETCH API WORKS
// PARAM 1: Where to send the request
// PARAM 2: How to send the request (optional)

// METADATA : Data about data (describes the body format)

// USER DATA API

export const createUser = async (userId, email) => { 
    const response = await fetch(`${API_BASE}/api/userData`, { 
        method: 'POST', // HTTP REQ
        headers: {'Content-Type': 'application/json'}, // Metadata about the request (body is JSON)
        body: JSON.stringify({ userId, email }) //data to send
    })
    if (!response.ok) throw new Error('Failed to create user') //checks if HTTP status is 200-299 (success)
    return response.json() //parses the reponse body from JSON string to JS object
}

export const getUserData = async (userId) => {
    const response = await fetch(`${API_BASE}/api/userData?userId=${userId}`) //adds query param to pass to the backend
    //No second param, defaults to GET request
    if(!response.ok) throw new Error('Failed to fetch user data')
    return response.json()
}

export const updateStreak = async (userId, streak, lastCheckDate) => {
    const response = await fetch(`${API_BASE}/api/userData/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({ streak, lastCheckDate }) // HTTP can only send TEXT, so we have to convert object to strings
    })
    if (!response.ok) throw new Error('Failed to update streak')
    return response.json()
}

// TASKS API

export const getTasks = async (userId) => {
    const response = await fetch(`${API_BASE}/api/tasks?userId=${userId}`)
    if (!response.ok) throw new Error('Failed to fetch tasks')
    return response.json()
}

export const createTask = async (userId, text, daily) => {
    const response = await fetch(`${API_BASE}/api/tasks`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ userId, text, daily })
    })
    if(!response.ok) throw new Error('Failed to create task')
    return response.json()
}

export const toggleTask = async (taskId, done) => {
    const response = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ done })
    })
    if(!response.ok) throw new Error('Failed to toggle task')
    return response.json()
}

export const deleteTask = async (taskId) => {
    const response = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
        method: 'DELETE'
    })
    if(!response.ok) throw new Error('Failed to delete task')
    return response.json()
}