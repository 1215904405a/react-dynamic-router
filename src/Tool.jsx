import merged from 'obj-merged';
// import * as config from './Config/Config';
import { Router, Route, IndexRoute, browserHistory,hashHistory, Link } from 'react-router';
import cookie from 'react-cookie';
import {COMMON_HEADERS} from './constants/headers';
import URLS from './constants/urls';
const Tool = {};



/**
 * (加载数据)
 * 
 * @method Fetch
 */
Tool.fetch = function(obj,data){
    if(typeof fetch != "undefined"){
        var d = {
          method: data.type,
          headers: data.headers
        },
        status = 0;
        if(data.body){d.body = data.body;}
        fetch(data.url,d).then(response => {
            status = response.status;
            obj.setState&&obj.setState({ajaxDisplay: "none",maskDisplay: "none"}); 
            return response.json();
        }).then(json => { 
            data.successMethod(json,status);
            if(status >= 500){
                // alert(status);
                // if(json.code == -1){
                //     json.message = '网络繁忙，请稍后再试';
                // }
                obj.setState({ tipContent: json.message?json.message:'网络繁忙，请稍后再试',display: 'toasts' });
            }
        },function(e){
            data.successMethod("",status);
        });
    }else {
        try {
            var xmlhttp,status = 0;
            if (window.XMLHttpRequest){
                xmlhttp=new XMLHttpRequest();
            }
            else {
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange=function()
            {  
                if (xmlhttp.readyState==4)
                {
                    obj.setState&&obj.setState({ajaxDisplay: "none",maskDisplay: "none"});
                    let json=xmlhttp.responseText?eval("("+ xmlhttp.responseText +")"):xmlhttp.responseText;
                    if(xmlhttp.status >= 500){
                        // if(json.code == -1){
                        //     json.message = '网络繁忙，请稍后再试';
                        // }
                        obj.setState({ tipContent: json.message?json.message:'网络繁忙，请稍后再试',display: 'toasts' });
                    }
                    status = xmlhttp.status;
                    if(!xmlhttp.responseText){
                        data.successMethod(xmlhttp.responseText,status);
                    }else{
                        data.successMethod(json,status);
                    }
                }
            }
            xmlhttp.open(data.type,data.url,data.sync?false:true);
            xmlhttp.setRequestHeader("content-type","application/json");
            xmlhttp.setRequestHeader("sign", "50970DC4C28118A4F76411505B277B7D");  
            xmlhttp.setRequestHeader("deviceid", "M");
            xmlhttp.setRequestHeader("tokenid", cookie.load('tokenid'));
            xmlhttp.setRequestHeader("APPkey", "b40538ab5bef1ffd18605efda7f820d9");
            xmlhttp.setRequestHeader("version", "2.0.0");
            
            if(data.type == "post" || data.type == "put"){
                xmlhttp.send(data.body?data.body:"");
            }else{
                xmlhttp.send();
            }  
            

            // if(data.type && data.type == "post"){
            //     xmlhttp.open("post",data.url,data.sync?false:true);
            //     headersSet(xmlhttp);
            //     if(data.formData){//用于文件上传
            //         xmlhttp.send(data.formData);
            //     }else{
            //         
            //     }
            // }else if(data.type && data.type == "get"){
            //     xmlhttp.open("get",data.url,data.sync?false:true);
            //     headersSet(xmlhttp);
            //     // if(data.userToken)xmlhttp.setRequestHeader("User-Token", data.userToken);
            //     xmlhttp.send();
            // }


            var timeout = data.timeout?data.timeout:40000;
            // xmlhttp.timeout = setTimeout(function(){
            //     if(xmlhttp.readyState!=4 || xmlhttp.status!=200){
            //         xmlhttp.abort();
            //         if(data.endLoading) data.endLoading();//结束加载中
            //         noNetwork();
            //     }
            //     if(data.timeoutMethod){
            //         //alert("5s超时，将关闭！");
            //         if(data.endLoading) data.endLoading();//结束加载中
            //         data.timeoutMethod();
            //     }
            // },timeout);
        } catch(e) {
            console.log(e.name +" "+ e.message);
        } finally {

        }
    }

}

/**
 * 检测登录
 * 
 * @method loginChecked
 */
Tool.loginChecked = function(obj,method){
    if(!cookie.load('tokenid')){
        if(method){method();return;}
        Tool.history.push('/');
    }else{
        Tool.fetch(obj,{
            url: `${URLS.TOKENCHECKED}${cookie.load('tokenid')}`,
            type: "get",
            headers: COMMON_HEADERS,
            successMethod: function(json){
                if(!json.loginFlag){
                    if(method){method();return;}
                    Tool.history.push('/');
                }
            }
        });
    }
} 

/**
 * (毫秒转化 2016-10-18 17:02:09)
 * 
 * @method formatSeconds
 */
Tool.formatSeconds = function(seconds){
    let date=new Date(seconds);
    function numTowDisplay(num){
            if(num < 10 && num >= 0){
                num = "0"+num;
            }
            return num+"";
    }
    return numTowDisplay(date.getFullYear())+"-"+numTowDisplay(date.getMonth()+1)+"-"+numTowDisplay(date.getDate())+
    " "+numTowDisplay(date.getHours())+":"+numTowDisplay(date.getMinutes())+":"+numTowDisplay(date.getSeconds());
}
/**
 * 保留2位小数，如：2，会在2后面补上00.即2.00
 * 
 * @method formatSeconds
 */
Tool.toDecimal2 = function(x){
     var f = parseFloat(x);    
        if (isNaN(f)) {    
            return false;    
        }    
        var f = Math.round(x*100)/100;    
        var s = f.toString();    
        var rs = s.indexOf('.');    
        if (rs < 0) {    
            rs = s.length;    
            s += '.';    
        }    
        while (s.length <= rs + 2) {    
            s += '0';    
        }    
    return s; 
}
Tool.rem = function(){
    let rem,window_w;
    function resetREM(){
        window_w = window.innerWidth;
        rem = window_w / 750 * 100;
        document.getElementsByTagName('html')[0].style.fontSize = rem + 'px';
    }
    window.onload = window.onresize = resetREM;
}

//获取路由方式
Tool.history = process.env.NODE_ENV !== 'production' ? browserHistory : hashHistory;

Tool.trim = function(str){  //删除左右两端的空格
    return str.replace(/(^\s*)|(\s*$)/g, "");
}


/**
 * 格式化时间
 * 
 * @param {any} t
 * @returns
 */
Tool.formatDate = function (str) {
    var date = new Date(str);
    var time = new Date().getTime() - date.getTime(); //现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
    if (time < 0) {
        return '';
    } else if (time / 1000 < 60) {
        return '刚刚';
    } else if ((time / 60000) < 60) {
        return parseInt((time / 60000)) + '分钟前';
    } else if ((time / 3600000) < 24) {
        return parseInt(time / 3600000) + '小时前';
    } else if ((time / 86400000) < 31) {
        return parseInt(time / 86400000) + '天前';
    } else if ((time / 2592000000) < 12) {
        return parseInt(time / 2592000000) + '月前';
    } else {
        return parseInt(time / 31536000000) + '年前';
    }
}

/**
 * 本地数据存储或读取
 * 
 * @param {any} key
 * @param {any} value
 * @returns
 */
Tool.localItem = function (key, value) {
    if (arguments.length == 1) {
        return localStorage.getItem(key);
    } else {
        return localStorage.setItem(key, value);
    }
}

/**
 * 删除本地数据
 * 
 * @param {any} key
 * @returns
 */
Tool.removeLocalItem = function (key) {
    if (key) {
        return localStorage.removeItem(key);
    }
    return localStorage.removeItem();
}

export {Tool, merged}