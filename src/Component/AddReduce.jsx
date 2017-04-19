import React, {Component, PropTypes} from 'react';
import cookie from 'react-cookie';
import '../Style/addreduce';
import {Tool, merged} from '../Tool';
import URLS from '../constants/urls';
import {COMMON_HEADERS_POST,COMMON_HEADERS} from '../constants/headers';
/**
 * @export
 * @class AddReduce
 * @extends {Component}
 */
export class AddReduce extends Component {
    constructor(props) {
        super(props);
        this.state = {
            num: this.props.num,
            color: '#333333'
        };
        // console.log(this.props);
        
    }

    reduce(e){
        e.stopPropagation(); 
        e.preventDefault();
        if(this.state.num <= 1){return;}
        let isLogin = 0,
            uKey = cookie.load('tokenid')?cookie.load('tokenid'):cookie.load('jycart_uKey'),
            groupSkuId = this.props.groupSkuId,
            count=1,
            self = this; 
        if(cookie.load('tokenid'))isLogin = 1;
        this.props.parent.setState({ajaxDisplay: "block",maskDisplay: "block"});
        Tool.fetch(this.props.parent,{
            url: `${URLS.MINUSITEM}${isLogin}/${uKey}/${groupSkuId}/${count}`,
            type: "put",
            headers: COMMON_HEADERS,
            successMethod: function(json){
                if(json.flag == true){
                    let num = --self.state.num;
                    self.setState({num: num});
                    if(num == 1){self.setState({color: "#999999"});}
                    self.props.callback({num: num,index: self.props.index});
                }
            }
        });
    }

    add(e){
        e.stopPropagation(); 
        e.preventDefault();
        let isLogin = 0,
            uKey = cookie.load('tokenid')?cookie.load('tokenid'):cookie.load('jycart_uKey'),
            groupSkuId = this.props.groupSkuId,
            count=1,
            self = this;
        this.more = true;    
        if(cookie.load('tokenid'))isLogin = 1;
        if(self.state.num >= this.props.stock){
            self.props.callback({more: true,message: '已达库存上限'});
            return;
        }
        this.props.parent.setState({ajaxDisplay: "block",maskDisplay: "block"});
        Tool.fetch(this.props.parent,{
            url: `${URLS.ADDITEM}${isLogin}/${uKey}/${groupSkuId}/${count}`,
            type: "post",
            headers: COMMON_HEADERS_POST,
            successMethod: function(json){
                if(json.flag == true){
                    self.setState({color: "#333333"});
                    self.setState({num: ++self.state.num});
                    self.props.callback({num: self.state.num,index: self.props.index,more: false});
                }else{
                    self.props.callback({more: true,message: json.message});
                }
            }
        });
    }

    componentDidMount() {
        if(this.state.num <= 1){
            this.setState({color: "#999999"});
        }
    }

    render() {
        let {num} = this.props;
        return (
            <div className="add-reduce">
                <b onClick={this.reduce.bind(this)} style={{color: this.state.color}} >-</b><b>{this.state.num}</b><b onClick={this.add.bind(this)}>+</b>
            </div>
        );
    }
}
