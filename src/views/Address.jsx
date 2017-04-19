import React,{Component,PropTypes} from 'react';
import { connect } from 'react-redux';
import {Link } from 'react-router';
import Cookie from 'react-cookie';
import URLS from '../constants/urls.js';
import {Header} from '../Component/common/index';
import {AddressItem} from '../Component/addressItem';
import {Tool, merged} from '../Tool';
import {Toast,Confirm,AjaxTip} from '../Component/common/Tip';
import {COMMON_HEADERS_POST} from '../constants/headers';
import '../Style/address';
import {address} from '../Action/Address';

class Address extends Component {
	constructor(props){
		super(props);
		// Tool.loginChecked(this);
		this.state = {
			userId : Cookie.load('userId'),
			display : '',
			tipContent: '',
			nolist : 'block',
			addressMsg : [],
			confirm: {
            	title: "",
            	content: "", 
            	leftText: "取消",
            	leftMethod: null,
            	rightText: "确定",
            	rightMethod: null,
            	display: "none"
            },
            ajaxDisplay: "none",
            maskDisplay: "none"
		};
		this.getAddress = () => {
			let _this = this;
			_this.setState({ajaxDisplay: "block",maskDisplay: "block"}); 
			Tool.fetch(this,{
                url: URLS.Address + "/user/" + this.state.userId+"?_t="+Cookie.load('tokenid'),
                type: "get",
                successMethod: function(json,status){
                	if(!json){
                		json = [];
                	}
                	if(json.code == 400001012){
                		return;
                	}
                	_this.setState({
                		addressMsg : json,
                		nolist : json.length  > 0 ? 'none' : 'block'
                	});
                }
            });
		}
	}

	// componentWillMount(){
	// 	this.getAddress();
	// }

	onChildDefault(child){
		let {memberId , id} = child.props.item,_this = this;
		let headers = COMMON_HEADERS_POST('tokenid', Cookie.load('tokenid'));
		let data = {
			"memberId" : memberId,
			"id" : id,
			"type" : 1
		}
		Tool.fetch(this,{
            url: URLS.Address,
            type: "put",
            body:JSON.stringify(data),
            headers: headers,
            successMethod: function(json){
            	console.log('成功设置为默认地址');
            	_this.getAddress();
            }
        });
	}

	// 删除
	callbackDel(child){
		let {id} = child.props.item,_this = this;
		this.setState({
			confirm : {
				title: "确定删除本地址吗？",
				content: "",
            	leftText: "取消",
            	leftMethod: ()=>{
            		_this.setState({confirm : {display : 'none'},maskDisplay:'none'});
            	},
            	rightText: "确定",
            	rightMethod: ()=>{
            		Tool.fetch(this,{
			            url: URLS.Address + '/' + id+'?_t='+Cookie.load('tokenid'),
			            type : "delete",
			            successMethod: function(json){
			            	console.log('删除成功');
			            	_this.getAddress();
			            	_this.state.confirm.leftMethod();
			            }
			        });
            	},
            	display: "block"
			},
			maskDisplay:'block'
		})
	}

	goBack(){
		this.context.router.goBack();
	}

	addAddress(){
        this.props.saveAddressInfo({id: ""});
        Tool.history.push("/address-add");
	}
	toastDisplay(state){
        this.setState({
          display: state
        });
    }
    componentDidMount(){
        this.getAddress();
    }

	render(){
		// function mapStateToProps(state,ownProps) {
		//   return {
		//     address: state.address
		//   };
		// }
		// function mapDispatchToProps(dispatch) {  
		//   return {
		//     saveAddressInfo: (user) => {
		//     	dispatch(address(user));
		//     }
		//   };
		// }

		let AddressItemConnect = connect(mapStateToProps,mapDispatchToProps)(AddressItem);
		return(
			<div style={{height: '100%',overflow: 'hidden'}}>
				<Header title="管理收货地址" leftIcon="fanhui" />
				<ul className="address-list">
					{
						this.state.addressMsg.length>0&&this.state.addressMsg.map((item,index) => 
							<AddressItemConnect key={index} item = {item} flag={this.state.flag} callbackDefault={this.onChildDefault.bind(this)}  callbackDel={this.callbackDel.bind(this)} goBack={this.goBack.bind(this)}/>
						)
					}
				</ul>
				<Nolist display={this.state.nolist} />
				<a href="javascript:;" className="add-address-btn" onClick={this.addAddress.bind(this)}>+ 新增收货地址</a>
				<Toast content={this.state.tipContent} display={this.state.display} callback={this.toastDisplay.bind(this)} parent={this} />
				<Confirm  {...this.state.confirm}/>
                <AjaxTip display={this.state.ajaxDisplay} />
                <div className="mask" style={{display: this.state.maskDisplay}}></div>	            
			</div>
		)
	}
}

var Nolist = React.createClass({
	render : function(){
		return(
			<div className="no-address" style={{display : this.props.display}}>
				<i className="na-ico"></i>
				<p>收货地址还是空的快去新建地址吧</p>
			</div>
		)
	}
});

Address.contextTypes = {
    router: React.PropTypes.object.isRequired
}

let mapStateToProps = function(state,ownProps){
  return {
    address: state.address
  };		
}

let mapDispatchToProps = function(dispatch){
  return {
    saveAddressInfo: (user) => {
    	dispatch(address(user));
    }
  };		
}

// export default Address;
export default connect(mapStateToProps,mapDispatchToProps)(Address);
process.env.NODE_ENV !== 'production' && module.hot.accept();
