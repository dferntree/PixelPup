const { pgTable, serial, text, boolean,  integer, date } = require('drizzle-orm/pg-core');

const tasks = pgTable('tasks', {
    id : serial('id').primaryKey(),
    userId: text('user_id').notNull(), //firebase for later
    text: text('text').notNull(),
    done: boolean('done').default(false).notNull(),
    daily: boolean('daily').default(false).notNull(),
});

const streakData = pgTable('streak_data', {
    userId: text('user_id').primaryKey(),
    streak: integer('streak').default(0).notNull(),
    lastCheckDate: date('last_check_date'),
});

module.exports = { tasks, streakData }