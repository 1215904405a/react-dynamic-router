import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {Link } from 'react-router';
import '../Style/orderclosed';
import {Tool, merged} from '../Tool';
import {Header} from '../Component/common/index';
import URLS from '../constants/urls';
import {Toast,Confirm,AjaxTip} from '../Component/common/Tip';
import {COMMON_HEADERS_POST} from '../constants/headers';
import cookie from 'react-cookie';
import {OrderClosedList} from '../Component/orderClosedList';
import {OrderClosedItemSunCancel} from '../Component/orderClosedItemSunCancel';
/**
 * 模块入口
 * 
 * @className OrderClosed
 * @extends {Component}
 */
class OrderClosed extends Component {
    constructor(props) {
        super(props);
        // Tool.loginChecked(this);
        console.log('代理到本地12...');
        this.getQueryString = (name) => {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            let r = window.location.href.split("?")[1] ? window.location.href.split("?")[1].match(reg) : null;
            if (r != null) return decodeURIComponent(r[2]);
            return "";
        };
        let choseAddress;
        props.address.consigneeName == null || props.address.consigneeName == undefined ? choseAddress = {
            consigneeName: ""
        } : choseAddress = props.address;
        this.state = {
            liuList:[],
            tipContent: '',
            display: '',
            choseAddress: choseAddress,
            setBillData: {
                fptype: this.getQueryString("fptype") || 0,
                fptype1: this.getQueryString("fptype1") || 0,
                fptt: this.getQueryString("fptt") || ""
            },
            ajdata: {
                getLiu: function(e) {
                },
                address: {
                    consigneeName: ""
                },
                totalShipFee: "",
                goodsTotalFee: "",
                orderTotalFee: "",
                storeVOList: [],
                errorGoodsList: []
            },
            isShow: {
                adOn: 'block',
                adOff: 'none'
            },
            confirm: {
                title: "",
                content: "",
                leftText: "取消",
                leftMethod: function() {
                    alert("取消");
                },
                rightText: "确定",
                rightMethod: function() {
                    alert("确定");
                },
                display: "none"
            },
            ajaxDisplay: "block",
            maskDisplay: "block"
            // ,
            // { tipContent: '网络繁忙，请稍后再试',display: 'toasts' }
        };
        let headers = COMMON_HEADERS_POST('tokenid', cookie.load('tokenid')),
            self = this,
            data = {},
            params = "";
        if (this.getQueryString('cartParamJson')) {
            params = JSON.parse(this.getQueryString('cartParamJson'));
            params.addressId=props.address.id;
            params = JSON.stringify(params);
            console.log(params);
        } else {
            params = JSON.stringify({
                "cartFlag": "1",
                "addressId": props.address.id
            });
        }
        //this.setState({ajaxDisplay: "block",maskDisplay: "block"});
        data = {
            url: `${URLS.OrderClosed}`,
            type: "post",
            headers: headers,
            body: params,
            tokenid: cookie.load('tokenid'),
            successMethod: function(json, status) {
                if (status == 200) {
                    //self.setState({ajaxDisplay: "none",maskDisplay: "none"});
                    if (json.address == null) {
                        self.state.isShow.adOn = "none";
                        self.state.isShow.adOff = "block";
                        json.address = self.state.ajdata.address;
                    }
                    self.setState({
                        ajdata: json
                    });
                } else {
                    self.setState({
                        tipContent: json.message,
                        display: 'toasts'
                    });
                }
            }
        }
        Tool.fetch(this, data);
        this.submitOrder = () => {
            //清除记录的数据
            sessionStorage.removeItem("sessionLiuList");
            if (props.address.id == undefined || this.state.ajdata.address.id == undefined) {
                // alert('没地址,调试..');
                return;
            }
            let goodsListVO = [];

            this.state.ajdata.storeVOList.forEach(function(item) {
                item.goodsVOList.forEach(function(it) {
                    goodsListVO.push(it);
                });
            });
            let headers = COMMON_HEADERS_POST('tokenid', cookie.load('tokenid')),
                self = this,
                paramData = {
                    //区分立即购买和购物车
                    "cartFlag":this.getQueryString('cartParamJson')?"":"1",
                    "addressVO": {
                        "addressId": props.address.id || this.state.ajdata.address.id
                    },
                    "couponList": [], //优惠券列表
                    "goodsListVO": goodsListVO,
                    "invoiceVO": {
                        "invoiceClass": this.state.setBillData.fptype1,
                        "invoiceType": this.state.setBillData.fptype,
                        "invoiceHead": this.state.setBillData.fptt,
                    },
                    remarkList:liuList.length==0?this.state.liuList:liuList
                };
            this.setState({ajaxDisplay: "block",maskDisplay: "block"});           
            Tool.fetch(this, {
                url: `${URLS.SubmitOrder}`,
                type: "post",
                body: JSON.stringify(paramData),
                headers: headers,
                successMethod: function(json, status) {
                    // if(status>=500){
                    //     console.log(json);
                    //     return;
                    // }
                    if (json.errorList == undefined) {
                        if (status == 200) {
                            self.setState({ajaxDisplay: "block",maskDisplay: "block"});   
                            Tool.fetch(self, { //获取支付地址
                                url: `${URLS.TOPAY}${json.id}?source=WAP`,
                                type: "post",
                                headers: headers,
                                successMethod: function(json) {
                                    location.href = json.wapPayUrl;
                                }
                            });
                        }
                    } else {
                        let imgStr='';
                        json.errorList.forEach(function(item){
                            imgStr+='<img src="'+item.goodsMainPhoto+'">';
                        });
                        if(json.errorType=="1"){
                            self.setState({
                                confirm: {
                                    title: "以下商品库存不足或已下架，无法继续购买",
                                    content: imgStr,
                                    leftText: "知道了",
                                    rightText: "",
                                    leftMethod: function() {
                                        self.setState({
                                            confirm: {
                                                display: "none"
                                            },
                                            maskDisplay:"none"
                                        });
                                        Tool.history.goBack();
                                    },
                                    display: "block"
                                },
                                maskDisplay:"block"
                            });
                        }else if(json.errorType=="2"){
                            //alert("商品不再配送区域");
                            self.setState({
                                confirm: {
                                    title: "商品不在配送区域",
                                    content: imgStr,
                                    leftText: "知道了",
                                    rightText: "",
                                    leftMethod: function() {
                                        self.setState({
                                            confirm: {
                                                display: "none"
                                            },
                                            maskDisplay:"none"
                                        });
                                    },
                                    display: "block"
                                },
                                maskDisplay:"block"
                            });
                        }else if(json.errorType=="3"){
                            //alert("商品库存不足");
                            self.setState({
                                confirm: {
                                    title: "以下商品库存不足或已下架，无法继续购买",
                                    content: imgStr,
                                    leftText: "知道了",
                                    rightText: "",
                                    leftMethod: function() {
                                        self.setState({
                                            confirm: {
                                                display: "none"
                                            },
                                            maskDisplay:"none"
                                        });
                                        Tool.history.goBack();
                                    },
                                    display: "block"
                                },
                                maskDisplay:"block"
                            });
                        }
                    }
                }
            });
        }
        this.choseAddress = () => {
            Tool.history.push("/address");
        }

        function hasliu(a,b){
            var arry=[];
            var flag=true;
            a.forEach(function(item){
                if(item.supplier_payment==b){
                    flag=false;
                }
            });
            return flag;
        }

        //留言参数
        let sessionLiuList=[],liuList=[];
        this.getLiu = (e) => {
            console.log('获取留言参数');
            var value=e.target.getAttribute('value');
            var supplier_payment=e.target.getAttribute('class');
            console.log(sessionLiuList);
            if(liuList.length>0){
                for(var i=0;i<liuList.length;i++){
                    //修改留言
                    if(liuList[i].supplier_payment==supplier_payment){
                        liuList[i].remark=value;
                        sessionLiuList.forEach(function(item,index){
                            if(item.split('/')[0]==supplier_payment){
                                sessionLiuList.splice(index,1,supplier_payment+'/'+value);
                            }
                        });
                    }else{
                        if(hasliu(liuList,supplier_payment)){
                            liuList.push({'supplier_payment':supplier_payment,'remark':value});
                            sessionLiuList.push(supplier_payment+'/'+value);
                        }
                    }
                }
            //第一条留言输入
            }else{
                liuList.push({'supplier_payment':supplier_payment,'remark':value});
                sessionLiuList.push(supplier_payment+'/'+value);
            }
            console.log(liuList);
            sessionStorage.setItem('sessionLiuList',sessionLiuList.join(','));
        }
        this.goBack = () => {
            self.setState({
                confirm: {
                    title: "",
                    content: "东西这么实惠，真的要离我而去么",
                    leftText: "去意已决",
                    leftMethod: function() {
                        //清除记录的数据
                        sessionStorage.removeItem("sessionLiuList");
                        Tool.history.goBack();
                    },
                    rightText: "我再想想",
                    rightMethod: function() {
                        self.setState({
                            confirm: {
                                display: "none"
                            },
                            maskDisplay:"none"
                        });
                    },
                    display: "block"
                },
                maskDisplay:"block"
            });
        }
        window.onbeforeunload =function (){
            // alert('页面卸载...');
            //清除记录的数据
            sessionStorage.removeItem("sessionLiuList");
        }
        // setTimeout(function(){
        //     backfill();
        // },5000);

    }
    toastDisplay(state) {
        this.setState({
            display: state
        });
    }
    render() {

        let fpInfoShow={
            '0':'不开发票',
            '1':'个人发票',
            '2':'单位发票'
        },fpInfoTypeShow={
            '0':'',
            '2':'电子',
            '1':'纸质'
        },
        linkBill='/setbill?cartParamJson='+this.getQueryString('cartParamJson');
        return (
            <div style={{'height':'100%'}}>
                <header className="common-header">
                    <div className="left-arrow" onClick={this.goBack}>
                        <a>
                            <i></i>
                        </a>
                    </div>
                    <h2 className="title">订单结算</h2>
                </header>
                <div className="orderClose">
                    <div style={{display: this.state.ajdata.storeVOList.length>0?'block':'none'}}>
                    	<div style={{display: this.state.isShow.adOff}} className="address" onClick={this.choseAddress.bind(this)}>
    						<img src={require('../images/orderclosed/add@2x.png')} alt="添加"/> 新增收货地址
    	                </div>

                        <div className="address1" onClick={this.choseAddress.bind(this)}>
                            <img src={require("../images/orderclosed/address@2x.png")}/>
                            <div className="adinfo1">
                                <h3>{this.state.choseAddress.consigneeName!=''&&this.state.ajdata.address!=null?this.state.choseAddress.consigneeName:this.state.ajdata.address.consigneeName}&nbsp;
                                {this.state.choseAddress.consigneeMobile!=undefined&&this.state.ajdata.address!=null?this.state.choseAddress.consigneeMobile:this.state.ajdata.address.consigneeMobile}</h3>
                                <div style={{display: 'table'}}><span style={{width: '.95rem'}}>地址：</span><span className='adinfo1-right'>{this.state.choseAddress.locationInfo!=undefined&&this.state.ajdata.address!=null?this.state.choseAddress.locationInfo+this.state.choseAddress.detailInfo:(this.state.ajdata.address.detailInfo?(this.state.ajdata.address.locationInfo+this.state.ajdata.address.detailInfo):"请选择地址")}</span></div>
                            </div>
                        </div>
    				    <OrderClosedList {...this.state.ajdata} getLiu={this.getLiu.bind(this)}/>
    					<dl className="line">
    						<dt>配送方式</dt>
    						<dd>快递</dd>
    					</dl>
    					<dl className="line fp">
    						<dt>发票</dt>
    						<dd><Link to={linkBill}><span>{fpInfoTypeShow[this.state.setBillData.fptype]}{this.state.setBillData.fptype=='0'?'不开发票':fpInfoShow[this.state.setBillData.fptype1]}<em className="fpttshow">{this.state.setBillData.fptt}</em></span><img src={require("../images/orderclosed/fp@2x.png")}/></Link></dd>

    					</dl>
    					<div className="jinediv">
    						<dl className="line jine">
    							<dt>商品总金额</dt>
    							<dd><span>¥{Tool.toDecimal2(this.state.ajdata.goodsTotalFee)}</span></dd>
    						</dl>
    						<dl className="line jine">
    							<dt>运费</dt>
    							<dd><span>¥{Tool.toDecimal2(this.state.ajdata.totalShipFee)}</span></dd>
    						</dl>
    					</div>
                        <div className="bwtk">
                            备注:虚拟商品不涉及商家发货和确认收货环节
                        </div>
                    </div>
                    <a className="tanm" style={{display: this.state.ajdata.errorGoodsList.length>=1?'inline-block':'none'}}>
                                {
                                    this.state.ajdata.errorGoodsList.map((item,index)=>
                                        <OrderClosedItemSunCancel key={index} {...item}/>
                                    )
                                }
                    </a>
                </div>
            	<div className="bootm">
                <a className="heji"><em style={{'fontSize': '22px'}}></em>合计:<span>¥{Tool.toDecimal2(this.state.ajdata.orderTotalFee)}</span></a>
					<a className="subbtn" onClick={this.submitOrder.bind(this)}>提交订单</a>
				</div>
                <Toast content={this.state.tipContent} display={this.state.display} callback={this.toastDisplay.bind(this)} parent={this} />
				<Confirm  {...this.state.confirm}/>
                <AjaxTip display={this.state.ajaxDisplay} />
                <div className="mask" style={{display: this.state.maskDisplay}}></div>
		
            </div>
        );
    }
    componentDidMount(){
        let self=this;
        //根据id或者样式获取元素
        function $(strExpr) {
            var idExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
            var classExpr = /^(?:\s*(<[\w\W]+>)[^>]*|.([\w-]*))$/;
            if (idExpr.test(strExpr)) {
                var idMatch = idExpr.exec(strExpr);
                return document.getElementById(idMatch[2]);
            } else if (classExpr.test(strExpr)) {
                var classMatch = classExpr.exec(strExpr);
                var allElement = document.getElementsByTagName("*");
                var ClassMatch = [];
                for (var i = 0, l = allElement.length; i < l; i++) {
                    if (allElement[i].className.match(new RegExp("(\\s|^)" + classMatch[2] + "(\\s|$)"))) {
                        ClassMatch.push(allElement[i]);
                    }
                }
                return ClassMatch;
            }
        }
        function backfill(){
            console.log(sessionStorage.getItem('sessionLiuList'));
            if(sessionStorage.getItem('sessionLiuList')!=null){
                let liuList=sessionStorage.getItem('sessionLiuList').split(','),backLiulist=[];
                liuList.forEach(function(item){
                    var obj={};
                    var liuClass=item.split('/')[0];
                    var liuRemark=item.split('/')[1];
                    obj.supplier_payment=liuClass;
                    obj.remark=liuRemark;
                    $('.'+liuClass)[0].value=liuRemark;
                    backLiulist.push(obj);
                });
                self.setState({liuList:backLiulist});
            }
        }
        setTimeout(function(){
            backfill();
        },2000);
    }
}

// export default OrderClosed;

function mapStateToProps(state,ownProps) {
  return {
    address: state.address
  };
}

export default connect(mapStateToProps)(OrderClosed);
process.env.NODE_ENV !== 'production' && module.hot.accept();
