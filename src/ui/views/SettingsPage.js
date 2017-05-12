//import from system
import React, { Component, PropTypes } from 'react';
import { View, Text, ScrollView, BackAndroid } from 'react-native';

//import from app
import { Toolbar, Card } from 'react-native-material-component';
import { Page } from '../../enums/Page.js';
import { style } from '../../constants/AppStyle.js';
import { IS_LOGGED} from '../../constants/AppConstant.js';
import { setData } from '../../helpers/AsyncStore.js';

const propTypes = {
	navigator: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
	chatList: PropTypes.array.isRequired,
	communications: PropTypes.array.isRequired,
	currentChat: PropTypes.object.isRequired
};

const menuItems = ['Logout'];

class SettingPage extends Component {
	constructor(params) {
		super(params);
		this.state = {
			appInfo: this.props.route.data.appInfo,
		}

		this.addBackEvent = this.addBackEvent.bind(this);
		this.removeBackEvent = this.removeBackEvent.bind(this);
		this.popPage = this.popPage.bind(this);
		this.onRightElementPress = this.onRightElementPress.bind(this);
		this.renderElement = this.renderElement.bind(this);
	}

	componentWillMount() {
		this.addBackEvent();
	}

	componentWillUnmount() {
		this.removeBackEvent();
	}


	addBackEvent() {
		BackAndroid.addEventListener('hardwareBackPress', () => {
			return this.popPage();
		});
	}

	removeBackEvent() {
		BackAndroid.removeEventListener('hardwareBackPress', () => {
			return this.popPage();
		});
	}

	popPage() {
		if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
			if (this.props.route.data.callback)
				this.props.route.data.callback(Page.SETTINGS_PAGE)
			this.props.navigator.pop();
			return true;
		}
		return false;
	}

	onRightElementPress(action) {
		const index = action.index;
		if (index == 0) {
			setData(IS_LOGGED, "false");
			this.props.navigator.resetTo({ id: Page.LOGIN_PAGE.id, name: Page.LOGIN_PAGE.name})
		}
	}

	renderElement() {
		return (
			<ScrollView style={style.container_with_flex_1} keyboardDismissMode='interactive'>
				<Card fullWidth='0'>
					<View style={style.view_with_flex_1_and_margin_all_sides}>
						<Text style={style.text_with_black_color_and_font_size_15}>Kick</Text>
						<Text style={style.text_with_black_color_and_font_size_13}>1.0.0</Text>
					</View>
				</Card>
			</ScrollView>
		)
	}

	render() {
		return (
			<View style={style.container_with_flex_1}>
				<Toolbar
					leftElement="arrow-back"
					centerElement={this.props.route.name}
					onLeftElementPress={() => this.popPage()}
					rightElement={{ menu: { labels: menuItems } }}
					onRightElementPress={(action) => this.onRightElementPress(action)} />
				{this.renderElement()}
			</View>
		)
	}
}

SettingPage.propTypes = propTypes;
export default SettingPage;



