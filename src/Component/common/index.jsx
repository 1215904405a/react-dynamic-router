import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../../Action/Index';
import { Tool, merged } from '../../Tool';
import URLS from '../../constants/urls';
import { COMMON_HEADERS_POST, COMMON_HEADERS } from '../../constants/headers';

/**
 * 公共头部
 *
 * @export
 * @class Header
 * @extends {Component}
 
 */
export class Header extends Component {
    constructor(props) {

        super(props);
        this.state = {
            hClass: 'h-screen',
            hPar: false
        };
    }
    classify() {
        if (!this.state.hPar) {
            this.setState({ hClass: 'h-screen hs-icoUp', hPar: true });
        } else {
            this.setState({ hClass: 'h-screen', hPar: false });
        }
        this.props.callbackParent(this.state.hPar);
    }
    industry(e) {
        if (e.target.parentNode.tagName == "LI") {
            this.props.callback(e.target.parentNode.id);
            for (var i = 0; i < this.refs.industry.childNodes.length; i++) {
                this.refs.industry.childNodes[i].className = " ";
            }
            this.refs.sHead.innerText = e.target.innerText;
            e.target.parentNode.className = "active";
            this.setState({ hClass: 'h-screen', hPar: false });
            this.props.callbackParent(this.state.hPar);

        }
    }

    goBack() {
        if (this.props.type == "center") {
            location.href = "http://m.jyall.com/";
        } else {
            console.log(this.context)
            this.context.router.goBack();
        }
    }

    render() {
        let { title, leftIcon, hadeScreen = "", hClass = "h-screen", type = "", className } = this.props;
        let left = null,
            hScreen = null;
        if (leftIcon === 'fanhui') { //返回上一页
            left = (
                <a href = "javascript:;" onClick={this.goBack.bind(this)}>
                    <i></i>
                </a>
            );
        }
        if (hadeScreen === 'true') { //头部筛选

            hScreen = (
                <div className="h-screen-warp">
                    <div className={this.state.hClass} ref="hState" onClick={this.classify.bind(this)}>
                    </div>
                    <div className="h-s-list" style={{display: this.state.hPar?"block":"none"}}>
                        <ul className="clearfix" onClick={this.industry.bind(this)} ref="industry">
                            <li id="0" className="active"><span>全部订单</span></li>
                            <li id="1"><span>家居订单</span></li>
                            <li id="2"><span>装修订单</span></li>
                            <li id="4"><span>家电订单</span></li>
                            <li id="3"><span>家具订单</span></li>
                            <li id="5"><span>家政订单</span></li>
                            <li id="6"><span>汽车订单</span></li>
                            <li id="7"><span>旅行订单</span></li>
                        </ul>
                    </div>
                </div>
            );
        }

        return (
            <header className="common-header">
                <div className="left-arrow">
                    {left}
                </div>
                <h2 className={className?"title "+className:"title"}><span ref="sHead">{title}</span>
                    {hScreen}
                </h2>
            </header>
        );
    }
}
Header.contextTypes = {
    router: React.PropTypes.object.isRequired
}

/**
 * 四级地址
 *
 * @export
 * @class AddressSelect
 * @extends {Component}
 */
let AddressSelectList = React.createClass({
    // getInitialState() {
    //     return {liked: false};
    // }

    render: function() {
        let { index, id, name, status, selectIndex } = this.props;
        this.callback = () => {
            this.props.callback({ index: index, name: name, id: id, status: status })
        }
        return (
            <li className={index==selectIndex?"select":""} onClick={this.callback.bind(this)}>{name}</li>
        );
    }
});

export class AddressSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            status: 0,
            index: 0,
            select: "请选择",
            province: "",
            provinceId: "",
            city: "",
            cityId: "",
            country: "",
            countryId: "",
            xz: "",
            xzId: ""
        };
        this.getProvince(this, 0);
    }

    getProvince(obj, first) {
        if (first != 0) {
            this.setState({ index: 0, status: 0, select: "请选择", province: "", city: "", country: "", xz: "" });
            obj = this;
        }
        Tool.fetch(obj, {
            url: `${URLS.PROVINCE}?containChilds=false`,
            type: "get",
            headers: COMMON_HEADERS,
            successMethod: function(json) {
                obj.setState({ list: json, status: 0 });
            }
        });
    }

    getCity(id, select) {
        if (select != 0) { id = this.state.provinceId; }
        let self = this;
        Tool.fetch(this, {
            url: `${URLS.CITY}${id}`,
            type: "get",
            headers: COMMON_HEADERS,
            successMethod: function(json) {
                self.setState({ index: 0, list: json, status: 1, city: "", country: "", xz: "" });
            }
        });
    }

    getCountry(id, select) {
        if (select != 0) { id = this.state.cityId; }
        let self = this;
        Tool.fetch(this, {
            url: `${URLS.COUNTRY}${id}`,
            type: "get",
            headers: COMMON_HEADERS,
            successMethod: function(json) {
                self.setState({ index: 0, list: json, status: 2, country: "", xz: "" });
            }
        });
    }

    getXz(id, select) {
        if (select != 0) { id = this.state.xzId; }
        let self = this;
        Tool.fetch(this, {
            url: `${URLS.XZ}${id}`,
            type: "get",
            headers: COMMON_HEADERS,
            successMethod: function(json) {
                self.setState({ index: 0, list: json, status: 3, xz: "" });
            }
        });
    }

    selectItem(data) {
        if (data.status == 0) {
            this.refs.province.innerText = data.name;
            this.setState({ province: data.name, provinceId: data.id, select: "", index: data.index });
            this.getCity(data.id, 0);
        } else if (data.status == 1) {
            this.refs.city.innerText = data.name;
            this.setState({ city: data.name, cityId: data.id, index: data.index });
            this.getCountry(data.id, 0);
            console.log(this.state.provinceId);
        } else if (data.status == 2) {
            this.refs.country.innerText = data.name;
            this.setState({ country: data.name, countryId: data.id, index: data.index });
            this.getXz(data.id, 0);
        } else if (data.status == 3) {
            this.refs.xz.innerText = data.name;
            this.setState({ xz: data.name, xzId: data.id, index: data.index });
            this.props.addressResult({
                provinceId: this.state.provinceId,
                province: this.state.province,
                cityId: this.state.cityId,
                city: this.state.city,
                countryId: this.state.countryId,
                country: this.state.country,
                xzId: data.id,
                xz: data.name
            });
        }
    }

    render() {
        let { _style } = this.props;

        return (
            <section className = "cascade-select" style={{WebkitTransform: `translate3d(0,${_style},0)`,transform: `translate3d(0,${_style},0)`}}>
                <header>所在地区<span onClick={this.props.close}>+</span></header>
                <div className="select-value"><span style={{color: "#ff6600",marginRight: "0"}}>{this.state.select}</span><span ref="province" onClick={this.getProvince.bind(this)}>{this.state.province}</span><span ref="city" onClick={this.getCity.bind(this)}>{this.state.city}</span><span ref="country" onClick={this.getCountry.bind(this)}>{this.state.country}</span><span ref="xz" onClick={this.getXz.bind(this)}>{this.state.xz}</span></div>
                <div className="select-scroll">
                   <ul ref="list">
                   {
                        this.state.list.map((item,index) =>
                            <AddressSelectList key={index} index={index} selectIndex={this.state.index} status={this.state.status} {...item} callback={this.selectItem.bind(this)}/>)
                   }
                   </ul>
                </div>
            </section>
        );
    }
}

