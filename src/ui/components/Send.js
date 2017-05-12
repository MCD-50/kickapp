//import from system
import React, { Component } from 'react';
import { TouchableOpacity, View} from 'react-native';

//import from app
import { Icon } from 'react-native-material-component';
import { style } from '../../constants/AppStyle.js';

const propTypes = {
	text: React.PropTypes.string,
	onSend: React.PropTypes.func,
	label: React.PropTypes.string,
	containerStyle: View.propTypes.style,
};

const defaultProps = {
	text: '',
	onSend: () => { },
	label: 'Send',
	containerStyle: {},
};

class Send extends Component {

	render() {
		if (this.props.text.trim().length > 0) {
			return (
				<TouchableOpacity
					style={[style.send_ui_container, this.props.containerStyle]}
					onPress={() => {
						this.props.onSend({ text: this.props.text.trim() }, true);
					}}
					accessibilityTraits="button">
					<View style={style.send_ui_icon}>
						<Icon name='send' color='#0086ff' size={23} />
					</View>
				</TouchableOpacity>);
		}
		return null;
	}
}

Send.propTypes = propTypes;
Send.defaultProps = defaultProps;

export default Send;