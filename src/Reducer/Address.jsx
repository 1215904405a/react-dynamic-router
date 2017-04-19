import {ADDRESS} from '../constants/ActionTypes';

/**
 * 初始状态.
 * @type {Object}
 */
const initAddress = {
  id: ""
};

export default function address(address = initAddress, action) {
  switch (action.type) {
  case ADDRESS:
    return action;	
  default:
    return address;
  }
}