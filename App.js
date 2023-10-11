//app.js
import * as AuthSession from "expo-auth-session";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, View, Image, TextInput } from 'react-native';
import Dictionary from './Dictionary';  // Import the Dictionary component
import QuizComponent from './QuizComponent';  // Import the Dictionary component
import AsyncStorage from '@react-native-community/async-storage';

import Navbar from './Navbar';
import Saved from './Saved';
import Content from './Content';  // Import the Content component
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
export default function App() {
      const [selectedWord, setSelectedWord] = useState(null);
    const [message, setMessage] = useState('');
const [loginMessage, setLoginMessage] = useState('');
const Stack = createStackNavigator();
const [activePage, setActivePage] = useState("home");
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
const [registerUsername, setRegisterUsername] = useState('');
const [registerPassword, setRegisterPassword] = useState('');
const [registerEmail, setRegisterEmail] = useState('');
const [email, setEmail] = useState('');

useEffect(() => {
    async function fetchUserEmail() {
        const savedEmail = await AsyncStorage.getItem('userEmail');
        if (savedEmail) {
    console.log("Fetched email from AsyncStorage:", savedEmail);
    setEmail(savedEmail);
    setIsLoggedIn(true);
} else {
    console.log("No email found in AsyncStorage");
}
    }
    
    fetchUserEmail();
}, []);
const handleRegister = async () => {
    try {
        let formData = new URLSearchParams();
        formData.append('username', registerUsername);
        formData.append('password', registerPassword);
        formData.append('email', registerEmail);

        let response = await fetch('https://skeba.info/applogin/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        let json = await response.json();
        if (json.success) {
            setMessage('Registration Successful! You can now log in.');
            // Clear the registration fields
            setRegisterUsername('');
            setRegisterPassword('');
            setRegisterEmail('');
        } else {
            setMessage('Registration Failed: ' + json.message);
        }
    } catch (error) {
        console.error('Registration error:', error);
        setMessage('An unexpected error occurred.');
    }
};
const logout = () => {
    setIsLoggedIn(false);
    setEmail(''); 
    AsyncStorage.removeItem('userEmail');
};

const handleLogin = async () => {
    try {
        let formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('password', password);


       let response = await fetch('https://skeba.info/applogin/login.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
});

let json = await response.json();
console.log("API Response JSON:", json);

     if (json.success) {
            console.log("Setting email from API response:", json.email);

    setIsLoggedIn(true);
    setEmail(json.email);
    AsyncStorage.setItem('userEmail', json.email);
    setLoginMessage('Login Successful!');
} else {
            setLoginMessage('Login Failed: ' + json.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        setLoginMessage('An unexpected error occurred during login.');
    }
};

return (
    <View style={styles.container}>
        {isLoggedIn ? (
            <View style={styles.loggedInContainer}>
               
                  
                     

     
            <Navbar email={email} isUserLoggedIn={isLoggedIn} setActivePage={setActivePage} />

           


                    {activePage === "home" && <Content name={name} email={email} setActivePage={setActivePage} />}
                    {activePage === "dictionary" && <Dictionary word={selectedWord} />}
                    {activePage === "saved" && <Saved name={name} email={email} onSelectWord={setSelectedWord} />}
                    {activePage === "quiz" && <QuizComponent name={name} email={email} />}
                    <Button title="Log out" onPress={logout} />
           
      


                </View>

          
            ) : (
                <View style={styles.formContainer}>
                            <Image source={require('./data/spanishquiz.png')} style={styles.image} />

                    <Text style={styles.header}>Login</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email" 
                        value={email}        // Updated value to email
                        onChangeText={setEmail}  // Updated function to setEmail
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
                    <Button title="Login" onPress={handleLogin} />
<Text style={styles.messageText}>{loginMessage}</Text>  

                    <Text style={[styles.header, styles.marginTop]}>Register</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Register Email"
                        value={registerEmail}
                        onChangeText={setRegisterEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Register Password"
                        value={registerPassword}
                        onChangeText={setRegisterPassword}
                        secureTextEntry={true}
                    />
                    <Button title="Register" onPress={handleRegister} />
                    <Text style={styles.messageText}>{message}</Text>

                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        paddingBottom: 20,
         paddingLeft: 20,
         paddingRight: 20,
 width: '100%',
    },
    messageText: {
    textAlign: 'center',
    color: '#FF0000',  // red color for the message
    marginBottom: 15,
},
       image: {
        width: 300,
        height: 200,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 40,
    },
    loggedInContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
    },

    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    marginTop: {
        marginTop: 40,
    }
});