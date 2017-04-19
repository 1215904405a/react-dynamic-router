import { ADDRESS } from '../constants/ActionTypes';

export const address = (address) => {
  address.type = ADDRESS;	
  return address;
}