import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Header } from '../Component/common/index';
import { Tool } from '../Tool';
import { COMMON_HEADERS } from '../constants/headers';
import URLS from '../constants/urls';
import '../Style/expressInfo';

/**
 * 模块入口 物流详情
 *
 * @class ExpressInfo
 * @extends {Component}
 */
class ExpressInfo extends Component {
  constructor(props) {

    super(props);
    console.log(this.props);
    this.state = {
      tipContent: '',
      display: '',
      list: [],
      expressName: '',
      expressCode: '',
      mainPic: '',
      productTotalCount: ""

    };

    let headers = COMMON_HEADERS();
    let self = this;

    Tool.fetch(this, {
      url: `${URLS.EXPRESSINFO}${this.props.order.orderId}`, //343753222508003905
      type: "get",
      headers: COMMON_HEADERS,
      successMethod: function(json, status) {
        if (status == 200) {
          self.setState({
            list: json.shippingInfoList,
            mainPic: json.mainPic,
            productTotalCount: json.productTotalCount,
            expressName: json.expressName,
            expressCode: json.expressCode
          });
        }
      }
    });
  }
  render() {
    return (
      <div className="express-info">
                <Header title="物流详情" leftIcon="fanhui" />
                <div>
                    <div className="goods">
                         <div className="left">
                              <img src={this.state.mainPic} />
                              <span>{this.state.productTotalCount}件商品</span>
                         </div>
                         <div className="right">
                              <p><span>承运公司</span> &nbsp;<span>{this.state.expressName}</span></p>
                              <p><span>运单编号</span> &nbsp;<span>{this.state.expressCode}</span></p>
                         </div>
                    </div>
                    <div className="progress">
                         <header>物流跟踪</header>
                         <ul>
                          {
                              this.state.list.map((item,index) =>{
                                if(index == 0){
                                  return(
                                    <li key={index} className = "first-list">
                                      <div className="left-icon">
                                        <span><i></i></span>
                                      </div>
                                      <div style={{width: ".42rem"}}></div>
                                      <div className="right-content">
                                        {item.context}<br />
                                        {item.time}
                                      </div>
                                    </li>
                                  )
                                }else{
                                  return(  <li key={index}>
                                      <div className="left-icon">
                                        <span></span>
                                      </div>
                                      <div style={{width: ".42rem"}}></div>
                                      <div className="right-content">
                                        {item.context}<br />
                                        {item.time}
                                      </div>
                                    </li>
                                  )
                                }
                              })
                          }
                         </ul>
                    </div>
                </div>
            </div>
    );
  }
}

// export default ExpressInfo;
function mapStateToProps(state, ownProps) {
  return {
    order: state.order
  };
}

export default connect(mapStateToProps)(ExpressInfo);
process.env.NODE_ENV !== 'production' && module.hot.accept();
