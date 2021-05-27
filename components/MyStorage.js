import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const MyStorage = {
    getItem: async function (key) {
        let item = await AsyncStorage.getItem(key);
        //You'd want to error check for failed JSON parsing...
        return JSON.parse(item);
    },
    setItem: async function (key, value) {
        return await AsyncStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: async function (key) {
        return await AsyncStorage.removeItem(key);
    },
    getImagesList: async function (key) {
        let fetchResult = await fetch(key);
        console.log(fetchResult);
        if(fetchResult.status!=200){
            let item = await AsyncStorage.getItem(key);
            if(item==undefined){
                console.log('ImageList not Network/Cache.');
                return {};
            } else {
                console.log('ImageList from Cache');
                let loadedDataURI = JSON.parse(item);
                await AsyncStorage.removeItem(key);
                return loadedDataURI;
            }    
        } else {
            console.log('ImageList from Network');
            let loadedData = await fetchResult.json();
            let loadedDataURI = loadedData['hits'].map((loadData) => ({ uri: loadData['largeImageURL'] }));
            console.log(loadedDataURI);
            await AsyncStorage.removeItem(key);
            await AsyncStorage.setItem(key, JSON.stringify(loadedDataURI));
            return loadedDataURI;    
        }
    },
    getImageSource: async function (key) {
        console.log('key.uri:', key.uri);
        if(FileSystem.cacheDirectory==undefined || key.uri.startsWith("file")) return key.uri;
        let imageCache =  await AsyncStorage.getItem(key.uri);
        if(imageCache==undefined){
            imageCache = FileSystem.documentDirectory + Math.random().toString(36)+".jpg";
    
                await FileSystem.downloadAsync(
                    key.uri,
                    imageCache
                )
                .then( (uri)  => {
                    console.log('Image network:', {url: key.uri, saveto: uri.uri});
                })
                .catch( (error) => {
                    console.log('Image error:', {url: key.uri, err: error});
                    return key.uri;
                });
           
            let fileCache =  await FileSystem.getInfoAsync(imageCache);
            if(fileCache!=undefined && fileCache.uri!=undefined){
                await AsyncStorage.removeItem(key.uri);
                await AsyncStorage.setItem(key.uri, fileCache.uri);
                return fileCache.uri;
            } else {
                return key.uri;
            }
        } else {
            console.log('Image cache: ', {url: key.uri, source: imageCache});
            return imageCache;
        }
    }
};

export default MyStorage