import React, {Component, PropTypes} from 'react';
import cookie from 'react-cookie';
import {Header,AddressSelect} from '../Component/common/index';
import {Toast,AjaxTip} from '../Component/common/Tip';
import {COMMON_HEADERS_POST} from '../constants/headers';
import '../Style/yue';
import {Tool, merged} from '../Tool';
import URLS from '../constants/urls';
import {ONLINE} from '../constants/common';


/**
 * 模块入口
 * 
 * @class Yue
 * @extends {Component}
 */
class Yue extends Component {
    constructor(props){
      super(props);
      this.state = {
        tipContent: '',
        display: '',
        addressSelectStyle: "150%",
        provinceId: "",
        province: "",
        cityId: "",
        city: "",
        countryId: "",
        country: "",
        xzId: "",
        xz: "",
        codeText: "获取验证码",
        background: "#f60",
        title: "预约",
        ajaxDisplay: "none",
        maskDisplay: "none"
      };
      this.clickControl = true;
    }

    goYue(){
        let address = this.refs.address.value,
          detail = this.refs.detail.value,
          name = this.refs.name.value,
          phone = this.refs.phone.value,
          code = this.refs.code.value,
          self = this;
        if(!address){
          this.setState({tipContent : '请选择服务区域',display : 'toasts' });return;
        }
        if(!detail){
          this.setState({tipContent : '请输入门牌号',display : 'toasts' });return;
        }
        if ("" == name || !/[\u4e00-\u9fa5|a-z|A-Z]/.test(name)){
          this.setState({tipContent : '请输入汉字或英文字母姓名',display : 'toasts' });return;
        }
        if (!/^[1][3-9][0-9]{9,9}$/.test(phone)){
          this.setState({tipContent : '请输入正确手机号码',display : 'toasts' });return;
        }
        if(!code){
          this.setState({tipContent : '请输入验证码',display : 'toasts' });return;
        }


        var data = {
            userName: "",
            userId: cookie.load("userId"),
            userPhone: "",
            remark: this.refs.remark.value,
            address: (this.state.provinceId+":"+this.state.province+","+this.state.cityId+":"+this.state.city+","+this.state.countryId+":"+this.state.country+","+this.state.xzId+":"+this.state.xz),
            community: this.state.xz,
            doorNum: detail,
            identifyCode: code,
            contactUserName: name,
            contactUserPhone: phone,
            groupId: this.magicGoodsId,
            groupName: this.nameParams,
            groupSpec: "",
            // groupBizType: "",
            skuId: this.showClassId?this.showClassId:"94",
            skuName: this.nameParams,
            skuSpec: "",
            identifyType: this.identifyType,
            source: "app",
            sourceFlag: "",
            remark: this.refs.remark.value
            // managerId: "",
            // butlerId: ""
        };
              
        let headers = COMMON_HEADERS_POST();
        let domain = ONLINE?"http://m.jyall.com":"http://m.jyall.com";
        this.setState({ajaxDisplay: "block",maskDisplay: "block"});
        Tool.fetch(this,{
                  url: `${URLS.YUYUE}`,//提交地址
                  type: "post",
                  headers: headers,
                  body: JSON.stringify(data),
                  successMethod: function(json,status){
                    let tip = "";
                    console.log(json);
                    if(status == 200){
                      //{"businessPeople":{"butler":{"jobName":"金管家专员","empId":"ca72ceeeeb8ebec24ec672e62218bd8b","mobile":"15001001001","ssn":"220102198601014233","telSuffix":"890011","jobId":"4659be2af8601f6ce9f31db389439ecf","number":"90011","newMobile":"15001001001","serviceTel":"400-810-0022-890011","empName":"李豹金管家","leavestatus":"0","departments":"龙王常务委员会, 华北大区, 金管家分配测试-西城","telPrefix":"400-810-0022"},"hisButlers":[{"$ref":"$.businessPeople.butler"}]}}
                        tip = "预约成功";
                        self.setState({tipContent : '预约成功',display : 'toasts' });
                        setTimeout(function(){
                          location.href = domain+"/app/scues-fals.html?name="+self.nameParams+"&stewardname="+json.businessPeople.butler.empName+"&stewardnum="+json.businessPeople.butler.serviceTel;
                        },1500);
                    }else {
                        tip = json.message;
                        self.setState({tipContent : tip?tip:'预约失败',display : 'toasts' });
                        setTimeout(function(){
                          location.href = domain+"/app/fals.html?name="+self.nameParams;
                        },1500);
                    }
                  }
              });
    }

    //toast
    toastDisplay(state){this.setState({display: state}); }

