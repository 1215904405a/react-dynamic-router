import React, {Component, PropTypes} from 'react';
import cookie from 'react-cookie';
import {AddReduce} from '../Component/AddReduce';
import {Tool, merged} from '../Tool';
import URLS from '../constants/urls';
import {COMMON_HEADERS_POST,COMMON_HEADERS} from '../constants/headers';
/**
 * @export
 * @class ShoppingItem
 * @extends {Component}
 */
export class ShoppingItem extends Component {
    constructor(props) {
        super(props);
        this.sx = 0;
        this.sy = 0;
        this.ex = 0;
        this.ey = 0;
    }

    select(){
        if(this.refs.icon.src.match("invalid")){
            return;
        }

        let isLogin = 0,
            uKey = cookie.load('tokenid')?cookie.load('tokenid'):cookie.load('jycart_uKey'),
            groupSkuId = this.props.groupId+"_"+this.props.skuId,
            suitIds = "",
            self = this; 
        if(cookie.load('tokenid'))isLogin = 1;
        this.props.obj.setState({ajaxDisplay: "block",maskDisplay: "block"});
        if(this.itemSelect == "no_select"){
            // self.props.obj.noStock = false;
            Tool.fetch(this.props.obj,{
                url: `${URLS.SELECTITEM}${isLogin}/${uKey}?groupSkuIds=${groupSkuId}&selectAll=0&source=2`,
                type: "put",
                headers: COMMON_HEADERS,
                successMethod: function(json){
                    console.log(json);
                    if(json.data.select == true){
                        self.refs.icon.src = require('../images/shopping/select.png');
                        self.props.obj.selectItem++;
                        self.props.callback2(true,self.props.index);
                        if(self.noStock){
                            self.props.obj.noStock = true;
                        }
                    }
                    if(json.flag == false){
                        self.props.obj.setState({ tipContent: json.msg,display: 'toasts' });
                    }
                }
            });
        }else if(this.itemSelect == "select"){
            Tool.fetch(this.props.obj,{
                url: `${URLS.CONCELITEM}${isLogin}/${uKey}?groupSkuIds=${groupSkuId}&selectAll=0&source=2`,
                type: "put",
                headers: COMMON_HEADERS,
                successMethod: function(json){
                    if(json.flag == true){
                        self.refs.icon.src = require('../images/shopping/no_select.png');
                        self.props.obj.selectItem--;
                        self.props.callback2(false,self.props.index);
                        if(self.noStock){
                            self.props.obj.noStock = false;
                        }                                             
                    }
                    if(json.flag == false){
                        self.props.obj.setState({ tipContent: json.msg,display: 'toasts' });
                    }                    
                }
            });
        }
    }

    toDeail(e){
        e.stopPropagation(); 
        e.preventDefault();
        location.href = `http://m.jyall.com/goods/${this.props.groupId}/${this.props.skuId}.html`;
    }

    touch(event){
        var event = event || window.event; 
   
        switch(event.type){  
            case "touchstart":  
                this.sx = event.touches[0].clientX;  
                this.sy = event.touches[0].clientY;
                break;  
            case "touchend":  
                // alert(event.type);
                this.ex = event.changedTouches[0].clientX;  
                console.log(this.sx);
                console.log(this.ex);
                if(this.sx - this.ex > 40){
                    this.refs.del.className = "delete-cli delete-cli-out";
                }else if(this.sx - this.ex < -40){
                    this.refs.del.className = "delete-cli";
                }
                break;  
            case "touchcancel":  
                // alert(event.type);
                this.ex = event.changedTouches[0].clientX;  
                if(this.sx - this.ex > 40){
                    this.refs.del.className = "delete-cli delete-cli-out";
                }else if(this.sx - this.ex < -40){
                    this.refs.del.className = "delete-cli";
                }
                break;                
            case "touchmove":  
                event.preventDefault();  
                this.ey = event.touches[0].clientY;
                console.log(this.ey-this.sy);
                console.log(this.outScroll.scrollTop);
                this.outScroll.scrollTop = this.outScroll.scrollTop-(this.ey-this.sy);
                this.sy = this.ey;
                break;  
        }          
    }

