//import from system
import { NetInfo } from 'react-native';

//import from app
import AlertHelper from '../helpers/AlertHelper.js';

export const checkIfNetworkAvailable = () => {
	return NetInfo.isConnected.fetch();
}

export const login = (full_url) => {
	const index = full_url.lastIndexOf('api');
	const ping_url = full_url.substring(0, index) + 'api/method/ping';
	const method = getMethod()

	return fetchUrl(ping_url)
		.then((json) => {
			return fetchUrl(full_url, method)
				.then((json1) => {
					if (json1.message.includes('Incorrect password')) {
						AlertHelper.showAlert('Network request failed.',
							'Incorrect Password, make sure the entered password is correct and try again in a little bit.');
						return Promise.reject();
					} else if (json1.message.includes('User disabled or missing')) {
						AlertHelper.showAlert('Network request failed.',
							'Incorrect Username / Email, make sure the entered email is correct and try again in a little bit.');
						return Promise.reject();
					} else {
						return Promise.resolve(json1)
					}
				}).catch((rej1) => {
					showRejectMessage(null, 'Something went wrong. Please try in a little bit.');
					return Promise.reject();
				});
		}).catch((rej) => {
			showRejectMessage(null, "Please check the domain you enetered.");
			return Promise.reject();
		});
}

export const resolveRequest = (url, data = null) => {
	let form = null
	if (data) {
		form = new FormData();
		form.append('obj', JSON.stringify(data));
	}

	const method = getMethod(form);
	
	return fetchUrl(url, method)
		.then((res) => {
			return Promise.resolve(res);
		})
		.catch((rej) => {
			return Promise.reject(rej)
		});
}

const getMethod = (body = null) => {
	if (body) {
		return {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'multipart/form-data',
			},
			body: body
		}
	} else {
		return {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		}
	}
}

const fetchUrl = (url, method) => {
	return checkIfNetworkAvailable()
		.then((r) => {
			if (method) {
				return fetch(url, method).then((res) => res.json(), (rej) => Promise.reject(rej))
			}
			return fetch(url).then((res) => {
				res.json()
			}, (rej) => Promise.reject(rej))
		}, (rej) => {
			showRejectMessage(rej, null);
			return Promise.reject()
		});
}


const showRejectMessage = (rej, message) => {
	if (rej) {
		AlertHelper.showAlert("Network request failed.",
			"Please check your internet connection and try again.")
	} else {
		AlertHelper.showAlert('Network request failed.', message)
	}
}
