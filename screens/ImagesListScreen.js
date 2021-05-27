import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Dimensions, Platform, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import ImageSettings from "../components/ImageSettings";

import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import MyStorage from '../components/MyStorage';

const arraySubSplitter = (arr = [], maxArrSize = 9) => {
    const result = [];
    for (let i = 0; i < Math.ceil(arr.length / maxArrSize); i++) {
        result[i] = arr.slice(i * maxArrSize, (i * maxArrSize) + maxArrSize);
        for(let j = 0; j<9; j++){
            (async () => {
                let b = await MyStorage.getImageSource(result[i][j]);
                result[i][j].uri = b;
            })();
        }
    }
    return result;
};

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

function MainScreen({ navigation }) {

    const styles = StyleSheet.create({
        addIcon: {
            textAlign: 'right',
            marginHorizontal: 16,
            marginBottom: 5,
            marginTop: 2,
            color: '#3076CB'
        },

        container: {
            marginTop: StatusBar.currentHeight,
            backgroundColor: 'white',
            flex: 1,
            borderWidth: 1,
            borderColor: 'white',

        },

        textContainer: {
            flex: 1,
            marginTop: '40%'
        },

        text: {
            textAlign: 'center',
            backgroundColor: 'white',
            fontSize: 15,

        },

    });
    
    const [imageStore, setImageStore] = useState([]);
    const [dimensions, setDimensions] = useState({ window, screen });

    const onChange = ({ window, screen }) => {
        setDimensions({ window, screen });
    };

    useEffect(() => {
        Dimensions.addEventListener("change", onChange);
        return () => {
            Dimensions.removeEventListener("change", onChange);
        };
    });


    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={pickImage}>
                    <MaterialCommunityIcons style={styles.addIcon} name="plus" color={'#808082'} size={30} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);


    useEffect(() => {
       const url = `https://pixabay.com/api/?key=19193969-87191e5db266905fe8936d565&q=yellow+flowers&image_type=photo&per_page=27`;
        
        (async () => {
            //const fetchResult = await fetch(url);
            //const loadedData = await fetchResult.json();
            //const loadedDataURI = loadedData['hits'].map((loadData) => ({ uri: loadData['largeImageURL'] }));
            //await MyStorage.removeItem(url);
            //await MyStorage.setItem(url, loadedDataURI);
            const loadedDataURI = await MyStorage.getImagesList(url);
            setImageStore(loadedDataURI);
        })();
    }, []);


    const pickImage = async () => {
        let pickedImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
        });

        if (!pickedImage.cancelled) {
            let imageSource = await MyStorage.getImageSource(pickedImage.uri);
            setImageStore(prevState => [...prevState, { uri: imageSource }])
        }
    };

    const imageSize = {
        width: dimensions.window.width / 3 ,
        height: dimensions.window.width / 3,
    }



    const ImageSettingsComponent = arraySubSplitter(imageStore).map(
        image => (
            <ImageSettings
                key={image[0].uri}
                imageStore={image}
                width={imageSize.width}
                height={imageSize.height}
            />
        )
    );

    return (
        <SafeAreaView style={styles.container}>
            {
                imageStore.length === 0 ?
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>No items found!</Text>
                    </View> :
                    <ScrollView>
                        {ImageSettingsComponent}
                    </ScrollView>
            }

        </SafeAreaView>
    );
}

const Stack = createStackNavigator();

export default function ImagesListScreen() {

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('You need camera permission to make this move');
                }
            }
        })();
    }, []);


    return (
        <Stack.Navigator initialRouteName="Images">
            <Stack.Screen name="Images" component={MainScreen} />
        </Stack.Navigator>
    );
}