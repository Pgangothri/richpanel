// Import necessary modules
const express = require('express');
const router = express.Router();
const knex = require('./knex'); // Assuming 'knex.js' initializes Knex and exports the Knex instance

// Route to fetch all conversations
router.get('/conversations', async (req, res) => {
    try {
        // Fetch conversations data from the database
        const conversations = await knex.select('name', 'last_active', 'message').from('conver');

        // Send the conversations data as JSON response
        res.json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        // Send an error response if there's an issue with fetching conversations
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export the router
module.exports = router;
