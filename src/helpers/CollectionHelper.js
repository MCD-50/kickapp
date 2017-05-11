//import from app
import { CARROT, PETER_RIVER, WISTERIA, ALIZARIN, TURQUOISE, MIDNIGHT_BLUE } from '../constants/AppColor.js';


export const getAvatarText = (item, key, s_key) => {
	const str =  item[key] ? item[key] : item[s_key];
	return (str.length > 1) ? str[0].toUpperCase() + str[1].toUpperCase() : (str.length > 0 ? str[0].toUpperCase() : 'UN');
}

export const getTitle = (item, key, s_key) => {
	return  item[key] ? item[key] : item[s_key];
}

export const getSubtitle = (item, key) => {
	return item[key] ? item[key] : 'No description provided for this.';
}

export const getTextColor = (str) => {
	if (!str) {
		return WISTERIA;
	}
	const array = [CARROT, PETER_RIVER, WISTERIA, ALIZARIN, TURQUOISE, MIDNIGHT_BLUE];
	return array[str.length % array.length];
}