import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {DataLoad, DataNull, Header, TipMsgSignin, Footer} from '../Component/common/index';
import URLS from '../constants/urls';
import {COMMON_HEADERS_POST} from '../constants/headers';
import {Toast} from '../Component/common/Tip';

/**
 * 模块入口
 * 
 * @class Login
 * @extends {Component}
 */
class Invite extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            button: '登录',
            tipContent: '',
            display: ''
        };

        this.signin = () => {
            var userName = this.refs.phone.value,
                passWord = this.refs.password.value,
                source = "app",
                self = this;
            //this.props.signinSuccess({a:1,b:2});   //action > state
            if (!userName){
                this.setState({ tipContent: '号码不能为空',display: 'toasts' });
                return;
            }
            if(!passWord){
                this.setState({ tipContent: '密码不能为空',display: 'toasts' });
                return;
            }
            this.setState({ button: '登录中...' });
            // let headers = COMMON_HEADERS_POST('content-type', 'application/json');
            let headers = COMMON_HEADERS_POST();
            Tool.fetch(this,{
                url: `${URLS.LOGIN}?userName=${userName}&passWord=${passWord}&source=${source}&version=14`,
                type: "post",
                body: "",
                headers: headers,
                successMethod: function(json){
                    self.setState({ button: '登录' });
                    //{"responseBody":{"password":"70ed0011afee14509cf8a9cb4fd932f591b355b7a2c3d4527c3d6e3a","tokenid":"a3dd0adcZf19bcadcZ1574fbcc15dZb4ab","roleId":"1","sex":"0","name":"HYS15810341mq","photo":"http://image1.jyall.com/v1/tfs/T1Nqh_B4bT1R4cSCrK","userId":"HYS000705"},"responseHeader":{"errorCode":0,"message":"success"}}
                    if(json.responseHeader){//登录成功
                    //json

                    }else{
                       self.setState({ tipContent: json.message,display: 'toasts' });
                    }
                }
            });
        }
        Tool.rem();
    }

    toastDisplay(state){
        this.setState({
          display: state
        });
    }

    render() {
        return (
            <div>
                <Header title="邀请" leftIcon="fanhui" />
                <div className="signin">
                    <div className="center">
                        <div className="text">
                            <input ref="phone" type="text" placeholder="请输入手机号" />
                            <input ref="password" type="password" placeholder="请输入密码" />
                            <input ref="code" type="num" placeholder="请输入验证码" style={{borderTop:'1px solid #e6e6e6',display: 'none'}} />
                            <span><img href="" /></span>
                        </div>
                        <button className="btn" onClick={this.signin.bind(this)}>{this.state.button}</button>
                        <div style={{marginTop: '10px'}}><Link to="/register" style={{color: '#666'}}><span className="fl">注册</span></Link><Link to="/registerpd" style={{color: '#666'}}><span className="fr">找回密码</span></Link></div>
                    </div>
                </div>
                <Toast content={this.state.tipContent} display={this.state.display} callback={this.toastDisplay.bind(this)} />
            </div>
        );
    }
}

export default Invite;
process.env.NODE_ENV !== 'production' && module.hot.accept();