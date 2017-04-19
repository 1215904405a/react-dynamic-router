import {ORDER} from '../constants/ActionTypes';

export const order = (order) => {
  order.type = ORDER;
  return order;
}