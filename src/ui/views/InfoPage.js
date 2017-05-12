//import from system
import React, { Component, PropTypes } from 'react';
import { View, Text, ScrollView, BackAndroid } from 'react-native';

//import from app
import { Toolbar, Card, Avatar } from 'react-native-material-component';
import { Page } from '../../enums/Page.js';
import { style } from '../../constants/AppStyle.js';
import { STATUS_BAR_COLOR } from '../../constants/AppColor.js'
import { getTextColor, getTitle, getAvatarText, capitalize } from '../../helpers/CollectionHelper.js';

const propTypes = {
	navigator: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
	chatList: PropTypes.array.isRequired,
	communications: PropTypes.array.isRequired,
	currentChat: PropTypes.object.isRequired
};


class InfoPage extends Component {
	constructor(params) {
		super(params);
		this.state = {
			item: this.props.route.data.item,
			appInfo: this.props.route.data.appInfo,
		}

		this.addBackEvent = this.addBackEvent.bind(this);
		this.removeBackEvent = this.removeBackEvent.bind(this);
		this.popPage = this.popPage.bind(this);
		this.getCardViews = this.getCardViews.bind(this);
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
				this.props.route.data.callback(Page.INFO_PAGE)
			this.props.navigator.pop();
			return true;
		}
		return false;
	}

	getCardViews() {
		return Object.keys(this.state.item).map((key) => {
			if(key.startsWith('_') || key == "docstatus" || key == "idx" || key == "mins_to_first_response"){
				return null
			}
			return (
				<View key={key} style={style.view_with_flex_1_and_margin_all_sides}>
					<Text style={style.text_with_black_color_and_font_size_15}>{capitalize(key)}</Text>
					<Text style={style.text_with_black_color_and_font_size_13}>{capitalize(this.state.item[key])}</Text>
				</View>
			)
		}).filter((item)=> item != null || item != undefined);
	}

	renderElement() {
		return (
			<View style={style.container_with_flex_1}>
				<View style={[{ backgroundColor: STATUS_BAR_COLOR, height: 68, marginBottom: 2 }]}>
					<View style={[style.view_with_flex_1_and_margin_all_sides, { flexDirection: 'row' }]}>
						<View>
							<Avatar size={55} bgcolor={getTextColor(this.state.item.name)} text={getAvatarText(this.state.item, "name", null)} />
						</View>
						<View style={style.translucent_toolbar_view}>
							<Text style={style.text_with_margin_bottom_and_font_size_19}>{this.state.item.name}</Text>
						</View>
					</View>
				</View>
				<ScrollView keyboardDismissMode='interactive'>
					<Card fullWidth='0'>
						{this.getCardViews()}
					</Card>
				</ScrollView>
			</View>)
	}

	render() {
		return (
			<View style={style.container_with_flex_1}>
				<Toolbar
					leftElement="arrow-back"
					centerElement={""}
					onLeftElementPress={() => this.popPage()}
					translucent={true} />
				{this.renderElement()}
			</View>
		)
	}
}

InfoPage.propTypes = propTypes;
export default InfoPage;