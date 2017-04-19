import {SHOPPINGCARTCOUNT} from '../constants/ActionTypes';

export const shoppingCartCount = (count) => {
  return {
    type: SHOPPINGCARTCOUNT,
    count
  }
}