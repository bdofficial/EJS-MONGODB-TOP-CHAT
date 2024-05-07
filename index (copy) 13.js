// app.js
const express = require('express');
const ejs = require('ejs');
const { MongoClient } = require('mongodb');

const app = express();
const uri = 'mongodb+srv://bdofficial:Sabbir151513@bdofficialshop.2aciprw.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let usersCollection;
let chatCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    const db = client.db('shop');
    usersCollection = db.collection('user');
    chatCollection = db.collection('chat');
    console.log('Connected to the MongoDB database');
  } catch (error) {
    console.error('Failed to connect to the MongoDB database:', error);
  }
}

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', async (req, res) => {
  const userName = req.body.name.toLowerCase();
  // Rest of your code
  const userAddress = req.body.address.toLowerCase();
  const userNumber = req.body.number.toLowerCase();
  const userId = userName + userAddress + userNumber;
  try {
    // Check if a user with the same ID already exists
    const existingUser = await usersCollection.findOne({ id: userId });
    
  if (existingUser) {
  const redirectUrl = `/user/${userId}`;
  res.send(`
    <html>
      <head>
        <script>
          window.location.replace("${redirectUrl}");
        </script>
      </head>
      <body>
        Redirecting...
      </body>
    </html>
  `);
}
else {
    // Create a new user with the given ID and empty message array
    const newUser = {
      id: userId,
      messages: [],
      lastMessageTime: null // Set initial lastMessageTime as null
    };

    // Insert the new user into the users collection
    await usersCollection.insertOne(newUser);

    // Redirect to the user chat page for the new user
    res.redirect(`/user/${userId}`);
  }

  } 
    catch (error) {
    console.error('Failed to create a new user:', error);
    res.status(500).send('Internal Server Error');
  }
});           
app.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    // Find the user with the given ID
    const user = await usersCollection.findOne({ id: userId });
    if (!user) {
      return res.status(404).send('User not found');
    }
    // Render the user chat page with the user's messages
  res.render('userchat', { user });
  } catch (error) {
    console.error('Failed to retrieve user:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const message = req.body.message;
  const currentTime = new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Dhaka',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
});
 // Get the current timestamp

  try {
    // Find the user with the given ID
    const user = await usersCollection.findOne({ id: userId });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Add the new message to the user's messages
    user.messages.push(message);
    user.lastMessageTime = currentTime; // Update the lastMessageTime property with the current timestamp

    // Update the user document in the users collection
    await usersCollection.updateOne({ id: userId }, { $set: { messages: user.messages, lastMessageTime: currentTime } });

    // Insert the new message into the chat collection with the sender's ID
    await chatCollection.insertOne({ userId, message });

    // Redirect back to the user chat page
    res.redirect(`/user/${userId}`);
  } catch (error) {
    console.error('Failed to update user:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/chatroom', async (req, res) => {
  try {
    // Retrieve all chat messages from the chat collection, sorted in descending order
    const chatMessages = await chatCollection.find().sort({ _id: -1 }).toArray();

    // Get the unique user IDs from the chat messages
    const uniqueUserIds = [...new Set(chatMessages.map(msg => msg.userId))];

    // Retrieve user details for each unique user from the users collection
    const users = await Promise.all(
      uniqueUserIds.map(async (userId) => {
        const user = await usersCollection.findOne({ id: userId });
        return {
          id: user.id,
          latestMessage: user.messages[user.messages.length - 1], // Get the latest message from the user's messages
          lastMessageTime: user.lastMessageTime // Get the last message time from the user
        };
      })
    );

    // Render the chatroom page with the list of users
    res.render('chatroom', { users });
  } catch (error) {
    console.error('Failed to retrieve chatroom users:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/chatroom/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user with the given ID
    const user = await usersCollection.findOne({ id: userId });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Retrieve chat messages for the user from the chat collection, sorted in ascending order
    const chatMessages = await chatCollection.find({ userId }).sort({ _id: 1 }).toArray();

    // Render the user chat page with the user's messages
    res.render('userchat', { user, messages: chatMessages.map(msg => msg.message) });
  } catch (error) {
    console.error('Failed to retrieve user:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/chatroom/user/:id', async (req, res) => {
  const userId = req.params.id;
  const message = req.body.message;
const currentTime = new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Dhaka',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
});
 // Get the current timestamp

  try {
    // Find the user with the given ID
    const user = await usersCollection.findOne({ id: userId });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Add the new message to the user's messages
    user.messages.push(message);
    user.lastMessageTime = currentTime; // Update the lastMessageTime property with the current timestamp

    // Update the user document in the users collection
    await usersCollection.updateOne({ id: userId }, { $set: { messages: user.messages, lastMessageTime: currentTime } });

    // Insert the new message into the chat collection with the sender's ID
    await chatCollection.insertOne({ userId, message });

    // Redirect back to the user chat page
    res.redirect(`/chatroom/user/${userId}`);
  } catch (error) {
    console.error('Failed to update user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Connect to the MongoDB database on server start
connectToDatabase()
  .then(() => {
    // Use PORT provided in environment or default to 3000
const port = process.env.PORT || 3000;

// Listen on `port` and 0.0.0.0
app.listen(port, "0.0.0.0",);
  })
  .catch(error => {
    console.error('Failed to connect to the MongoDB database:', error);
  });
      