    delete(e){
        e.stopPropagation(); 
        e.preventDefault();  
        let isLogin = 0,
            uKey = cookie.load('tokenid')?cookie.load('tokenid'):cookie.load('jycart_uKey'),
            groupSkuId = this.props.groupId+"_"+this.props.skuId,
            self = this;      
        if(cookie.load('tokenid') != "undefined")isLogin = 1;   
        this.props.obj.deleteItem({isLogin:isLogin,uKey:uKey,groupSkuId:groupSkuId});             
    }

    componentDidMount(){
        this.outScroll = document.getElementsByClassName("shoppingc-art")[0];
        this.refs.li.addEventListener('touchstart',this.touch.bind(this), false);  
        this.refs.li.addEventListener('touchmove',this.touch.bind(this), false);  
        this.refs.li.addEventListener('touchend',this.touch.bind(this), false);  
        this.refs.li.addEventListener('touchcancel',this.touch.bind(this), false);
        this.refs.del.addEventListener('click',function(e){
            if(e.target.className == "delete"){return;}
            this.className = "delete-cli";
        }, false);
    }
    shouldComponentUpdate(nextProps, nextState) {
          return this.props.select !== nextProps.select;
    }
    render() {
        console.log(this.props);
        let {skuName,mainImg,speczs,sellPrice,state,count,select,status,salesState ,stock } = this.props;
        let icon = (state==1&&status==1&&salesState==2)?(select?require("../images/shopping/select.png"):require("../images/shopping/no_select.png")):require("../images/shopping/invalid.png"),
            width = (state==1&&status==1&&salesState==2&&stock>0)?".4rem":".6rem",
            width2 = (state==1&&status==1&&salesState==2&&stock>0)?"2.6rem":"2.8rem";

        this.itemSelect = "invalid";    
        if(state==1&&status==1&&salesState==2&&select&&count<=stock&&stock > 0){
            this.itemSelect = "select";
            // this.props.obj.selectItem++; 
        }else if(state==1&&status==1&&salesState==2&&!select){
            this.itemSelect = "no_select";

        }
        if(stock==0||salesState==3){//库存为0 或下架
            this.itemSelect = "invalid";
        }      

        this.noStock = false;
        if(count>stock&&this.itemSelect != "invalid"){
            this.noStock = true;
        }   

        return (
            <li ref="li">
    			<span style={{ width: width2 }}>
    			    <img src={icon} className="fl" ref = "icon" style={{ width: width }} onClick={this.itemSelect == "invalid"?"":this.select.bind(this)} />
    			    <div className="main-img"><img src={mainImg?mainImg:require("../images/common/default_icon.png")} style={{width: mainImg?"":"auto"}} className="fl" onClick={this.toDeail.bind(this)} />
                        {this.noStock?(<i className='no-stock'>库存不足（{stock}）</i>):""}
                    </div>
    			</span>
    			<div className = "shopping-content" onClick={this.toDeail.bind(this)}>
    				<p className="item-title">{skuName}</p>
                    <p>{speczs?speczs.map((item) =>item.specName+":"+item.specValueName+" "):(this.itemSelect == "invalid"?'对不起，宝贝已经卖光了':'')} {this.itemSelect == "invalid"?(<i style={{fontStyle:'normal'}} className='fr'>{count}</i>):""}</p>
    				{this.itemSelect == "invalid"?"":(<p>¥{Tool.toDecimal2(sellPrice)}</p>)}
    			</div>
    			{this.itemSelect == "invalid"?"":(<AddReduce num={count} callback={this.props.callback} index={this.props.index} groupSkuId={this.props.groupId+"_"+this.props.skuId} stock={stock} parent={this.props.obj} />)}
                <div className="delete-cli" ref="del"><div className="delete" onClick={this.delete.bind(this)}>删除</div></div>
            </li>
        );
    }
}

// ShoppingItem.propTypes = {//德意（DE&E）269E+170G抽油烟机 环保包邮
//   num: PropTypes.string.isRequired
// }