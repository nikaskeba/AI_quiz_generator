import React, { useState, useEffect } from 'react';

import { Text, View, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import dictionaryData from './data/spanishdictionary.json';

const Dictionary = () => {
const [difficulty, setDifficulty] = useState(null);




 const { word } = useState('');
    const [searchTerm, setSearchTerm] = useState(word || '');
    const [searchResult, setSearchResult] = useState('');
    const [displayedVerb, setDisplayedVerb] = useState(null);


    useEffect(() => {
        if (word) {
            handleSearch();
        }
        // eslint-disable-next-line
    }, [word]);
    const formMapping = {
        "form_1s": "Yo",
        "form_2s": "Tu",
        "form_3s": "Ella",
        "form_1p": "Nosotros",
        "form_2p": "Vosotros",
        "form_3p": "Ellos"
    };
const tenseDescriptions = {
    "Preterite": "(simple past)",
    "Present": "(present tense)",
    "Future": "(future tense)",
   "Imperfect": "(imperfect past)",
   "Conditional": "(possibility)",
    "Present Perfect": "(have)",
    "Future Perfect": "(will have)",
    "Past Perfect": "(had)",
    "Conditional Perfect": "(would have)",
};
const renderTenseDescription = (tense) => {
    const description = tenseDescriptions[tense];
return description ? (
    <Text style={{fontSize: 14, marginTop: 10}}>{description}</Text>
) : null;

};
const formatTense = (tense) => {
    return tense.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};
function formatGroupName(groupName) {
    return groupName.split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
}
    const renderConjugationGroup = (groupName, conjugations) => {
          const tensesToExcludeForBeginners = [
        "Conditional Perfect", 
        "Future Perfect", 
        "Past Perfect", 
        "Present Perfect"
    ];
   return (

     <View key={groupName}>
    <Text style={styles.subHeader}>{formatGroupName(groupName)}</Text>
    {Object.entries(conjugations).map(([tense, forms]) => {
        // Exclude specific tenses for beginners
        if (difficulty === "beginner" && tensesToExcludeForBeginners.includes(formatTense(tense))) {
            return null;
        }
        return (
            <View style={styles.verbBlock} key={tense}>
                <Text style={styles.tenseHeader}>
                    {formatTense(tense)}
                    {renderTenseDescription(formatTense(tense))}
                </Text>
                <View style={styles.listContainer}>
                    {Object.entries(forms).map(([form, verb]) => (
                        <Text style={styles.listItem} key={form}>
                            {formMapping[form]} {verb}
                        </Text>
                    ))}
                </View>
            </View>
        );
    })}
</View>

    );
}






const allowedTensesForBeginner = {
    "indicative": ["present", "preterite", "imperfect", "conditional", "future"]
    // Add other main categories and their subcategories if needed in the future
};
 const renderConjugations = (verbData) => {

    

    return (


<View>
    {Object.entries(verbData.useage).map(([groupName, conjugations]) => {
        const [mainCategory, subCategory] = groupName.split("_");
        
        // For beginners, check both main category and subcategory
        if (difficulty === "beginner") {
            if (!allowedTensesForBeginner[mainCategory] || 
                (subCategory && !allowedTensesForBeginner[mainCategory].includes(subCategory))) {
                return null;  // Don't render disallowed tenses
            }
        }

        return renderConjugationGroup(groupName, conjugations);
    })}
</View>
    );
}

const handleSearch = () => {
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    const verbData = dictionaryData[lowercaseSearchTerm];
    const infinitiveEnglish = verbData?.meta?.infinitive_english || "no word found";
    setSearchResult(infinitiveEnglish);
    setDisplayedVerb(verbData);
};


      return (
        <ScrollView style={styles.container}>
            <View style={styles.centered}>
                <Text style={styles.header}>Verb Conjugation Dictionary</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter a word..."
                    value={searchTerm}
                    onChangeText={setSearchTerm} 
                />
                <View style={styles.buttonContainer}>
                    <Button title="Submit" onPress={handleSearch} color="#007AFF" />
                </View>

                <Text style={styles.boldText}>{searchResult}</Text>

                {displayedVerb && renderConjugations(displayedVerb)}
            </View>
        </ScrollView>
    );
}

export default Dictionary;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: 280,
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: 'white',
        marginBottom: 20,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    buttonContainer: {
        width: 200,
        marginBottom: 20,
    },
    subHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 10,
    },
    tenseHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 5,
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#444',
        marginVertical: 10,
    },
    listItem: {
        fontSize: 16,
        color: '#777',
        marginVertical: 4,
    },
});