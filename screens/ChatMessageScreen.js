import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";

const ChatMessageScreen = () => {
  // const localhost = "192.168.8.72:8000";
  // const localhost = "192.168.43.4:8000";
  const {userId,setUserId,localhost} = useContext(UserType);
  const scrollViewRef = useRef(null);
  const route = useRoute();
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const { recepientId } = route.params;
  const navigation = useNavigation();
  const [recepientData, setRecepientData] = useState("");

  useEffect(()=>{
    scrollToBottom();
  })

  const scrollToBottom = ()=>{
    if(scrollViewRef.current){
      scrollViewRef.current.scrollToEnd({animated:true})
    }
  }

  const handleContentSizeChange =()=>{
    scrollToBottom();
  }

  //////////////////////////////////////
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://${localhost}/messages/${userId}/${recepientId}`
      );
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      } else {
        console.log("error showing messages", response.status.message);
      }
    } catch (error) {
      console.log("error in fetching the messages ", error);
    }
  };
  //////////////////////////////////////////
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />

          {selectedMessages.length > 0 ? (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {selectedMessages.length}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: recepientData?.image }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  resizeMode: "cover",
                }}
              />
              <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                {recepientData?.name}
              </Text>
            </View>
          )}
        </View>
      ),
      headerRight: () =>
        selectedMessages.length > 0 ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="md-arrow-redo-sharp" size={24} color="black" />
            <Ionicons name="md-arrow-undo-sharp" size={24} color="black" />
            <Ionicons name="star" size={24} color="black" />
            <Pressable>
            <MaterialIcons onPress={()=>deleteMessages(selectedMessages)} name="delete" size={24} color="black" />
            </Pressable>
          </View>
        ) : null,
    });
  }, [recepientData,selectedMessages]);

  /////////////////////////////

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  //////////////////////////
  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        const response = await fetch(`http://${localhost}/user/${recepientId}`);

        const data = await response.json();
        setRecepientData(data);
      } catch (error) {
        console.log("error retrieving details", error);
      }
    };

    fetchRecepientData();
  }, []);

  //////////////////////////////
  const handleSend = async (messageType, imageUri) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("recepientId", recepientId);

      //if the message type id image or a normal text
      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", message);
      }

      // const response = await axios.post(`http://${localhost}/messages`,formData);

      const response = await fetch(`http://${localhost}/messages`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("");
        setSelectedImage("");
        fetchMessages();
      }
    } catch (error) {
      console.log("error in sending the message", error);
    }
  };

  /////////////
  useEffect(() => {
    fetchMessages();
  }, []);

  console.log("messages", selectedMessages);

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    if (!result.canceled) {
      handleSend("image", result.assets[0].uri);
    }
  };

  const handleSelectMessage = async (message) => {
    //check whether the message is selected or not
    const isSelected = selectedMessages.includes(message._id);
    if (isSelected) {
      setSelectedMessages((previousMessages) =>
        previousMessages.filter((id) => id !== message._id)
      );
    } else {
      setSelectedMessages((previousMessages) => [
        ...previousMessages,
        message._id,
      ]);
    }
  };

  const deleteMessages = async(message_Ids) =>{
    try {
      const response = await fetch(`http://${localhost}/deleteMessages`,{
        method:'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({messages : message_Ids})
      });
      if(response.ok){
        // setSelectedMessages((previousMessages)=>previousMessages.filter((id)=>!message_Ids.includes(id)))
        setSelectedMessages([])
        fetchMessages();
      }
      else{
        console.log("Error deletiong messages",response.status);
      }
    } catch (error) {
      console.log("error deleting the messages",eror);
    }
  }


  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={{flexGrow:1}} onContentSizeChange={handleContentSizeChange}>
        {messages?.map((item, index) => {
          if (item.messageType === "text") {
            const isSelected = selectedMessages.includes(item._id);
            return (
              <Pressable
                onLongPress={() => handleSelectMessage(item)}
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        marginRight: 10,
                        marginTop: 5,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "#7CB9E8",
                        padding: 8,
                        margin: 10,
                        maxWidth: "60%",
                        borderRadius: 7,
                      },
                  isSelected && { width: "100%", backgroundColor: "#FFFFFF" },
                ]}
              >
                <Text style={{ fontSize: 13, textAlign: isSelected ? "right" : "left" }}>
                  {item?.message}
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    color: "gray",
                    marginTop: 4,
                  }}
                >
                  {formatTime(item.timeStamp)}
                </Text>
              </Pressable>
            );
          }

          if (item.messageType === "image") {
            const baseUrl = "/React Native/messenger-pro/api/files/";
            const imageUrl = item.imageUrl;
            const filename = imageUrl.split("\\").pop();
            const source = { uri: baseUrl + filename };
            
            // console.log(source);
            const isSelected = selectedMessages.includes(item._id);

            return (
              <Pressable
              onLongPress={() => handleSelectMessage(item)}

                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "#7CB9E8",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },
                      isSelected && { width: "100%", backgroundColor: "#FFFFFF" },

                ]}
              >
                <View>
                  <Image
                    source={source}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                  />
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 9,
                      position: "absolute",
                      right: 10,
                      bottom: 7,
                      color: "white",
                      marginTop: 5,
                    }}
                  >
                    {formatTime(item?.timeStamp)}
                  </Text>
                </View>
              </Pressable>
            );
          }
        })}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 8,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 5,
        }}
      >
        <TouchableOpacity onPress={handleEmojiPress}>
          <Entypo
            style={{ marginRight: 5 }}
            name="emoji-happy"
            size={24}
            color="gray"
          />
        </TouchableOpacity>
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type your message..."
        />

        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 8,
            alignItems: "center",
            gap: 7,
          }}
        >
          <TouchableOpacity>
            <Entypo onPress={pickImage} name="camera" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="mic" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => handleSend("text")}>
          <Ionicons name="send-sharp" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji);
          }}
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessageScreen;

const styles = StyleSheet.create({});
