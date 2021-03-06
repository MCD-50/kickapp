//import from sysytem
import React, { Component, PropTypes, } from 'react';
import { View, Image, StatusBar, TouchableOpacity, Text } from 'react-native';

//import from app
import { Progress } from 'react-native-material-component';
import { login, checkIfNetworkAvailable } from '../../helpers/InternetHelper.js';
import { SERVER_URL, IS_LOGGED, APP_INFO } from '../../constants/AppConstant.js';
import { getData, setData } from '../../helpers/AsyncStore.js';
import { Page } from '../../enums/Page.js';
import { style } from '../../constants/AppStyle.js';
import { STATUS_BAR_COLOR } from '../../constants/AppColor.js'
import AlertHelper from '../../helpers/AlertHelper.js';
const frappeIcon = require('../../res/appIcon.png');


const propTypes = {
	navigator: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
	chatList: PropTypes.array.isRequired,
	communications: PropTypes.array.isRequired,
	currentChat: PropTypes.object.isRequired
};

class SplashPage extends Component {

	constructor(params) {
		super(params);
		this.state = {
			progress: true,
			error: false,
		}
		this.navigate = this.navigate.bind(this);
		this.renderFooter = this.renderFooter.bind(this);
	}


	componentDidMount() {
		checkIfNetworkAvailable()
		.then((res)=>{
			getData(IS_LOGGED)
			.then((r)=> {
				this.navigate(r);
			})
		}).catch((rej) => {
			this.setState({
				progress: false,
				error: true
			});
			AlertHelper.showAlert('No connection', 'Please check your internet connection.')
		});
	}

	navigate(r) {
		if (r == null || r == "false") {
			const page = Page.LOGIN_PAGE;
			this.props.navigator.replace({ id: page.id, name: page.name })
		} else {
			this.setState({progress:true});
			getData(APP_INFO)
			.then((res)=>{
				res = JSON.parse(res).full_url;
				if (res) {
					login(res)
					.then((x)=>{
						this.setState({progress : false});
						this.props.navigator.replace({ id: Page.ISSUE_LIST.id, name: Page.ISSUE_LIST.name});
					}).catch((rej) => {
						this.setState({ progress: false, error: true });
					});
				} else {
					const page = Page.LOGIN_PAGE;
					this.props.navigator.replace({ id: page.id, name: page.name })
				}
			});
		}
	}

	

	renderFooter() {
		if (this.state.progress) {
			return (<Progress />);
		} else if (this.state.error) {
			return (
				<View style={style.splash_page_footer_outer_view}>
					<View style={{ minWidth: 100, backgroundColor: STATUS_BAR_COLOR }}>
						<TouchableOpacity style={style.splash_page_footer_touchable_opacity}
							onPress={() => this.props.navigator.replace({ id: Page.LOGIN_PAGE.id, name: Page.LOGIN_PAGE.name})}
							accessibilityTraits="button">
							<Text style={style.splash_page_footer_text}>Login</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
		}
		return null;
	}

	render() {
		return (
			<View style={style.container_with_flex_1}>
				<StatusBar backgroundColor='black' barStyle='light-content' />
				<View style={style.splash_page_render_outer_view}>
					<Image source={frappeIcon} style={style.small_image_80_height_and_width} resizeMode="contain" />
					<View style={{ marginTop: 20 }}>
						{this.renderFooter()}
					</View>
				</View>
			</View>
		);
	}
}

SplashPage.propTypes = propTypes;
export default SplashPage;