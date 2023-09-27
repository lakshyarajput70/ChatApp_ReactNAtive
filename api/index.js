const connectDB = require('./config/db')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const app= express();
const cors = require('cors')
const port = 8000;
const jwt = require('jsonwebtoken')


app.use(cors());

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(passport.initialize())

connectDB();

app.listen(port,()=>{
    console.log("Server running on Port ",port)
})

const User = require('./models/user')
const Message = require('./models/message')
const multer = require('multer')

//endpoint for the registration of the user

app.post('/register',(req,res)=>{
    const {name,email,password,image} = req.body ;

    //create a new User Object
    const newUser = new User({name,email,password,image})

    //save the user to the dB
    newUser.save().then(()=>{
        res.status(200).json({message:"User registered successfully"})
    }).catch((err)=>{
        console.log("Error registering the User",err);
        res.status(500).json({message:"Error registering the User!"})
    })
})

//function to create a token for the user
const createToken = (userId) =>{
    //set the payload
    const payload = {
        userId : userId
    }
    //Generate the token with a secret key and expiration time

    const token = jwt.sign(payload,"Q$jshlas;laks19",{expiresIn:'1h'});
    return token;

}

//endpoint for the logging in  of the user

app.post('/login',(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(404).json({message:"Email and the password are required"})
    }

    //check for the user in the dB
    User.findOne({email}).then((user)=>{
        if(!user){
            return res.status(404).json({message:"User not Found"})
        }
        //compare the provided password with the password provided
        if(user.password!==password){
            return res.status(404).json({message:"Invalid Password"})
        } 
        const token = createToken(user._id);
        res.status(200).json({token:token});
    }).catch((error)=>{
        console.log("error in finding the user",error)
        res.status(500).json({message:"Internal Server Error"})
    })
})


//endpoint to access all the users except the user who's is currently logged in !
app.get('/users/:userId',(req,res)=>{

    const loggedInUserId = req.params.userId;

    User.find({_id:{ $ne : loggedInUserId }}).then((users)=>{
        res.status(200).json(users);
    }).catch((error)=>{
        console.log("error in retrieving the user",error)
        res.status(500).json({message:"Error retrieving users"})
    })

})

//endpoint to send a request to a user

app.post("/friend-request",async(req,res)=>{
const {currentUserId,selectedUserId} = req.body;
try {
    //update the recepient's friendrequestArray
    await User.findByIdAndUpdate(selectedUserId,{
        $push:{friendRequests:currentUserId}
    });
    //update the sender's sentfriendrequestArray
    await User.findByIdAndUpdate(currentUserId,{
        $push:{sentFriendRequests:selectedUserId}
    });
    res.sendstatus(200)
} catch (error) {
    res.sendStatus(500);
}
})

//endpoint to show all the friend request of the particular user

app.get("/friend-request/:userId",async(req,res)=>{
    try {
        const {userId} = req.params;

        //fetch the user document based on the userId
        const user = await User.findById(userId).populate("friendRequests","name email image").lean();

        const friendRequests = user.friendRequests;
        res.json(friendRequests);

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
})

//endpoint to accept a friend-request of a particular person

app.post("/friend-request/accept",async(req,res)=>{
    try {
        const {senderId,recepientId} = req.body ;
        // retrieve the document of sender and recepient
        const sender = await User.findById(senderId);
        const recepient = await User.findById(recepientId);
    
        sender.friends.push(recepientId);
        recepient.friends.push(senderId);
        
        recepient.friendRequests = recepient.sentFriendRequests.filter(
            (request)=>request.toString()!==senderId.toString() )
    
        sender.sentFriendRequests = sender.sentFriendRequests.filter(
            (request)=>request.toString()!==recepientId.toString() )
    
        await sender.save();
        await recepient.save();
    
        res.status(200).json({message:"Friend Request accepted successfully"})        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server error"})
    }

});

//ebdpoint to access all the friend of the user

app.get("/accepted-friends/:userId",async(req,res)=>{
    try {
        const {userId} = req.params;
        const user = await User.findById(userId).populate("friends","name email image")

        const acceptedFriends = user.friends;
        res.json(acceptedFriends);

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server error"})    
    }
})



// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "files/"); // Specify the desired destination folder
    },
    filename: function (req, file, cb) {
      // Generate a unique filename for the uploaded file
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });
const upload = multer({ storage: storage });



//endpoint to post Messages and store it in the backend
app.post("/messages", upload.single("imageFile"), async (req, res) => {
    try {
      const { senderId, recepientId, messageType, messageText } = req.body;
  
      const newMessage = new Message({
        senderId,
        recepientId,
        messageType,
        message: messageText,
        timestamp: new Date(),
        imageUrl: messageType === "image" ? req.file.path : null,
      });
  
      await newMessage.save();
      res.status(200).json({ message: "Message sent Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//endpoint to get the userdetails to design the chat Room header

app.get("/user/:userId",async(req,res)=>{
    try {
        const {userId} = req.params;

        const recepientId = await User.findById(userId);
        res.json(recepientId);
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server error"})        
    }
})

//endpoint to fetch the messages between two users in the chatRoom
app.get("/messages/:senderId/:recepientId", async (req, res) => {
    try {
      const { senderId, recepientId } = req.params;
  
      const messages = await Message.find({
        $or: [
          { senderId: senderId, recepientId: recepientId },
          { senderId: recepientId, recepientId: senderId },
        ],
      }).populate("senderId", "_id name");
  
      res.json(messages);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
////////////////////
// endpoint to treat the the messages  

app.post("/deleteMessages",async(req,res)=>{
    try{
        const {messages} = req.body ;
        if(!Array.isArray(messages) || messages.length===0){
            return res.status(400).json({message:"Invaid req body"})
        }
        await Message.deleteMany({_id:{$in:messages}})
        res.json({message:"Message deleted successfully"})
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
})


app.get("/friend-requests/sent/:userId",async(req,res)=>{
    try {
        const {userId}=req.params;
        const user = await User.findById(userId).populate("sentFriendRequests","name email image").lean()
        const sentFriendRequests = user.sentFriendRequests;
        res.json(sentFriendRequests)

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" })   
    }
})


app.get("/friends/:userId",(req,res) => {
    try{
      const {userId} = req.params;
  
      User.findById(userId).populate("friends").then((user) => {
        if(!user){
          return res.status(404).json({message: "User not found"})
        }
  
        const friendIds = user.friends.map((friend) => friend._id);
  
        res.status(200).json(friendIds);
      })
    } catch(error){
      console.log("error",error);
      res.status(500).json({message:"internal server error"})
    }
  })