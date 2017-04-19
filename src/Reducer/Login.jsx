import {REGISTER,LOGIN,FINDPWDBYMOBILE} from '../constants/ActionTypes';
import merged from 'obj-merged';


/**
 * 初始状态.
 * @type {Object}
 */
const initLogin = {
	password: "",
	tokenid: "",
	roleId: "",
	sex: "",
	name: "",
	photo: "",
	userId: "",
	uuid: ""
};

export default function login(login = initLogin, action) {
  console.log(action);
  switch (action.type) {
  case LOGIN:
  	// login = merged(action)
    return action;	
  case REGISTER:
  	login.uuid = action.register.uuid;
  	login.phone = action.register.phone;
  	login.type = action.type;
    return login;
  case FINDPWDBYMOBILE: 
  	login.pwd = action.findPwd;
  	login.type = action.type;
  	return login;  
  default:
    return login;
  }
}

