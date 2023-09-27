import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import UserChat from '../components/UserChat';

const ChatScreen = () => {
  
  // const localhost = "192.168.8.72:8000"
  // const localhost = "192.168.43.4:8000"
  const {userId,setUserId,localhost} = useContext(UserType);
  const [acceptedFriends,setAcceptedFriends] = useState([]);
  const navigation = useNavigation();

  useEffect(()=>{
    const acceptedFriendsList = async()=>{
      try {
        // const response = await fetch(`http://192.168.43.4:8000/accepted-friends/${userId}`);
        // const response = await fetch(`http://192.168.8.72:8000/accepted-friends/${userId}`);
        const response = await fetch(`http://${localhost}/accepted-friends/${userId}`);
        const data = await response.json();
        if(response.ok){
          setAcceptedFriends(data);
        }
      } catch (error) {
        console.log("error showing the accepted friends",error)
      }
    };
    acceptedFriendsList();
  },[])
  // console.log('friends',acceptedFriends)
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Pressable>
        {acceptedFriends.map((item,index)=>(
          <UserChat key={index} item={item} />
        ))}
      </Pressable>
    </ScrollView >
  )
}

export default ChatScreen

const styles = StyleSheet.create({})