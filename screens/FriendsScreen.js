import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { UserType } from '../UserContext';
import FriendRequest from '../components/FriendRequest';

const FriendsScreen = () => { 

  
  // const localhost = "192.168.8.72:8000"
  // const localhost = "192.168.43.4:8000"
  const {userId,setUserId,localhost} = useContext(UserType);
  const [friendRequests, setFriendRequests] = useState([]);
  useEffect(() => {
    fetchFriendRequests();
    }, []);


const fetchFriendRequests = async () => {
  try {
    const response = await axios.get(`http://${localhost}/friend-request/${userId}`);
    if (response.status === 200) {
      const friendRequestsData = response.data.map((friendRequest) => ({
        _id: friendRequest._id,
        name: friendRequest.name,
        email: friendRequest.email,
        image: friendRequest.image,
      }));

      setFriendRequests(friendRequestsData);
    }
  } catch (err) {
    console.log("error message", err);
  }
};

// console.log(friendRequests);

  return (
    <View style={{padding:10 , marginHorizontal:12}}>
        { friendRequests.length > 0 && <Text>Your Friend Requests!</Text> }
        { friendRequests?.map((item,index)=>(
            <FriendRequest item={item} key={index} friendRequests={friendRequests} setFriendRequests={setFriendRequests}  />
        ))}

    </View>
  )
}

export default FriendsScreen

const styles = StyleSheet.create({})