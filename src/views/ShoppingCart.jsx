import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { Link } from 'react-router';
import {Header,Downloadapp} from '../Component/common/index';
import '../Style/shoppingcart';
import {ShoppingItem} from '../Component/ShoppingItem';
import {Tool, merged} from '../Tool';
import URLS from '../constants/urls';
import {COMMON_HEADERS} from '../constants/headers';
import {shoppingCartCount} from '../Action/ShoppingCart';
import {address} from '../Action/Address';
import {Toast,Confirm,AjaxTip} from '../Component/common/Tip';
import {ONLINE} from '../constants/common';

/**
 * 模块入口
 * 
 * @class ShoppingCart
 * @extends {Component}
 */
class ShoppingCart extends Component {
	constructor(props) {
        
        super(props);
        console.log(this.props);
        this.props.saveAddressInfo({id:""});
        this.state = {
            title: "购物车",
            list: [],
            allMoney: 0,
            allNum: 0,
            tipContent: '',
            display: '',
            nolist: 'none',
            recommentList: [],
            uKey: "",
            confirm: {
                title: "以下商品不足或已下架，无法被购买您可以继续结算其他商品",
                content: "<img src='http://image1.jyall.com/v1/tfs/T1QyWTBjWg1RXrhCrK.jpg' /><img src='http://image1.jyall.com/v1/tfs/T1QyWTBjWg1RXrhCrK.jpg' />", 
                leftText: "取消",
                leftMethod: function(){
                    alert("取消");
                },
                rightText: "确定",
                rightMethod: function(){
                    alert("确定");
                },
                display: "none"
            },
            ajaxDisplay: "block",
            maskDisplay: "block"
        };

        let self = this;
        this.onOut = false;
        Tool.loginChecked(this,function(){
            self.onOut = true;
        });        
        this.count = 0;
        this.selectItem = 0;//选中的个数
        this.validCount = 0;//可以选择的个数
    }

    toastDisplay(state){
        this.setState({
          display: state
        });
    }

    //给子组件回调 数量加减
    shoppingCartCount(data){ 
        if(data.more){
            this.setState({ tipContent: data.message,display: 'toasts' });return;
        }
        let list = this.state.list,
            self = this,
            allItem = 0;
        this.allMoney = 0;
        this.allNum = 0;
        list[data.index].count = data.num;

        list.map(item => {
            if(item.state==1&&item.status==1&&item.salesState==2&&item.select){
                self.allMoney += item.count*item.sellPrice;
                self.allNum += item.count;
            }
            allItem += item.count;
        })

        this.setState({
            list: list,
            title: "购物车("+ (allItem>999?'999+':allItem) +")",
            allMoney: self.allMoney,
            allNum: self.allNum
        });
    }

    //给子组件回调 每项选择结算
    selectStatement(select,index){
        let list = this.state.list;
        list[index].select = select;
        let self = this;
        self.allMoney = 0;
        self.allNum = 0;
        list.map(item => {
            if(item.state==1&&item.status==1&&item.salesState==2&&item.select){
                self.allMoney += item.count*item.sellPrice;
                self.allNum += item.count;
            }
        })
        this.setState({list: list,allMoney: self.allMoney,allNum: self.allNum});
    }

    selectAll(){//全选
        if(this.validCount <= 0){
            this.setState({tipContent: '没有有效商品！',display: 'toasts'});
            return;
        }
        let list = this.state.list,
            selectAll = this.refs.selectAll,
            selectControl = false,
            self = this;
        self.allMoney = 0;
        self.allNum = 0;

        let isLogin = 0,
            uKey = cookie.load('tokenid')?cookie.load('tokenid'):cookie.load('jycart_uKey');
        if(cookie.load('tokenid'))isLogin = 1;

        self.setState({ajaxDisplay: "block",maskDisplay: "block"});
        if(selectAll.className.match("selectall")){
            Tool.fetch(this,{
                url: `${URLS.CONCELITEM}${isLogin}/${uKey}?selectAll=1`,
                type: "put",
                headers: COMMON_HEADERS,
                successMethod: function(json){
                    if(json.flag == true){
                        selectAll.className = "no-select-all";
                        selectControl = false;
                        self.selectItem = 0;
                        result();
                    }
                }
            });
        }else {
            Tool.fetch(this,{
                url: `${URLS.SELECTITEM}${isLogin}/${uKey}?selectAll=1`,
                type: "put",
                headers: COMMON_HEADERS,
                successMethod: function(json){
                    if(json.data.select == true){
                        selectAll.className = "no-select-all selectall";
                        selectControl = true;
                        self.selectItem = self.validCount;
                        result();
                    }
                    if(json.flag == false){
                        self.setState({tipContent: json.msg,display: 'toasts',});
                    }
                }
            });
        }

        let result = function(){
            list.map(item => {
                if(item.state==1&&item.status==1&&item.salesState==2&&item.stock>0&&item.count <= item.stock){
                    item.select = selectControl;
                    if(selectControl){

                        self.allMoney += item.count*item.sellPrice;
                        self.allNum += item.count;
                    }
                }
            })
            self.setState({list: list,allMoney: self.allMoney,allNum: self.allNum});
        }

    }

