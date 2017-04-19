import cookie from 'react-cookie';
/**
 * 通用头信息-GET.
 */
export function COMMON_HEADERS(key, value) {
	let result = {
		"content-type": "application/json",
		"sign": "50970DC4C28118A4F76411505B277B7D",
		"deviceid": "M",
		"tokenid": cookie.load('tokenid'),
		"APPkey": "b40538ab5bef1ffd18605efda7f820d9",
		"version": "2.0.0"
	};

	key && (result[key] = value);
	return result;
}

/**
 * 通用头信息-POST.
 */
export function COMMON_HEADERS_POST(key, value){
	let result = {
		// "content-type": "application/x-www-form-urlencoded"  //post默认
		"content-type": "application/json",
		"sign": "50970DC4C28118A4F76411505B277B7D",
		"deviceid": "M",
		"tokenid": cookie.load('tokenid'),
		"APPkey": "b40538ab5bef1ffd18605efda7f820d9",
		"version": "2.0.0"
	};

	key && (result[key] = value);
	return result;
}

// export let SIGN = "97EAC9AE44F9D5C1F53DABC1F5C156BF"//
export let SIGN = "BAD3426489851754C1C14A46A22ABF82"