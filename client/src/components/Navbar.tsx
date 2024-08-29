import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
const Navbar = () => {
    return (

        <View style={styles.navbar}>
            <Icon name="arrow-forward" size={32} color="white" />

            <Image source={require('../assets/images/eventspace.png')} style={styles.logo} />

            <View style={styles.iconPlaceholder} />
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        height: 60,
        backgroundColor: '#dbdad7',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    logo: {
        width: 100,
        height: 40,
        resizeMode: 'contain',
    },

    iconPlaceholder: {
        width: 32, // This matches the size of the profile icon to maintain symmetry
    },
});

export default Navbar;
