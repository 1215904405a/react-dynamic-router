import React, {Component, PropTypes} from 'react';
import Cookie from 'react-cookie';
import URLS from '../constants/urls.js';
import {Tool, merged} from '../Tool';
import {ONLINE} from '../constants/common';
import cookie from 'react-cookie';

export class AddressItem extends Component{
	constructor(props){
		super(props);
	}

	//设为默认地址
	addressDefault(e){
		e.stopPropagation(); 
        e.preventDefault();
		this.props.callbackDefault(this);
	}

	//编辑地址
	addressEdit(e){
		e.stopPropagation(); 
        e.preventDefault();
		let addressItem = this.props.item;
		addressItem.from = "edit";
		addressItem.type1 = addressItem.type;
		this.props.saveAddressInfo(addressItem);
		Tool.history.push('/address-add');
	}

	//删除地址
	addressDel(e){
		e.stopPropagation(); 
        e.preventDefault();
		this.props.callbackDel(this);
	}

	setAddressInfo(){//保存每项地址信息
		this.props.saveAddressInfo(this.props.item);
        var cookieObj = { expires:new Date("2100-01-01"),path:"/",domain:(ONLINE?"jyall.com":"") }
        // cookie.save('addressId', this.props.id, cookieObj);
        // cookie.save('consigneeName', this.props.consigneeName, cookieObj);

		// setTimeout(function(){
			Tool.history.goBack();
		// },1000);
	}

	render(){
		let {consigneeName,consigneeMobile,detailInfo,locationInfo,type} = this.props.item;
		return(
			<li onClick={this.setAddressInfo.bind(this)}>
				<div className="address-msg">
					<h6><span>{consigneeName}</span><span>{consigneeMobile}</span>{type==1 ? <em>默认</em> : ''}</h6>
					<p>{locationInfo+detailInfo}</p>
				</div>
				<div className="address-operation">
					<span className={type==1? 'current on' : 'current'} onClick={this.addressDefault.bind(this)}>设为默认</span>
					<span className="ao-del" onClick={this.addressDel.bind(this)}>删除</span>
					<span className="ao-edit" onClick={this.addressEdit.bind(this)}>编辑</span>
				</div>
			</li>
		)
	}
}