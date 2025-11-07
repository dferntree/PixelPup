// Mount Routes

const express = require('express')
// imports express framework, creates a web server
const cors = require('cors')

// imports cors middleware, allows frontend to talk to backend.
// Browser Checks:
//  Frontend Origin: Port 5173
//  Backend Origin : Port 3001
// Backend adds CORS header to response:
//  'Access-Control-Allow-Origin: *'
// Essentially, allowing the request to succeed where it otherwise would have failed.

const tasksRouter = require('./routes/tasks')
// imports task routes
const userDataRouter = require('./routes/userData')
// imports user data routes

const app = express()
// creates instance of express
/*
Returns an object with methods like:
- app.use (adds middleware)
- app.get, app.post (Define Routes)
- app.listen (starts the server)
*/

app.use(cors())
// adds cors headers to every response
app.use(express.json())
// Parses the body of incoming JSON requests, converts string to obj

app.use('/api/tasks', tasksRouter) //route prefix
app.use('/api/userData', userDataRouter)
//Mounts routers, any route gets the prefix above

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
//Starts the HTTP server and listens for incoming requests on port 3001