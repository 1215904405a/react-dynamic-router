import React, {Component, PropTypes} from 'react';
import {Header} from '../Component/common/index';
import '../Style/setbill';
import Cookie from 'react-cookie';
import {Toast,Confirm} from '../Component/common/Tip';
import {OrderClosed} from './OrderClosed';
import {Tool} from '../Tool';
/**
 * 模块入口
 * 
 * @className SetBill
 * @extends {Component}
 */
class SetBill extends Component {
	constructor(props){
		super(props);
		this.getQueryString = (name) => {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            let r = window.location.href.split("?")[1] ? window.location.href.split("?")[1].match(reg) : null;
            if (r != null) return decodeURIComponent(r[2]);
            return "";
        };
		this.state = {
			addressType:true,
			fptype:"0",
			fptype1:"1",
			initClass:{
				has:"active",
				noHas:""
			},
			tipContent:"",
			isShowBg:"none",
			isShowSm:"none",
			display:"none",
			fptt:""
		};
		function siblings(o) {
		    var a = [];
		    var p = o.previousSibling;
		    while (p) {
		        if (p.nodeType === 1) {
		            a.push(p);
		        }
		        p = p.previousSibling
		    }
		    a.reverse();var n = o.nextSibling;
		    while (n) {
		        if (n.nodeType === 1) {
		            a.push(n);
		        }
		        n = n.nextSibling;
		    }
		    return a
		}
		this.getFptype = (e) => {
			//是否开发票,发票大类
			console.log(e.target.innerHTML)
			e.target.setAttribute("class","active");
			siblings(e.target).forEach(function(item){
				item.setAttribute("class","");
			});
			this.setState({fptype:e.target.getAttribute("data-info")});
			this.state.fptype=e.target.getAttribute("data-info");
			if(this.state.fptype!='0'){
				this.setState({isShowBg:"block"});
			}else{
				this.setState({isShowBg:"none"});
			}
			console.log(this.state)
		}
		this.perchange = (e) => {
			//单位还是个人发票
			this.setState({addressType:Boolean(!this.state.addressType)});
			this.state.fptype1=e.target.getAttribute("data-info");
			if(e.target.getAttribute("data-info")=="2"){
				this.setState({isShowSm:"block"});
			}else{
				this.setState({isShowSm:"none"});
			}
			console.log(this.state);
		}
		this.getVal = (e) => {
			//如果是单位发票,抬头不为空
			if(this.state.fptype1=="2"&&this.refs.fptt.value.trim()==""){
				this.setState({tipContent:"抬头不为空",display:"block"});
			}else{
				this.setState({tipContent:"",display:"none"});
				this.setState({fptt:this.refs.fptt.value.trim()});
				let urlParam="/orderclosed?fptype="+this.state.fptype+"&fptype1="+this.state.fptype1+"&fptt="+encodeURIComponent(this.refs.fptt.value.trim())+"&cartParamJson="+this.getQueryString('cartParamJson');
				Tool.history.push(urlParam);
				//location.href="/orderclosed?fptype="+this.state.fptype+"&fptype1="+this.state.fptype1+"&fptt="+encodeURIComponent(this.refs.fptt.value.trim())
			}
			console.log(this.state);
			
		}
	}
	//toast
    toastDisplay(state){  this.setState({display: state}); }
    render() {
        return (
            <div>
            	<Header title="发票" leftIcon="fanhui" />
                    <div className="setBill">
                    	<div className="fptype">
			              	<h3>
			              		发票类型
			              	</h3>
			              	<div  className="typediv" onClick={this.getFptype.bind(this)}>
			              		<a data-info="0" className={this.state.initClass.has}>不需要</a>
			               		<a data-info="2">电子发票</a>
			               		<a data-info="1">纸质发票</a>
			              	</div>
		               </div>
		               <div className="fptype1" style={{display: this.state.isShowBg}}>
			              	<h3>
			              		发票抬头
			              	</h3>
			              	<div className="typediv1">
			              		<a><span data-info="1" className={this.state.addressType ? 'checked' : 'unchecked'} onClick={this.perchange}></span><span>个人</span></a>
			               		<a><span data-info="2" className={!this.state.addressType ? 'checked' : 'unchecked'} onClick={this.perchange}></span><span>单位</span></a>
			               		<p style={{display: this.state.isShowSm}}><input placeholder="单位名称" type="text" ref="fptt" maxLength="50"/></p>
			              	</div>
		               </div>
		               <div className="bootm">
							<a className="confpinfo" onClick={this.getVal}>确定</a>
						</div>
                    </div>
               		<Toast content={this.state.tipContent} display={this.state.display} callback={this.toastDisplay.bind(this)} />
            </div>
        );
    }
}
console.log(OrderClosed);
export default SetBill;
process.env.NODE_ENV !== 'production' && module.hot.accept();