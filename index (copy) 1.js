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
  const userAddress = req.body.address.toLowerCase();
  const userNumber = req.body.number.toLowerCase();
  const userId = userName + userAddress + userNumber;

  try {
    // Check if a user with the same ID already exists
    const existingUser = await usersCollection.findOne({ id: userId });
    if (existingUser) {
      return res.redirect(`/user/${userId}`);
    }

    // Create a new user with the given ID and empty message array
    const newUser = {
      id: userId,
      messages: []
    };

    // Insert the new user into the users collection
    await usersCollection.insertOne(newUser);

    // Redirect to the user chat page for the new user
    res.redirect(`/user/${userId}`);
  } catch (error) {
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

  try {
    // Find the user with the given ID
    const user = await usersCollection.findOne({ id: userId });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Add the new message to the user's messages
    user.messages.push(message);

    // Update the user document in the users collection
    await usersCollection.updateOne({ id: userId }, { $set: { messages: user.messages } });

    // Insert the new message into the chat collection
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
    // Retrieve the latest chat messages for each user from the chat collection
    const latestMessages = await chatCollection.aggregate([
      { $sort: { _id: -1 } }, // Sort the chat messages in descending order by _id
      {
        $group: {
          _id: "$userId",
          message: { $first: "$message" }
        }
      }
    ]).toArray();

    // Retrieve user details for each user with the latest message from the users collection
    const users = await Promise.all(
      latestMessages.map(async (message) => {
        const user = await usersCollection.findOne({ id: message._id });
        return {
          id: user.id,
          latestMessage: message.message
        };
      })
    );

    // Render the chat room page with the list of users
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

    // Retrieve chat messages for the user from the chat collection
    const chatMessages = await usersCollection.find({ userId }).toArray();

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

  try {
    // Find the user with the given ID
    const user = await usersCollection.findOne({ id: userId });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Add the new message to the user's messages
    user.messages.push(message);

    // Update the user document in the users collection
    await usersCollection.updateOne({ id: userId }, { $set: { messages: user.messages } });

    // Insert the new message into the chat collection
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
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch(error => {
    console.error('Failed to connect to the MongoDB database:', error);
  });
      