//import from app
import { CARROT, PETER_RIVER, WISTERIA, ALIZARIN, TURQUOISE, MIDNIGHT_BLUE } from '../constants/AppColor.js';
import { resolveRequest } from './InternetHelper.js';
var format = require('string-format')

export const getAvatarText = (item, key, s_key) => {
	const str = item[key] ? item[key] : item[s_key] || "Unknown";
	return (str.length > 1) ? str[0].toUpperCase() + str[1].toUpperCase() : (str.length > 0 ? str[0].toUpperCase() : 'UN');
}

export const getTitle = (item, key, s_key) => {
	return item[key] ? item[key] : item[s_key];
}

export const getSubtitle = (item, key) => {
	if (key == 'creation') {
		return item[key] ? item[key].toString().split(' ')[0] : 'No description provided for this item.';
	}
	return item[key] ? item[key] : 'No description provided for this item.';
}

export const getTextColor = (str) => {
	if (!str) {
		return WISTERIA;
	}
	const array = [CARROT, PETER_RIVER, WISTERIA, ALIZARIN, TURQUOISE, MIDNIGHT_BLUE];
	return array[str.length % array.length];
}

export const capitalize = (str) => {
	if (str) {
		let pieces = str.split(/_| /);
		for (let i = 0; i < pieces.length; i++) {
			let j = pieces[i].charAt(0).toUpperCase();
			pieces[i] = j + pieces[i].substr(1);
		}
		return pieces.join(" ").trim();
	}
	return "Unknown";
}

export const loadAsync = (url, data) => {
	return resolveRequest(url, data)
		.then((res) => {
			if (res && res.message && res.message.length > 0) {
				return Promise.resolve(res.message)
			} else {
				return Promise.reject();
			}
		}).catch((rej) => {
			return Promise.reject(res);
		})
}

export const convertToAirchatObject = (communications) => {
	return communications
		.filter((communication) => communication.sender != null || communication.sender != undefined)
		.map((communication) => {
			return {
				_id: Math.round(Math.random() * 1000000),
				text: communication.content.trim() || "",
				createdAt: communication.creation.split('.')[0],
				user: {
					_id: communication.sender,
					name: communication.sender,
				},
				communication: communication,
				attachments: []
			}
		});
}


export const createIssueChatAlert = (item) => {
	return [{
		_id: Math.round(Math.random() * 1000000),
		text: item.subject.trim() ? item.subject.trim() : item.description.trim() || "No information provide",
		createdAt: item.creation.split('.')[0],
		user: {
			_id: item.raised_by,
			name: item.raised_by,
		},
		alert: true,
		communication: null,
		attachments: []
	}]
}

