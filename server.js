const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const conversationsRouter = require('./conversationrouter');

// Knex configuration
const knex = require('knex')({
  client: 'postgresql',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'Surya@2009', // Replace with your actual password
    database: 'fb' // Replace with your actual database name
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Registration route
app.get('/register', (req, res) => {
  res.render('register');
});

// Route for user registration
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate request data
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email, and password' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    await knex('users').insert({ name, email, password: hashedPassword });

    // Respond with success message
    res.redirect('/login?message=Registration%20successful');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering user' });
  }
});

// Login route
app.get('/login', (req, res) => {
  const message = req.query.message;
  res.render('login', { message });
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Query the database for user credentials
    const user = await knex('users').where('email', email).first();
    if (!user) {
      return res.send('Invalid email or password');
    }
    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.send('Invalid email or password');
    }
    // Store user data in session
    req.session.user = user;
    res.redirect('/manage-fb-page');
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Internal server error');
  }
});

// FB Page management route
app.get('/manage-fb-page', async (req, res) => {
  const user = req.session.user;
  // Check if the user is logged in
  if (!user) {
    res.redirect('/login');
  } else {
    try {
      // Check if a connection to a FB page exists in the database
      const fbPageConnection = await knex('fb_page_connections').where('user_id', user.id).first();
      res.render('manage-fb-page', { user, fbPageConnection });
    } catch (error) {
      console.error('Error fetching FB page connection:', error);
      res.status(500).send('Internal server error');
    }
  }
});

// Route for creating FB page connection
// Route for creating FB page connection
app.post('/connect-fb-page', async (req, res) => {
  const user = req.session.user;
  if (!user) {
      return res.redirect('/login');
  }

  const pageId = req.body.pageId;
  const accessToken = req.body.accessToken; // Assuming you receive the access token from the request

  // Check if the access token is provided
  if (!accessToken) {
      return res.status(400).send('Access token is required');
  }

  try {
      // Save the FB page connection to the database
      await knex('fb_page_connections').insert({ user_id: user.id, page_id: pageId, access_token: accessToken });
      res.send('Facebook page connected successfully');
  } catch (error) {
      console.error('Error connecting FB page:', error);
      res.status(500).send('Internal server error');
  }
});


// Route for disconnecting FB page connection
app.post('/disconnect-fb-page', async (req, res) => {
  const user = req.session.user;
  if (!user) {
    res.redirect('/login');
  } else {
    try {
      // Remove the FB page connection from the database
      await knex('fb_page_connections').where('user_id', user.id).del();
      res.send('Facebook page disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting FB page:', error);
      res.status(500).send('Internal server error');
    }
  }
});
app.post('/agent', (req, res) => {
    res.render('screen');
  });
// Route to create a new conversation

app.use('/', conversationsRouter);


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
