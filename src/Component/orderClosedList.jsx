import React, {Component, PropTypes} from 'react';
import {OrderClosedListItem} from '../Component/orderClosedItem';
/**
 * @export
 * @class AddReduce
 * @extends {Component}
 */
export class OrderClosedList extends Component {
    constructor(props) {
        super(props);
        this.getLiu = (e) => {
            this.props.getLiu(e);
        }
    }
    render() {
        let {address,couponUserList,goodsTotalFee,orderTotalFee,storeVOList,totalShipFee,getLiu} = this.props;
        
        return (
            <div>
                            {
                                storeVOList.map((item,index)=>
                                    <OrderClosedListItem key={index} {...item} callbackGetLiu={getLiu.bind(this)}/>
                                )
                            }
                            
            </div>
        );
    }
}