/////import express mongodb ejs
const express = require('express');
const { MongoClient } = require('mongodb');
const ejs = require('ejs');
/////////app
const app = express();
////////uri:api
const uri = 'mongodb+srv://bdofficial:Sabbir151513@bdofficialshop.2aciprw.mongodb.net/?retryWrites=true&w=majority';
////////mongo clint permission
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
////////collection setup
let usersCollection;
let chatCollection;
/////////async
async function connectToDatabase() {
//////try mongodb
  try {
//////try to connect
    await client.connect();
/////////collection
    const db = client.db('shop');
    usersCollection = db.collection('user');
    chatCollection = db.collection('chat');
//////////////connected
    console.log('Connected to the MongoDB database');
//////////failed to connect
  } catch (error) {
    console.error('Failed to connect to the MongoDB database:', error);
  }
}
/////////////URL-encoded permition:body parser
app.use(express.urlencoded({ extended: true }));
////////public for css JavaScript replies
app.use(express.static(__dirname + '/public'));
/////view ejs as html
app.set('view engine', 'ejs');
///////index as defult home
app.get('/', (req, res) => {
  res.render('index');
});
/////////new id or existing id
app.post('/', async (req, res) => {
/////info:id,name-address-number
  const userName = req.body.name.toLowerCase();
  const userAddress = req.body.address.toLowerCase();
  const userNumber = req.body.number.toLowerCase();
//////combine them
  const userId = userName + userAddress + userNumber;
///////new id or existing id
  try {
//////Check if old id
    const existingUser = await usersCollection.findOne({ id: userId });
///////if old id redirect to userchat   
    if (existingUser) res.redirect(`/user/${userId}`);
////else Create new id
else {
/////data insult user
    const newUser = {
      id: userId,
      messages: [],
      lastMessageTime: null
    };
/////Insert the new user into the users collection
    await usersCollection.insertOne(newUser);
    // Redirect to the user chat page for the new user
res.redirect(`/user/${userId}`);
  }
//////
  }
////////
////////catch error
    catch (error) {
    console.error('Failed to create a new user:', error);
res.status(500).send('Internal Server Error');
  }
///////
});
/////////
//////////userid
// Combined route for both user chat and chatroom
app.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    // Find the user with the given ID
    const user = await usersCollection.findOne({ id: userId });
    if (!user) {
      return res.status(404).send('User not found');
    }
    // If the URL contains "/chatroom", retrieve chat messages for the user
    // from the chat collection, otherwise render the userchat page with the user's messages
    if (req.originalUrl.includes('/chatroom')) {
      const chatMessages = await chatCollection.find({ userId }).sort({ _id: 1 }).toArray();
      res.render('userchat', { user, messages: chatMessages.map(msg => msg.message) });
    } else {
      res.render('userchat', { user });
    }
  } catch (error) {
    console.error('Failed to retrieve user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Combined route for both user chat and chatroom post requests
app.post('/:id', async (req, res) => {
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
    // Redirect back to the appropriate page based on the URL
    res.redirect(req.originalUrl);
  } catch (error) {
    console.error('Failed to update user:', error);
    res.status(500).send('Internal Server Error');
  }
});
/////chatroom get
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
  }
///////error
catch (error) {
    console.error('Failed to retrieve chatroom users:', error);
res.status(500).send('Internal Server Error');
  }
});

// Connect to the MongoDB database on server start
connectToDatabase()
  .then(() => {
///// Used PORT 3000
    app.listen(3000);
  })
/////catch error
  .catch(error => {
    console.error('Failed to connect to the MongoDB database:', error);
  });
////////////////////
///////////////////
//////////////////