    statement(e){ //结算
        e.stopPropagation(); 
        e.preventDefault();
        var self = this;
        // this.setState({
        //     confirm : {
        //         title: "",
        //         content: "去app端购买有机会享优惠哦~",
        //         leftText: "取消",
        //         leftMethod: ()=>{
        //             self.setState({maskDisplay: 'none',confirm : {display : 'none'}});
        //         },
        //         rightText: "确定",
        //         rightMethod: ()=>{
        //             self.setState({maskDisplay: 'none',confirm : {display : 'none'}});
        //         },
        //         rightClass: "j-downAppBtn",
        //         display: "block"
        //     },
        //     maskDisplay: "block"
        // }); 
        if(this.selectItem <= 0){
            this.setState({tipContent: '请选择商品',display: 'toasts',});
            return;
        } 
        if(this.noStock){
            this.setState({tipContent: '库存不足',display: 'toasts',});
            return;            
        }
        if(this.onOut){
            Tool.history.push("/");   
        }else{
            Tool.history.push("/orderclosed");
        }
             
    }

    deleteItem(data){
        let self = this;
        this.setState({
            confirm : {
                title: "确定删除此商品吗？",
                content: "",
                leftText: "取消",
                leftMethod: ()=>{
                    self.setState({maskDisplay: 'none',confirm : {display : 'none'}});
                },
                rightText: "确定",
                rightMethod: ()=>{
                    Tool.fetch(self,{
                        url: `${URLS.REMOVEITEM}${data.isLogin}/${data.uKey}/${data.groupSkuId}?source=2`,
                        type: "delete",
                        headers: COMMON_HEADERS,
                        successMethod: function(json,status){
                            if(json.flag == true){
                                self.setState({maskDisplay: 'none',confirm : {display : 'none'}});
                                location.reload();
                            }
                        }
                    }); 
                },
                display: "block"
            },
            maskDisplay: "block"
        }); 
    }