/**
 * 跳转app
 *
 * @export
 * @class Downloadapp
 * @extends {Component}
 */
export const Downloadapp = (obj) => {
    var downloadUrl = "http://m.jyall.com/download.html",
        linkApp = "myapp://m.jyall.app/openwith";
    var downDom = document.getElementsByClassName("j-downAppBtn"),
        length = downDom.length;

    document.body.addEventListener("click", function(e) {
        // e.stopPropagation();
        // e.preventDefault();
        if (e.target.className == "j-downAppBtn") {
            if (navigator.userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
                return;
            }
            if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
                var loadDateTime = new Date(),
                    aLink = document.createElement("a");
                aLink.href = downloadUrl;
                //a.style.display = "none";
                document.body.appendChild(aLink);
                var ev = document.createEvent('HTMLEvents');
                ev.initEvent('click', false, true);

                window.setTimeout(function() {
                    // tip.toast("未检测到本地应用，<br>现跳转到下载页面！");
                    // obj.setState({tipContent: '未检测到本地应用，<br>现跳转到下载页面！',display: 'toasts',});
                    var timeOutDateTime = new Date();
                    if (timeOutDateTime - loadDateTime < 5000) {
                        aLink.dispatchEvent(ev);
                        setTimeout(function() {
                            // tip.toast("app iPhone|iPod|iPad  暂无下载地址链接！！！！");
                            // obj.setState({tipContent: 'app iPhone|iPod|iPad  暂无下载地址链接！！！',display: 'toasts',});
                        }, 500);
                    } else {
                        window.close();
                    }
                }, 2000);
                window.location = linkApp;
            } else if (navigator.userAgent.match(/android/i)) {
                var ifr = null;
                try {
                    ifr = document.createElement("iframe");
                    ifr.setAttribute('src', linkApp);
                    ifr.setAttribute('style', 'display:none');
                    document.body.appendChild(ifr);
                } catch (e) {}
                setTimeout(function() {
                    // tip.toast("未检测到本地应用，<br>现跳转到下载页面！");
                    // obj.setState({tipContent: '未检测到本地应用，<br>现跳转到下载页面！',display: 'toasts',});
                    // tip.toast("app android 下载开始，链接地址！！！！");
                    // obj.setState({tipContent: 'app android 下载开始，链接地址！！！',display: 'toasts',});
                    window.location = downloadUrl;
                }, 2000);
            }
        }
    }, false);
}

/**
 * 底部导航菜单
 *
 * @export
 * @class Footer
 * @extends {Component}
 */
class FooterInit extends Component {
    render() {
        var myUrl = this.props.User && this.props.User.loginname ? '/user/' + this.props.User.loginname : '/signin';
        var arr = [];
        arr[this.props.index] = 'on';
        return (
            <footer className="common-footer">
                <div className="zhanwei"></div>
                <ul className="menu" data-flex="box:mean">
                    <li className={arr[0]}>
                        <Link to="/">
                            <i className="iconfont icon-shouye"></i>首页
                        </Link>
                    </li>
                    <li className={arr[1]}>
                        <Link to="/topic/create">
                            <i className="iconfont icon-fabu"></i>发表
                        </Link>
                    </li>
                    <li className={arr[2]}>
                        <Link to="/my/messages">
                            <i className="iconfont icon-xiaoxi"></i>消息
                        </Link>
                    </li>
                    <li className={arr[3]}>
                        <Link to={myUrl}>
                            <i className="iconfont icon-wode"></i>我的
                        </Link>
                    </li>
                </ul>
            </footer>
        );
    }
    shouldComponentUpdate(np) {
        return this.props.index !== np.index; //防止组件不必要的更新
    }
}
FooterInit.defaultProps = {
    index: 0
};

var Footer = connect((state) => {
    return { User: state.User };
}, action('User'))(FooterInit);

export { Footer }