    closeAddress(){
      this.setState({addressSelectStyle: "150%",maskDisplay: "none"});
    }

    addressSelect(){
      this.setState({addressSelectStyle: "0",maskDisplay: "block"});
    }

    addressResult(data){//获取四级地址结果
      this.setState({
        addressSelectStyle: "150%",
        maskDisplay: "none",
        provinceId: data.provinceId,
        province: data.province,
        cityId: data.cityId,
        city: data.city,
        countryId: data.countryId,
        country: data.country,
        xzId: data.xzId,
        xz: data.xz
      });
    }

    getCode(){//获取验证码
        if(!this.clickControl){return;}

        let headers = COMMON_HEADERS_POST('Accept','application/json'),
          phone = this.refs.phone.value
          self = this;

        if (!/^[1][3-9][0-9]{9,9}$/.test(phone)){
          this.setState({tipContent : '请输入正确手机号码',display : 'toasts' });return;
        }
        this.clickControl = false;
        this.setState({ajaxDisplay: "block",maskDisplay: "block"});
        Tool.fetch(this,{
                  url: `${URLS.YUYUECODE}${phone}`,//提交地址
                  type: "get",
                  headers: headers,
                  successMethod: function(json,status){
                    if(status == 200){
                      self.identifyType = json.identifyType;
                      var count = 60;
                      self.inte = setInterval(function(){
                        count--;
                        if(count == 0){
                            clearInterval(self.inte);
                            self.setState({codeText: '获取验证码',background: "#f60"});
                            self.clickControl = true;
                        }else{
                            self.setState({codeText: '获取验证码('+count+')',background: "#ccc"});
                        }
                      },1000);
                    }else{
                      self.clickControl = true;
                    }
                  }
              });
    }

    componentDidMount(){
      var search = location.href.split("?")[1],
          self = this;
      search = search?search.split("&"):[];
      // alert(search);
      search.forEach(function(item){
          if(item.split("=")[0] == "showClassId"){
            self.showClassId = item.split("=")[1];
            if(self.showClassId.split("_").length > 1){
                self.magicGoodsId = self.showClassId.split("_")[1];
                self.showClassId = self.showClassId.split("_")[0];
            }
          } else if(item.split("=")[0] == "name"){
            self.nameParams = decodeURIComponent(item.split("=")[1]);
            self.setState({title: self.nameParams});
          }
      });
      if(localStorage.getItem("source")){
          document.getElementsByClassName("common-header")[0].style.display = "none";
          document.getElementsByClassName("route-div")[0].style.paddingTop = "0";        
      }
    }

    render() {
        return (
            <div className="yue" style={{height: '100%',overflow: 'auto'}}>
                <Header title={this.state.title} leftIcon="fanhui" className="yue-title" />
                <section>
                  <div className="main">
                    <div className="addren">
                      <ul>
                        <li id = "area_select">
                          <input type="text" ref="address" placeholder="请选择服务区域" autoComplete="off" value={`${this.state.province}${this.state.city}${this.state.country}${this.state.xz}`} readOnly="readonly" onClick={this.addressSelect.bind(this)} />
                          <a href = "javascript:"><span className="chose"></span></a>
                        </li>
                        <li>
                          <input type="text" ref="detail" placeholder="详细楼栋门牌号" autoComplete="off" />
                        </li>
                        <li>
                          <input type="text" ref="name" placeholder="联系人姓名" autoComplete="off" />
                        </li>
                        <li>
                          <input type="number" ref="phone" placeholder="手机号码" autoComplete="off" />
                        </li>
                        <li className="identifyCode">
                          <input type="text" ref="code" placeholder="输入验证码" autoComplete="off" />
                          <button onClick={this.getCode.bind(this)} style={{background: this.state.background}}>{this.state.codeText}</button>
                        </li>
                        <li className="none">
                          <input type="text" ref="remark" placeholder="备注   服务时间、要求" autoComplete="off" />
                        </li>
                      </ul>
                    </div>
                    <a className="yue-but" style={{cursor: 'pointer'}} onClick={this.goYue.bind(this)}>立即预约</a> </div>
                </section>
                <Toast content={this.state.tipContent} display={this.state.display} callback={this.toastDisplay.bind(this)} />
                <AddressSelect _style={this.state.addressSelectStyle} close = {this.closeAddress.bind(this)} addressResult={this.addressResult.bind(this)} />
                <AjaxTip display={this.state.ajaxDisplay} />
                <div className="mask" style={{display: this.state.maskDisplay}}></div>
            </div>
        );
    }
}

export default Yue;
process.env.NODE_ENV !== 'production' && module.hot.accept();