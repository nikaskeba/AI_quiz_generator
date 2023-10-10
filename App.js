//app.js
import * as AuthSession from "expo-auth-session";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { Alert, Button, Platform, StyleSheet, Text, View, Image } from "react-native";
import Dictionary from './Dictionary';  // Import the Dictionary component
import QuizComponent from './QuizComponent';  // Import the Dictionary component
import Navbar from './Navbar';
import Saved from './Saved';
import Content from './Content';  // Import the Content component
const auth0ClientId = "qc5Lac6ghJhjt6me1bi5dTvvSFDqlcnL";
const authorizationEndpoint = "https://dev-psw7nj5r7hp6q2lc.us.auth0.com/authorize";

const useProxy = false;


const redirectUri = AuthSession.makeRedirectUri({
  native: 'exp://localhost:19000',
  browser: 'http://localhost:19006/'
});

export default function App() {
    const [selectedWord, setSelectedWord] = useState(null);
    const [activePage, setActivePage] = useState("home");

  const [name, setName] = useState(() => {
    // For web platform, try to retrieve the name from localStorage on initial load
    if (Platform.OS === 'web') {
      const url = new URL(window.location.href);
      const id_token = url.hash.split('&').find(param => param.startsWith('#id_token='));
      if (id_token) {
        const jwtToken = id_token.split('=')[1];
        const decoded = jwtDecode(jwtToken);
        console.log(decoded.name);

        return decoded.name;
      }
      return window.localStorage.getItem('username');
    }
    return null;
  });
const [email, setEmail] = useState(() => {
    if (Platform.OS === 'web') {
        const url = new URL(window.location.href);
        const id_token = url.hash.split('&').find(param => param.startsWith('#id_token='));
        if (id_token) {
            const jwtToken = id_token.split('=')[1];
             console.log(jwtToken);
            const decoded = jwtDecode(jwtToken);
             console.log(decoded.email);
               console.log(decoded);
            return decoded.email;  // Return the email from the decoded token
        }
        return window.localStorage.getItem('useremail');  // Retrieve email from localStorage
    }
    return null;
});

  const handleLoginPress = () => {
    if (Platform.OS === 'web') {
      const authUrl = `${authorizationEndpoint}?` +
        `client_id=${auth0ClientId}&` +
        `response_type=id_token&` +
        `scope=openid profile email&` +
        `redirect_uri=${redirectUri}&` +
        `nonce=nonce`;
      window.location.href = authUrl;
    } else {
      promptAsync({ useProxy });
    }
  };

const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
        redirectUri,
        clientId: auth0ClientId,
        responseType: "token id_token",  // request both access token and ID token
        scopes: ["openid", "profile", "email"],
        extraParams: {
            nonce: "nonce"
        },
    },
    { authorizationEndpoint }
);
async function fetchUserInfo(token) {
  const response = await fetch('https://dev-psw7nj5r7hp6q2lc.us.auth0.com/userinfo', {  // replace with your Auth0 domain
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });

  return await response.json();
}
const logout = () => {
    setName(null);
    setEmail(null);  // Clear email from the app state
    
    if (Platform.OS === 'web') {
        window.localStorage.removeItem('username');
        window.localStorage.removeItem('useremail');  // Clear email from localStorage
        
        const logoutUrl = `https://dev-psw7nj5r7hp6q2lc.us.auth0.com/v2/logout?client_id=${auth0ClientId}&returnTo=http://localhost:19006/`;
        window.location.href = logoutUrl;
    }
};


useEffect(() => {
    console.log("Auth0 response:", result);  // Log the entire result

    if (result?.type === "success") {
        const jwtToken = result.params.id_token;
        const decoded = jwtDecode(jwtToken);
        
        const userName = decoded.name;
        
        setName(userName);
        
        if (Platform.OS === 'web') {
            window.localStorage.setItem('username', userName);
        }

        // Define an asynchronous function to fetch user info
        const fetchUserDetails = async () => {
            const accessToken = result.params.access_token;  // get the access token from the result
            
            try {
                // Fetch user info using the access token
                const user = await fetchUserInfo(accessToken);
                setEmail(user.email);  // Set the email once fetched
                
                if (Platform.OS === 'web') {
                    window.localStorage.setItem('useremail', user.email);  // Store email in localStorage
                }
            } catch (error) {
                console.error("Failed to fetch user info:", error);
            }
        };

        // Call the asynchronous function
        fetchUserDetails();
    }
}, [result]);

return (
        <View style={styles.container}>
            <Navbar isUserLoggedIn={!!name} setActivePage={setActivePage} />
            {name ? (
                <>
                    {activePage === "home" && <Content name={name} email={email} setActivePage={setActivePage} />}
                    {activePage === "dictionary" && <Dictionary word={selectedWord} />}
                    {activePage === "saved" && <Saved name={name} email={email} onSelectWord={setSelectedWord} />}
                    {activePage === "quiz" && <QuizComponent name={name} email={email} />}
                    <Button title="Log out" onPress={logout} />
                </>
            ) : (
                <>
                    <Image source={require('./data/spanishquiz.png')} style={styles.image} /> 
                    <Button
                        disabled={!request}
                        title="Log in with Auth0"
                        onPress={handleLoginPress}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: 'flex-start',
    },
    Button:{ width:100},
    title: {
        fontSize: 20,
        textAlign: "center",
        marginTop: 40
    },
    image: {
        width: 300, // Or adjust based on your requirements
        height: 200, // Or adjust based on your requirements
        resizeMode: 'contain', // Ensures image is scaled correctly
        alignSelf: 'center', // Centers the image horizontally
        marginTop: 50 // Spacing from the top
    }
});