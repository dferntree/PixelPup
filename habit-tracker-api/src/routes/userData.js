const express = require('express')
const { db } = require('../db')
const { userData } = require('../db/schema')
const { tasks } = require('../db/schema')
const { eq } = require('drizzle-orm')

/*
USER DATA ROUTES
Purpose: Manage user progress data (streak, lastCheckDate, email)
Data comes from Firebase Auth (userId = Firebase UID)
*/

const router = express.Router()

// GET ROUTE : Called whenever user opens app to load data
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query
        
        if(!userId) {
            return res.status(400).json({ //Bad request, invalid data
                error: 'userId query param is required'
            })
        }

        const [userDataRecord] = await db.select()
            .from(userData)
            .where(eq(userData.userId, userId))

        if(!userDataRecord) {
            return res.status(404).json({ //Not found, resource doesn't exist
                error: 'User not found',
                message: 'This user has not been created yet. Call POST /api/userData first.'
            })
        }

        res.json(userDataRecord)
    } catch (error) {
        console.error('GET /api/userData error:' , error)
        res.status(500).json({ error: error.message })
    }
})

//POST ROUTE: Create new user when they first sign up with firebase

router.post('/', async (req, res) => {
    try {
        const { userId, email, lastCheckDate } = req.body
        
        if(!userId || !email){
            return res.status(400).json({
                error: 'userId and email are required'
            })
        }
        //Checks if user already exists
        const [existing] = await db.select()
            .from(userData)
            .where(eq(userData.userId, userId))
        
        if(existing) {
            return res.status(409).json({ //Conflict, resource already exists
                error: 'User already exists',
                data: existing
            })
        }

        const [newUser] = await db.insert(userData)
            .values({
                userId,
                email,
                streak: 0,
                lastCheckDate: lastCheckDate || new Date().toISOString().split('T')[0],
                studySessions: 0
            })
            .returning() //without returning, newUser gives back db metadata

        res.status(201).json(newUser) //send back the created user

    } catch (error) {
        console.error('POST /api/user/userData error:', error)
        res.status(500).json({ error: error.message })
    }
})

// PATCH ROUTE: Update user's streak and lastCheckDate

router.patch('/:userId', async (req, res) => {
    try {
        const { userId } = req.params

        const { streak, lastCheckDate, studySessions } = req.body

        const updates = {}
        if (streak !== undefined) updates.streak = streak
        if(lastCheckDate !== undefined) updates.lastCheckDate = lastCheckDate
        if(studySessions !== undefined) updates.studySessions = studySessions

        if(Object.keys(updates).length === 0){
            return res.status(400).json({
                error: 'No fields to update',
                message: 'Provide at least one of: streak, lastCheckDate, studySessions'
            })
        }

        const [updated] = await db.update(userData)
            .set(updates)  //Sets streak and last check date to 
            .where(eq(userData.userId, userId))
            .returning() //returns updated user as an array, updated destructures into plain object
        
        if (!updated) {
            return res.status(404).json({
                error: 'User not found',
                message: `No user with userId: ${userId}`
            })
        }

        res.json(updated)

    } catch (error){
        console.error('PATCH /api/userData/:userId error:', error)
        res.status(500).json({ error: error.message })
    }
})

//DELETE ROUTE: If user wants to delete their account

router.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params

        //delete user from database
        await db.delete(userData)
            .where(eq(userData.userId, userId))

        await db.delete(tasks)
            .where(eq(tasks.userId, userId))

        return res.json({
            success: true,
            message: 'User deleted successfully'
        })
    } catch (error) {
        console.error('DELETE /api/userData/:userId error:', error)
        res.status(500).json({ error: error.message })
    }
})

module.exports = router