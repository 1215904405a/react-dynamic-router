import React, {Component, PropTypes} from 'react';
import ReactIScroll from 'react-iscroll';
import iScroll from 'iscroll';
import Cookie from 'react-cookie';
import URLS from '../constants/urls';
import {COMMON_HEADERS} from '../constants/headers';
//header公用头部引入
import {Header} from '../Component/common/index';
//css引入
import '../Style/appointment';
//Tool工具引入
import {Tool, merged} from '../Tool';
import {Toast} from '../Component/common/Tip';

// iscroll
// import ReactIScroll from 'react-iscroll';
// import iScroll from 'iscroll';

/**
 * 模块入口
 * 
 * @class Appointment
 * @extends {Component}
 */
class Appointment extends Component {
     constructor(props){
          super(props);
          Tool.loginChecked(this);
          this.state = {
               // userId : Cookie.load('userId'),
               pageNo : 1,
               pageSize : 10,
               more:'',
               nextPage: false, //下一页控制器
               scrollNoData: false, //分页没有数据
               y:'',
               display: '',
               nolist : 'block',
               dataList : [],
               options: {
                    mouseWheel: true,
                    scrollbars: true,
                    interactiveScrollbars: true,
                    shrinkScrollbars: 'scale',
                    fadeScrollbars: true
              }
          }
          this.getAppointmentList = () => {
               
               let _this = this,
                    headers = COMMON_HEADERS('tokenid', Cookie.load("tokenid"));
               Tool.fetch(this,{
                    url: URLS.APPOINTMENTLIST+"?pageSize="+this.state.pageSize+"&pageNo="+this.state.pageNo,// + this.state.userId,
                    type: "get",
                    headers:headers,
                    successMethod: function(json){
                         if(!json.code){//登录成功
                              //json

                              if(json.length>0&&json.length==_this.state.pageSize){
                                   _this.state.scrollNoData = false;
                                   _this.state.more="上拉加载更多";
                                   _this.setState({
                                        dataList : _this.state.dataList.concat(json),
                                        nolist : json.length > 0 ? 'none' : 'block'
                                   });

                              }else if(json.length>0&&json.length<_this.state.pageSize){
                                   _this.state.scrollNoData = true;
                                   _this.state.more="";
                                   _this.setState({
                                        dataList : _this.state.dataList.concat(json),
                                        nolist : json.length > 0 ? 'none' : 'block'
                                   });
                              }else{
                                   _this.state.more="";
                                   _this.state.scrollNoData = true;
                                   
                              }
                             
                         }else{
                              // dataList
                              _this.setState({ tipContent: json.message,display: 'toasts' });
                              setTimeout(function(){
                                   Tool.history.push('/');
                              },2000);
                         }
                    },

               });

          }
     }
     // let this=this;
     toastDisplay(state){
        this.setState({
          display: state
        });
     }

     onScrollEnd(iScrollInstance){

          if(this.state.scrollNoData){return;}

          if((iScrollInstance.maxScrollY < 0 && Math.abs(iScrollInstance.startY) - Math.abs(iScrollInstance.maxScrollY) > 20) || (iScrollInstance.maxScrollY > 0 && iScrollInstance.directionY == 1 && iScrollInstance.distY > 20)){
              //if(this.state.noPage)return;
              this.state.more = "正在加载";
              this.setState({
               display: this.state
             });
              this.state.nextPage = true;
          }else {
              this.state.more="上拉加载更多";
              this.state.nextPage = false;
          }
          this.setState({
               display: this.state
             });
          if(this.state.nextPage){
              this.state.pageNo = this.state.pageNo;
              
              // this.state.collection.fetch({url: this.state.currentListUrl,data: this.state.currentUrlCondition,reset: true,success:function(){
               // this.state.more = "松开刷新";
               this.state.pageNo++;
               this.getAppointmentList();
              // }});
          }
     }

     onScrollStart(iScrollInstance){
     // let yScroll = iScrollInstance.y;

     //   console.log("vertical position:" + yScroll);
     //      // if((iScrollInstance.maxScrollY < 0 && Math.abs(iScrollInstance.startY) - Math.abs(iScrollInstance.maxScrollY) > 30) || (iScrollInstance.maxScrollY > 0 && iScrollInstance.directionY == 1 && iScrollInstance.distY > 30)){

          
     //      this.state.more = "松开刷新";
     //           this.setState({
     //               display: this.state
     //           });
     //      // }
     }

     onRefresh(iScrollInstance,state) {
       // let yScroll = iScrollInstance.y;

       // console.log("onRefresh vertical position:" + yScroll)

     }


     //渲染完成之后再执行
     //componentDidMount(){
     componentWillMount(){
          this.getAppointmentList();
     }

     render() {
        return (
            <div className="appointment">
                <Header title="预约单" leftIcon="fanhui" />
                <div className="listbox">
                     <ReactIScroll iScroll={iScroll}
                              options={this.state.options}
                               onRefresh={this.onRefresh.bind(this)}
                           onScrollStart={this.onScrollStart.bind(this)}
                           onScrollEnd={this.onScrollEnd.bind(this)}>
                     <div className="appointmentbox" >
                     
                         {
                              this.state.dataList.map((item,index) => 
                                   <OrderList key={index}{...item} />
                              )
                         }
                     <div id="pullUp" className="pull-up" display={this.state.display}><span id="pull_up_label">{this.state.more}</span></div>
                     </div>
                     </ReactIScroll>
                </div>
                
                <NoList display={this.state.nolist} />
                <Toast content={this.state.tipContent} display={this.state.display} callback={this.toastDisplay.bind(this)} />
            </div>
        );
    }
}

// Points.defaultProps = {
//     options: {
//         mouseWheel: true,
//         scrollbars: true
//     }
// }

var OrderList = React.createClass({
     render: function() {
          let {lastUpdateTime,variableMap} = this.props,
               tellNum = variableMap.businessPeople.butler.mobile,
               infoAddress= '';
          tellNum = tellNum.replace(/(\d+)-(\d+)-(\d+)-(\d+)/, "$1$2$3,$4");
          if(variableMap.addressInfo){
            let addressOne = variableMap.addressInfo.community?variableMap.addressInfo.community:"",
                addressTwo = variableMap.addressInfo.doorNum?variableMap.addressInfo.doorNum:"";
            infoAddress = addressOne + addressTwo;
          }
          return (
               <div className="appointmentlist">
                    <h3>{variableMap.goodsInfo.goodsGroup.goodsGroupName}</h3>
                    <p>
                         预约时间：{lastUpdateTime} <br/>
                         地址：{infoAddress} <br/>
                         备注：{variableMap.appointmentParam.remark?variableMap.appointmentParam.remark:""}
                    </p>
                    <h3 className="generoname">您的专属管家：{variableMap.businessPeople.butler.empName}<a href={`tel:`+tellNum}><button>联系他</button></a></h3>
                </div>
          );
     }
});



var NoList = React.createClass({
  render: function() {
    return (
        <div style={{ display: this.props.display }} className="no-list">
            <img src={require("../images/appointment/icon-appoint.png")} style={{width: '1.63rem'}} />
            <p>预约单还是空的，去逛逛吧~ <br/></p>
            <a href="http://m.jyall.com"><button>继续逛逛</button></a>
        </div>
    );
  }
});

export default Appointment;
process.env.NODE_ENV !== 'production' && module.hot.accept();