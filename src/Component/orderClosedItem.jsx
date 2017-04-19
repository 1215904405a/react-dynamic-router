import React, {Component, PropTypes} from 'react';
import {OrderClosedListItemSun} from '../Component/orderClosedItemSun';
/**
 * @export
 * @class AddReduce
 * @extends {Component}
 */
export class OrderClosedListItem extends Component {
    constructor(props) {
        super(props);
        this.getLiu = (e) => {
            e.target.setAttribute('value',this.refs.liuyan.value)
            this.props.callbackGetLiu(e);
        }
    }
    render() {
        //let {address,couponUserList,goodsTotalFee,orderTotalFee,storeVOList,totalShipFee} = this.props;
        let {goodsVOList,payType,storeId,getLiu}=this.props;
        console.log(getLiu);
        return (
                            <a className="tanm">
                                {
                                    this.props.goodsVOList.map((item,index)=>
                                        <OrderClosedListItemSun key={index} {...item}/>
                                    )
                                }
                                <div className="liu"><label>留言:</label>
                                    <input className={storeId+"_"+payType}  type="text" maxLength="200" ref="liuyan" onBlur={this.getLiu.bind(this)}/>
                                </div>
                            </a>
        );
    }
}