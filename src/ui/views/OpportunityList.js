//import from system
import React, { Component, PropTypes } from 'react';
import { View, Text, ListView, BackAndroid } from 'react-native';
var format = require('string-format')

//import from app
import { Toolbar, Avatar, Progress, ListItem, Badge, Toast } from 'react-native-material-component';
import { Page } from '../../enums/Page.js';
import { APP_INFO, GET_OPPORTUNITY } from '../../constants/AppConstant.js';
import { style } from '../../constants/AppStyle.js';
import { getTextColor, getTitle, getAvatarText, getSubtitle, loadAsync } from '../../helpers/CollectionHelper.js';
import Empty from '../components/Empty.js';
import AlertHelper from '../../helpers/AlertHelper.js';
import Fluxify from 'fluxify';

//socket-io fix
window.navigator.userAgent = "react-native"

const propTypes = {
	navigator: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
	chatList: PropTypes.array.isRequired,
	communications: PropTypes.array.isRequired,
	currentChat: PropTypes.object.isRequired,
};

const menuItems = ['Settings'];

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id });

class OpportunityList extends Component {
	constructor(params) {
		super(params);

		this.state = {
			progress: true,
			dataSource: ds.cloneWithRows([]),
			appInfo: this.props.route.data.appInfo,
		};

		this.addBackEvent = this.addBackEvent.bind(this);
		this.removeBackEvent = this.removeBackEvent.bind(this);
		this.popPage = this.popPage.bind(this);
		this.loadData = this.loadData.bind(this);
		this.setStateData = this.setStateData.bind(this);
		this.callback = this.callback.bind(this);
		this.onRightElementPress = this.onRightElementPress.bind(this);
		this.renderElement = this.renderElement.bind(this);
		this.renderListItem = this.renderListItem.bind(this);
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
				this.props.route.data.callback(Page.OPPORTUNITY_LIST)
			this.props.navigator.pop();
			return true;
		}
		return false;
	}

	shouldComponentUpdate(nextProps, nextState) {
		const chatList = nextProps.chatList.filter((x) => x.naming_series.includes('OPTY')).slice() || []
		if (nextProps !== this.props) {
			setTimeout(() => this.setStateData(chatList), 1000);
		}
		return nextState != this.state;
	}

	componentDidMount() {
		this.loadData();
	}

	setStateData(__list) {
		this.setState({
			dataSource: ds.cloneWithRows(__list),
			progress: false
		});
	}

	loadData() {
		const url = format(GET_OPPORTUNITY, this.state.appInfo.domain);
		const data = { "email": this.state.appInfo.email }
		loadAsync(url, data)
			.then((res) => {
				if (res) {
					console.log(res);
					const chatList = this.props.chatList.filter((x) => x.naming_series.includes('ISS')).slice() || []
					Fluxify.doAction('updateChatList', chatList.concat(res));
				} else {
					this.setState({ progress: false });
				}
			}).catch((rej) => {
				this.setState({ progress: false });
			})
	}

	callback(from_page) {
		//callback related logic
	}

	renderListItem(item) {
		if (typeof item == 'object') {
			const title = getTitle(item, "title", "customer_name");
			return (
				<ListItem
					divider
					leftElement={<Avatar bgcolor={getTextColor(title)} text={getAvatarText(item, "title", "customer_name")} />}
					centerElement={{
						primaryElement: {
							primaryText: title,
						},
						secondaryText: getSubtitle(item, "creation"),
					}}
					onPress={() => {
						const page = Page.CHAT_PAGE;
						this.props.navigator.push({
							id: page.id, name: page.name,
							data: {
								item: item,
								doctype: 'Opportunity',
								callback: this.callback,
								appInfo: this.state.appInfo
							}
						})
					}} />
			);
		}
		return null;
	}

	onRightElementPress(action) {
		const index = action.index;
		if (index == 0) {
			this.props.navigator.push({
				id: Page.SETTINGS_PAGE.id, name: Page.SETTINGS_PAGE.name,
				data: {
					appInfo: this.state.appInfo,
					callback: this.callback,
				},
			});
		}
	}

	renderElement() {
		if (this.state.progress) {
			return (
				<View style={[style.align_center_justify_center, style.container_with_flex_1]}>
					<Progress />
				</View>)
		} else if (!this.state.progress && this.state.dataSource._cachedRowCount > 0) {
			return (
				<ListView
					dataSource={this.state.dataSource}
					keyboardShouldPersistTaps='always'
					keyboardDismissMode='interactive'
					enableEmptySections={true}
					ref={'LISTVIEW'}
					renderRow={(item) => this.renderListItem(item)}
				/>
			);
		} else {
			return (
				<View style={[style.container_with_flex_1, style.align_center_justify_center]}>
					<Empty message={"It's empty in here, try again in little bit."} />
				</View>
			)
		}
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

OpportunityList.propTypes = propTypes;
export default OpportunityList;