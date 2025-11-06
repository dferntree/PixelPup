const express = require('express')
const { db } = require('../db')
const { tasks } = require('../db/schema')
const { eq } = require('drizzle-orm')

const router = express.Router() // Express for API, Router is a modular route handler (routes in the router file are relative to where they're mounted)

//ROUTES: URL patterns that map HTTP requests to handler functions
// HTTP METHODS : GET, POST, PATCH, DELETE
/*
GET - Read/Retrieve Data
POST - Create new resource
PATH - Partially update existing resource
PUT  - Replace entire resource
DELETE - Remove resource
*/

// GET /api/tasks?userId = xxx
router.get('/', async (req, res) => { // (req, res) are handler function params, request contains data, response sends data back
    try {
        const {userId} = req.query //extracts query string params from URL

        const userTasks = await db.select()
            .from(tasks)
            .where(eq(tasks.userId, userId))

        res.json(userTasks) //send JSON response to client (Stringifies, sets header "Content-Type: application/json", sends JSON string over HTTP)
    } catch (error) {
        res.status(500).json({ error : error.message })
    }
})

//POST /api/tasks
router.post('/', async (req, res) => {
    try{
        const {userId, text, daily } = req.body // extracts data from request body (parsed by express.json() middleware)
        const [newTask] = await db.insert(tasks)
        .values({ userId, text, daily, done: false})
        .returning() //returns the new row back as an array
        //we can take the returned array in the frontend and directly add to our task array!

        res.status(201).json(newTask) //backend: converts newTask to JSON string
    } catch (error) {
        res.status(500).json({ error : error.message })
    }
})