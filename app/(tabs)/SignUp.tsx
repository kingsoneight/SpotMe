import { useState } from "react";
import { View, Text } from "@/components/Themed";
import {
  Alert,
  Button,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Keyboard,
  TextInput,
} from "react-native";
import  {firestore}  from "../../firebaseConfig"
import {auth} from "../../firebaseConfig"
import { router } from "expo-router";
import {createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

export default function SignUpScreen() {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>();
  const [passwordMatchError, setPasswordMatchError] = useState<boolean>(false);
  const handlePasswordChange = (text:string) => {
    setPassword(text);
    if (text !== confirmPassword) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  }; 
  const handleConfirmPasswordChange = (text:string) => {
    setConfirmPassword(text);
    if (password !== text) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  };

  const AddUserToDB = async(response: UserCredential) =>{
    const user = response.user;
    const db = firestore;
    const User = await addDoc(collection(db, "Users"), {
      uid: user.uid,
      email: user.email,
      name:"",
      friends: [],
      Gym: "",
      CheckInHistory: [],
      icon:"",
      Achievement: [],
      GymExperience :"0"
    
    });
    console.log("Document written with ID: ", User.id);
  }
  const handleSignUp = async () => {
    if(email && password && confirmPassword && password === confirmPassword) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          console.log(user);
          if (user) {
            Alert.alert("Success", "User has been created");
            await AddUserToDB(userCredential);
            router.navigate("LogIn");
          }
        }catch(error:any) {
          Alert.alert("Error", error.message);
        }
  }else{
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
    }
      Alert.alert("Error", "Please fill in all fields")
  }
}
  return (
    <Pressable style={styles.contentView} onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.contentView}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Register</Text>
          </View>
          <View style={styles.mainContent}>
            <TextInput
              style={styles.loginTextField}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              inputMode="email"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.loginTextField}
              placeholder="Password"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
            />
            <TextInput
              style={styles.loginTextField}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              secureTextEntry
            />
            {passwordMatchError && (
              <Text>Passwords do not match</Text>
            )}
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button title="Go Back" onPress={()=>router.navigate("LogIn")} />
          </View>
        </View>
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    marginHorizontal: 50,
    backgroundColor: "white",
    paddingTop: 20,
  },
  titleContainer: {
    flex: 1.2,
    justifyContent: "center",
  },
  titleText: {
    fontSize: 45,
    textAlign: "center",
    fontWeight: "200",
  },
  loginTextField: {
    borderBottomWidth: 1,
    height: 60,
    fontSize: 30,
    marginVertical: 10,
    fontWeight: "300",
    marginBottom: 20,
  },
  mainContent: {
    flex: 6,
  },
});
