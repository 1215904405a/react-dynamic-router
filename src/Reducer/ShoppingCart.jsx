import {SHOPPINGCARTCOUNT} from '../constants/ActionTypes';


/**
 * 初始状态.
 * @type {Object}
 */
const initShoppingCart = {
	count: ""
};

export default function shoppingCart(shoppingCart = initShoppingCart, action) {
  console.log(action);
  switch (action.type) {
  case SHOPPINGCARTCOUNT:
  	// login = merged(action)
    return action;	
  default:
    return shoppingCart;
  }
}

