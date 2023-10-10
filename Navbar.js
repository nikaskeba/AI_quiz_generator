import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';

const Navbar = ({ isUserLoggedIn, setActivePage, activePage }) => {
    return (  
        <View style={styles.navbar}>
            {isUserLoggedIn && (
                <View style={styles.links}>
                    {['home', 'dictionary', 'saved', 'quiz'].map((page) => (
                        <TouchableOpacity 
                            key={page}
                            style={[
                                styles.touchableLink,
                                activePage === page && styles.activeLink
                            ]}
                            onPress={() => setActivePage(page)}
                        >
                            <Text style={styles.link}>
                                {page.charAt(0).toUpperCase() + page.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    links: {
        flexDirection: "row",
     
    },
    touchableLink: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginHorizontal: 5,
        backgroundColor: 'rgba(255,255,255,0.1)',
        ...Platform.select({
            web: {
                cursor: 'pointer',
                transition: 'all 0.3s',
                ':hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                }
            },
        }),
    },
    link: {
        color: 'white',
        fontSize: 16,
        textDecorationLine: "none",
    },
    activeLink: {
        borderColor: 'white',
        borderWidth: 1,
    },
    navbar: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333',
        borderRadius: 0,
        ...Platform.select({
            web: {
           
                boxShadow: '0px 3px 10px rgba(0,0,0,0.1)',
            },
        }),
    },
    navbarText: {
        color: 'white',
        fontSize: 18,
    },
});

export default Navbar;

