import {ORDER} from '../constants/ActionTypes';

/**
 * 初始状态.
 * @type {Object}
 */
const initOrder = {
  orderId: ""
};

export default function order(order = initOrder, action) {
  console.log(action);
  switch (action.type) {
  case ORDER:
    return action;	
  default:
    return order;
  }
}