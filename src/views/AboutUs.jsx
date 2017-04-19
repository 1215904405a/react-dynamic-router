import React, {Component, PropTypes} from 'react';
import {Header} from '../Component/common/index';
import '../Style/aboutus';

/**
 * 关于我们
 * 
 * @class AboutUs
 * @extends {Component}
 */
class AboutUs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            version: ''
        };
        document.title = "关于我们";
        document.body.style.background = "#fff";
    }  
    componentDidMount(){
        var search = location.href.split("?")[1],
            self = this;
        search = search?search.split("&"):[];
        search.forEach(function(item){
            if(item.split("=")[0] == "version"){
              self.setState({version: 'V'+item.split("=")[1]});
            }
        });
    }
    render() {
        return (
            <div className="about-us">
               <div className="title-icon"></div>
               <div className="version">家园网 {this.state.version}</div>
               <div className="content">
                  <p>金色家园网络科技有限公司于2015 年1月23日在国家工商行政总局注册成立，为国家"中关村高新技术企业"。</p>   
                  <p>家园网（ JYall.com）定位为：一站式家庭O2O服务平台。运用互联网、移动互联技术，是以“家”为入口，以家庭生活需求为核心，以房产、装修、家电、家具、家政、汽车、旅行、医疗、理财、金融等为主线的互联网 O2O 服务企业。</p>
               </div>
               <p className="copyright">© 2017 家园网 版权所有</p>
            </div>
        );
    }
}

export default AboutUs;
process.env.NODE_ENV !== 'production' && module.hot.accept();