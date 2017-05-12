//import from system
import React, { Component } from 'react';
import { Text, View } from 'react-native';

//import from app
import { style } from '../../constants/AppStyle.js';

class Empty extends Component {
	render() {
		return (
			<View style={style.align_center_justify_center}>
				<Text style={style.text_with_black_color_and_font_size_17}> {this.props.message} </Text>
			</View>
		);
	}
}

export default Empty;