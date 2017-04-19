import React, {Component, PropTypes} from 'react';
/**
 * @export
 * @class AddReduce
 * @extends {Component}
 */
export class OrderClosedItemSunCancel extends Component {
    render() {
        //let {address,couponUserList,goodsTotalFee,orderTotalFee,storeVOList,totalShipFee} = this.props;
        console.log('订单结取消页面...');
        console.log(this.props);
        let {skuStatusCode,stock,goodsName,goodsMainPhoto,goodsPrice,storePrice,count,spec,goodSpec}=this.props;
        console.log(spec);console.log(goodSpec);
        return (
                            <dl className="clearfix">
                                    <dt>
                                        <img src={goodsMainPhoto}/>
                                        <span>{skuStatusCode==1?'库存不足('+stock+')':'已失效'}</span>
                                    </dt>
                                    <dd>
                                        <p>{goodsName}<br/><span>{spec==undefined?goodSpec:spec}</span></p>
                                        <p className="price">¥ {storePrice}<br/><span>x{count}</span></p>
                                    </dd>
                                    <p className="sxp">{skuStatusCode==1?'购买的数量超过了库存':'对不起,宝贝已经卖光了'}</p>
                            </dl>
        );
    }
}