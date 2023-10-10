//Saved.js
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button} from 'react-native'; // Add missing components
//import { useHistory } from 'react-router-dom';


const Saved = ({ name, email, onSelectWord }) => {
    //const history = useHistory();
 
    const [savedWords, setSavedWords] = useState([]);
  const handleDeleteClick = async (index, event) => {
        event.preventDefault();
        const wordToDelete = savedWords[index];
        
        try {
             console.log('starting');
             console.log(wordToDelete);
             console.log(email);
            const response = await fetch('https://skeba.info/netlify/deleteWord.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_email: email,
                    word: wordToDelete
                })
            });
const responseText = await response.text();
console.log('Response Text:', responseText);

// Now parse the logged text as JSON
const data = JSON.parse(responseText);
          
            if (data.success) {
                // Remove the word from the savedWords state
                setSavedWords(prevWords => prevWords.filter(word => word !== wordToDelete));
            } else {
                console.error('Error deleting word:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleIconClick = (index, event) => {
        event.preventDefault();
        const word = savedWords[index];
        onSelectWord(word);
    };

    useEffect(() => {
        // Fetch the saved words from the database
        const fetchSavedWords = async () => {
            try {
                const response = await fetch(`https://skeba.info/netlify/getSavedWords.php?user_email=${email}`);
                const data = await response.json();
                if (data && data.words) {
                    setSavedWords(data.words);
                }
            } catch (error) {
                console.error('Error fetching saved words:', error);
            }
        };

        fetchSavedWords();
    }, [email]);

    return (
        <View style={styles.container}>
        <Text style={styles.header}>Your Saved Verbs</Text>
        {savedWords.map((word, index) => (
            <View key={index} style={styles.wordContainer}>
                <Text style={styles.text}>{word}</Text>
                <Text style={styles.iconQuestion} onPress={(e) => handleIconClick(index, e)}>
                    search
                </Text>
                <Text style={styles.iconDelete} onPress={(e) => handleDeleteClick(index, e)}>
                    delete
                </Text>
            </View>
        ))}
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    picker: {
        width: 250,
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: '#f8f8f8',
    },
    pickerItem: {
        fontSize: 18,
    },
    input: {
        width: 200,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    listItem: {
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ddd',
    },
    correctAnswer: {
        backgroundColor: 'green',
    },
    incorrectAnswer: {
        backgroundColor: 'red',
    },
});

export default Saved;


