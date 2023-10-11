import React, { useState, useEffect } from 'react'; // Add missing hooks
import { Text, View, StyleSheet, Button, ScrollView} from 'react-native'; // Add missing components
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-community/async-storage';


function Content({ name, email, setActivePage}) {
    console.log("Received email prop:", email);

    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState(null);
const [difficulty, setDifficulty] = useState(""); // Use an empty string as the default value
    const [quizcount, setquizcount] = useState(null);
    useEffect(() => {
  const getEmailFromStorage = async () => {
    if (!email) {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        console.log("Email from local storage:", storedEmail);
        if (storedEmail) {
            email = storedEmail;  // Update the email from local storage
        }
    }
};
    
    getEmailFromStorage();
}, []);
    useEffect(() => {
        const fetchUserPreferences = async () => {
            try {
                console.log("Using email for API call:", email);

                if (!email) return; // Use email directly
                const response = await fetch(`https://skeba.info/netlify/get-biography.php?email=${email}`);
                const data = await response.json();
                console.log("data:", data);
                if (data) {
                    setLanguage(data.language || "spanish");
                    setDifficulty(data.difficulty || "beginner");
                    setquizcount(data.quiz_count || 0);
                }
            } catch (error) {
                console.error('Error fetching user preferences:', error);
            }
        };

        fetchUserPreferences();
    }, [email]);

    const saveBiographyAndPreferences = async (newDifficulty) => {
     

        try {
            console.log("Saving preferences for email:", email, newDifficulty);
   console.log("New difficulty:", newDifficulty);
            const response = await fetch('https://skeba.info/netlify/save-biography.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, difficulty: newDifficulty })

            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.message) {
                    alert(data.message);
                } else {
                    alert('Unexpected response from the server.');
                    console.error('Unexpected data:', data);
                }
            } else {
                alert('Failed to save data.');
                console.error('Response not OK:', response);
            }
        } catch (error) {
            console.error('There was an error saving the data:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Welcome {name}!</Text>
            
            <Text style={styles.subHeader}>Select your difficulty level:</Text>
            
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={difficulty || ""}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                        setDifficulty(itemValue);
                        console.log("Changed difficulty to:", itemValue);

                        saveBiographyAndPreferences(itemValue);
                    }}
                >
                    <Picker.Item label="Beginner" value="beginner" />
                    <Picker.Item label="Intermediate" value="intermediate" />
                    <Picker.Item label="Advanced" value="advanced" />
                </Picker>
            </View>
            
            <View style={styles.buttonContainer}>
                <Button title="Take a Quiz!" onPress={() => setActivePage('quiz')} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    subHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: '#555',
        textAlign: 'center',
        marginBottom: 10,
    },
    pickerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    picker: {
        height: 50,
        width: 200,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        alignSelf: 'center',
        marginTop: 20,
    },
});

export default Content;