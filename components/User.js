import {
  TouchableOpacity,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";

const User = ({ item }) => {
  // const localhost = "192.168.8.72:8000"
  // const localhost = "192.168.43.4:8000"
  const { userId, setUserId, localhost } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);

  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      // const response = await fetch('http://192.168.8.72:8000/friend-request',{
      // const response = await fetch('http://192.168.43.4:8000/friend-request',{
      const response = await fetch(`http://${localhost}/friend-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });
      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("error message", error);
    }
  };

  useEffect(() => {
    const fetchFriendRequest = async () => {
      try {
        const response = await fetch(
          `http://${localhost}/friend-requests/sent/${userId}`
        );
        const data = await response.json();
        if (response.ok) {
          setFriendRequests(data);
        } else {
          console.log("error", response.status);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchFriendRequest();
  }, [friendRequests]);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await fetch(`http://${localhost}/friends/${userId}`);

        const data = await response.json();

        if (response.ok) {
          setUserFriends(data);
        } else {
          console.log("error retrieving user friends", response.status);
        }
      } catch (error) {
        console.log("Error message", error);
      }
    };

    fetchUserFriends();
  }, [userFriends]);

  return (
    <Pressable
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
    >
      <View>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "cover",
          }}
          source={{ uri: item.image }}
        />
      </View>

      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
        <Text style={{ marginTop: 4, color: "gray" }}>{item.email}</Text>
      </View>

      {userFriends.includes(item._id) ? (
        <Pressable
          style={{
            backgroundColor: "#82CD47",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>Friend</Text>
        </Pressable>
      ) : requestSent ||
        friendRequests.some((friend) => friend._id === item._id) ? (
        <Pressable
          style={{
            backgroundColor: "gray",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" , fontSize:13 }}>Sent Request</Text>
        </Pressable>
      ) : (
        <TouchableOpacity
          onPress={() => sendFriendRequest(userId, item._id)}
          style={{
            backgroundColor: "#567189",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Add Friend
          </Text>
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({});
