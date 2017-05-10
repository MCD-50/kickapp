//import from system
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';


export const getData = async (key) => {
	try {
		return await AsyncStorage.getItem(key);
	} catch (error) {
		return null;
	}
}

export const setData = async (key, data) => {
	try {
		await AsyncStorage.setItem(key, typeof data == 'object' ? JSON.stringify(data) : data);
	} catch (error) {
		console.log(error);
	}
}



