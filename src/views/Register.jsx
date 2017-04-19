import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory,Link } from 'react-router';
import { connect } from 'react-redux';
import {register} from '../Action/login';
import {Header} from '../Component/common/index';
import URLS from '../constants/urls';
import {COMMON_HEADERS_POST,COMMON_HEADERS} from '../constants/headers';
import {Toast} from '../Component/common/Tip';
import {Tool, merged} from '../Tool';

/**
 * 模块入口
 * 
 * @class Register
 * @extends {Component}
 */
class Register extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            button: '下一步',
            tipContent: '',
            display: '',
            protocol: true,
            protocolClass: '',
            codeText: '获取验证码',
            codeControl: true,
            title: '注册',
            protocolDisplay: 'block'
        };

        this.validate = () => {
            if(!this.state.protocol){
                this.setState({ tipContent: '请同意协议',display: 'toasts' });return;
            }
            let phone = this.refs.phone.value,
                num = this.refs.num.value,
                self = this;
            if (!/^[1][3-9][0-9]{9,9}$/.test(phone)) {
                this.setState({ tipContent: '请输入正确的手机号',display: 'toasts' });return;
            }
            if(!num){
                this.setState({ tipContent: '验证码不能为空',display: 'toasts' });return;
            }
            let headers = COMMON_HEADERS();
            Tool.fetch(this,{
                url: URLS.Vcode+phone+"/"+num,
                type: "get",
                headers: headers,
                successMethod: function(json){
                    // console.log(json.uuid);
                    if(json.uuid){
                        self.props.register({uuid:json.uuid,phone:phone});
                        // var history = process.env.NODE_ENV !== 'production' ? browserHistory : hashHistory;
                        clearInterval(self.inte);
                        Tool.history.push('/registerpd');
                    }else{
                        self.setState({ tipContent: json.message,display: 'toasts' });
                    }
                }
            });            

        }
    }

    readProtocol(){ //同意协议
        if(this.state.protocol){
            this.setState({protocol: false,protocolClass: 'no-pro'});
        }else{
            this.setState({protocol: true,protocolClass: ''});
        }
    }

    //toast
    toastDisplay(state){  this.setState({display: state}); }

    getRandomCode(){
        if(!this.state.codeControl)return; 
        // if(!this.refs.phone.value){
        //     this.setState({ tipContent: '号码不能为空',display: 'toasts' });
        //     return;
        // }
        if (!/^[1][3-9][0-9]{9,9}$/.test(this.refs.phone.value)) {
            this.setState({ tipContent: '请输入正确的手机号',display: 'toasts' });return;
        }        
        let self = this,
            headers = COMMON_HEADERS();
        if(this.props.login.pwd != "findpwd"){
            Tool.fetch(this,{
                url: URLS.CHECKMOBILE+this.refs.phone.value+"/1",
                type: "get",
                headers: headers,
                successMethod: function(json){
                    if(json){
                        self.setState({ tipContent: '用户已注册',display: 'toasts' });return;
                    }else{
                        self.setState({codeControl: false});
                        Tool.fetch(self,{
                            url: URLS.Vcode+self.refs.phone.value,
                            type: "get",
                            headers: headers,
                            successMethod: function(json){
                                console.log(typeof json);
                                if(typeof json == "object"){
                                    self.setState({ tipContent: json.message,display: 'toasts' });
                                    return;
                                }
                                self.setState({ tipContent: '验证码已发送',display: 'toasts' });
                                let n = 60;
                                    self.inte = setInterval(function(){
                                        self.setState({codeText: `重新发送（${n}s）`});
                                        n--;
                                        if(n == 0){
                                            self.setState({codeText: "重新发送",codeControl:true});
                                            clearInterval(self.inte);
                                        }
                                    },1000);
                            }
                        });
                    }
                }
            });            
        }else{
            Tool.fetch(this,{
                url: URLS.Vcode+this.refs.phone.value,
                type: "get",
                headers: headers,
                successMethod: function(json){
                    console.log(typeof json);
                    if(typeof json == "object"){
                        self.setState({ tipContent: json.message,display: 'toasts' });
                        return;
                    }
                    self.setState({ tipContent: '验证码已发送',display: 'toasts' });
                    let n = 60;
                        self.inte = setInterval(function(){
                            self.setState({codeText: `重新发送（${n}s）`});
                            n--;
                            if(n == 0){
                                self.setState({codeText: "重新发送",codeControl:true});
                                clearInterval(self.inte);
                            }
                        },1000);
                }
            });            
        }            

    }

    componentDidMount(){
        if(this.props.login.pwd == "findpwd"){
            this.setState({ title: '找回密码'});
            this.setState({ protocolDisplay: 'none'});
        }
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //       return this.state.protocolDisplay === nextState.protocolDisplay;
    // }
    componentWillUnmount(){
        clearInterval(this.inte);
    }
    render() {
        return (
            <div>
                <Header title={this.state.title} leftIcon="fanhui" />
                <div className="signin">
                    <div className="center">
                        <div className="text">
                            <input ref="phone" type="text" placeholder="请输入手机号" className="phone" />
                            <input ref="num" type="num" placeholder="请输入验证码" className="code" />
                            <span onClick={this.getRandomCode.bind(this)} ref="codeText" style={{lineHeight: ".5rem",top: "1.1rem"}}>{this.state.codeText}</span>
                        </div>
                        <div className="protocol" style={{display: this.state.protocolDisplay}}><span onClick={this.readProtocol.bind(this)} className={this.state.protocolClass}></span>我已经阅读并同意遵守<Link to="/registerpro" style={{color: '#45b3fc'}}>《家园用户服务协议》</Link></div>
                        <button className="btn" onClick={this.validate.bind(this)}>{this.state.button}</button>
                    </div>
                </div>
                <Toast content={this.state.tipContent} display={this.state.display} callback={this.toastDisplay.bind(this)} />
            </div>
        );
    }
}
// Register.contextTypes = {//父组件跨级传数据
//     router: React.PropTypes.object.isRequired
// }




function mapStateToProps(state,ownProps) {
  return state;
}
function mapDispatchToProps(dispatch) {  
  return {
    register: (username) => dispatch(register(username))
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(Register);
process.env.NODE_ENV !== 'production' && module.hot.accept();