    componentDidUpdate(){
        if(this.selectItem>0 && this.selectItem == this.validCount){
            this.refs.selectAll.className = "no-select-all selectall";
        }else{
            this.refs.selectAll.className = "no-select-all";
        }
    }  
    // shouldComponentUpdate(nextProps, nextState) {
    //       return this.state.ajaxDisplay !== nextState.ajaxDisplay;
    // }
    componentDidMount(){
        let headers = COMMON_HEADERS(),
            self = this;
        let params = cookie.load('tokenid')?("&tokenId="+cookie.load('tokenid')):(cookie.load('jycart_uKey')?"&uKey="+cookie.load('jycart_uKey'):'');
        self.setState({ajaxDisplay: "block",maskDisplay: "block"});
        Tool.fetch(this,{
            url: `${URLS.QUERYCART}?source=2${params}`,
            type: "get",
            body: "",
            headers: headers,
            successMethod: function(json){
                if(!json.cartItems){//未登录 游客
                    var cookieObj = { expires:new Date("2100-01-01"),path:"/",domain:(ONLINE?"jyall.com":"") }
                    cookie.save('jycart_uKey', json.uKey, cookieObj);
                    self.setState({uKey: json.uKey});
                    json.cartItems = [];
                }
                self.allMoney = 0;
                self.allNum = 0;
                json.cartItems.map(item => {
                    if(item.state==1&&item.status==1&&item.salesState==2&&item.select){
                        self.allMoney += item.count*item.sellPrice;
                        self.allNum += item.count;
                    }
                })

                // if(json.totalGoodsCount > 999){json.totalGoodsCount = "999+";}
                self.totalCount = json.totalGoodsCount;
                // json.cartItems = [];
                if(json.cartItems.length == 0){
                    // self.setState({ajaxDisplay: "block",maskDisplay: "block"});
                    Tool.fetch(self,{
                        url: `${URLS.RECOMMENDGOODS}1?userId=${cookie.load("userId")}&num=4`,
                        type: "get",
                        headers: COMMON_HEADERS,
                        successMethod: function(json,status){
                            if(status == 200){
                                self.setState({recommentList:json});
                            }
                        }
                    });
                }
                self.setState({ 
                    list: json.cartItems,
                    title: "购物车"+(self.totalCount>0?"("+ (self.totalCount>999?'999+':self.totalCount) +")":""),
                    allMoney: self.allMoney,
                    allNum: self.allNum,
                    nolist: json.cartItems.length==0?"block":"none"
                });

                let selectAll = 0;
                // for(let i of json.cartItems){
                json.cartItems.forEach(function(i){
                    if(i.state==1&&i.status==1&&i.salesState==2&&i.stock>0&&i.count <= i.stock){
                        selectAll++;
                        if(i.select){
                            self.selectItem++;
                        }
                        self.validCount++;
                    }
                });    

                // }
                if(self.selectItem>0 && self.selectItem == selectAll){
                    self.refs.selectAll.className = "no-select-all selectall";
                }else{
                    self.refs.selectAll.className = "no-select-all";
                }  
            }
        });        
        Downloadapp(this);//跳转下载
    }
    render() {
        return (
            <div style={{height: '100%'}}>
                <Header title={this.state.title} leftIcon="fanhui" />
                <div className="shoppingc-art">
                	<ul>
                	    {
                            this.state.list.map((item,index) =>
					            <ShoppingItem key={index} index={index} callback={this.shoppingCartCount.bind(this)} callback2={this.selectStatement.bind(this)} {...item} obj={this}/>
					        )
                        }
                	</ul>
                	<footer onClick={this.selectAll.bind(this)}>
                		<span className="no-select-all" ref="selectAll">全选</span>
                		<div className="fr">合计:<span style={{color: "#cc0000",marginRight: ".2rem"}}>¥{Tool.toDecimal2(this.state.allMoney)}</span><a href="javascript:;"><b className="statement" onClick={this.statement.bind(this)}>结算(<span>{this.state.allNum}</span>)</b></a></div>
                	</footer>
                </div>
                <NoList display={this.state.nolist} recommentList={this.state.recommentList} />
                <Toast content={this.state.tipContent} display={this.state.display} callback={this.toastDisplay.bind(this)} parent={this} />
                <Confirm  {...this.state.confirm}/>
                <AjaxTip display={this.state.ajaxDisplay} />
                <div className="mask" style={{display: this.state.maskDisplay}}></div>
            </div>
        );
    }
}


//没有数据时的显示
var NoList = React.createClass({

  render: function() {
    return (
        <div style={{ display: this.props.display }} className="no-list">
            <div style={{ background: "#fff",padding: ".8rem 0 1.2rem" }}>
                <img src={require("../images/shopping/empty_shopping.png")} />
                <p>购物车里还什么都没有<br/>赶快去逛逛吧~ <br/></p>
                <a href="http://m.jyall.com"><button>去看看</button></a>
            </div>
            <div className="like-floor">
                <h3><span>为您推荐</span></h3>
                <ul className="lf-list" ref = "ulList">
                    {
                        this.props.recommentList.map((item,index) =>(
                            <li key={index}>
                                <a className="clearfix" href={item.mURL}>
                                    <div className="lf-thumb">
                                        <img src={item.image} title="" />
                                    </div>
                                    <div className="lf-tit">
                                        <h6>{item.name}</h6>
                                        <p>¥ {item.price}</p>
                                    </div>
                                </a>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
  }
});

// export default ShoppingCart;  

function mapStateToProps(state,ownProps) {
  return {
    address: state.address
  };
}
function mapDispatchToProps(dispatch) {  
  return {
    saveAddressInfo: (user) => {
        dispatch(address(user));
    }
  };
}
export default connect(mapStateToProps,mapDispatchToProps)(ShoppingCart);
process.env.NODE_ENV !== 'production' && module.hot.accept();