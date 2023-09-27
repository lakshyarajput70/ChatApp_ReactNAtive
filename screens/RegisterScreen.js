import { Alert, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { UserType } from '../UserContext';

const RegisterScreen = () => {
  
  // const localhost = "192.168.8.72:8000"
  // const localhost = "192.168.43.4:8000"
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
    const {localhost} = useContext(UserType);

    const handleRegister =()=>{
      const user ={
        name:name,
        email:email,
        password:password,
        image:image
      }
      
      //send a post request to the backend api to register ther user

      // axios.post('http://192.168.8.72:8000/register',user).then((response)=>{
      // axios.post('http://192.168.43.4:8000/register',user).then((response)=>{
      axios.post(`http://${localhost}/register`,user).then((response)=>{
        console.log(response);
        Alert.alert("Registration successfull","You have been registered successfully")
        setName('');
        setEmail('');
        setPassword('')
        setImage('')
      }).catch((error)=>{
        Alert.alert("Registration Error","An error occured")
        console.log('registration failed',error)
      })
    }
  
  return (
    <View  style={{
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        alignItems: "center",
      }}>
     <KeyboardAvoidingView>
        <View
          style={{
            marginTop: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#4A55A2", fontSize: 17, fontWeight: "600" }}>
            Register
          </Text>
          <Text style={{ marginTop: 17, fontSize: 17, fontWeight: "600" }}>
            Register to Your Account
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
            
        <View>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                fontSize: email ? 18 : 17,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={"black"}
              placeholder="Enter Your Name"
            />

          </View>
        
          <View style={{marginTop:10}}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                fontSize: email ? 18 : 17,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={"black"}
              placeholder="Enter Your Email"
            />
          </View>

          <View style={{marginTop:10}}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{
                fontSize: email ? 18 : 17,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={"black"}
              placeholder="Enter Your Password"
            />
          </View>
            
          <View style={{marginTop:10}}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Image
            </Text>
            <TextInput
              value={image}
              onChangeText={(text) => setImage(text)}
              style={{
                fontSize: email ? 18 : 17,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={"black"}
              placeholder="Enter Your Image"
            />
          </View>


          <TouchableOpacity onPress={handleRegister}
           style={{width:200 , backgroundColor:"#4A55A2" , padding:15  , marginTop:50 ,marginLeft:'auto' , marginRight:'auto', borderRadius:6}}>
            <Text style={{color:'white' , fontSize:16 , fontWeight:'bold' , textAlign:'center'}}>Register</Text>
          </TouchableOpacity>

          <Pressable  
          style={{marginTop:15}} onPress={()=>{navigation.goBack()}}>
            <Text style={{textAlign:"center" , color:'gray', fontSize:16}}>Already have an account ? Sign In</Text>
          </Pressable>




        </View>
        
      </KeyboardAvoidingView>
    
    </View>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({})