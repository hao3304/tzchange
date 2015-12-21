/**
 * Created by jack on 2015/11/12.
 */


var Vue = require("component_modules/vue.js");

function tranDate(str){
    if(str){
        var stamp = str.replace("/Date(","").replace("+0800)/","");
        var date = new Date(parseInt(stamp));
        var year = date.getFullYear(),
            month = (date.getMonth()+1),
            day = date.getDate(),
            hour = date.getHours(),
            min = date.getMinutes();

        hour = hour<10?("0"+hour):hour;
        min = min<10?("0"+min):min;
        month = month<10?("0"+month):month;
        day = day<10?("0"+day):day;

        return year+"-"+month+"-"+day+" "+hour+":"+min;
    }else{
        return "";
    }
}


Vue.filter('datetime', function (str) {
    return tranDate(str);
});

Vue.filter("status", function (type) {
    switch (type){
        case 0:{
            return "δ���";
        }break;
        case 1:{
            return "���ͨ��";
        }break;
        case 2:{
            return "���ڴ���"
        }break;
        case 3:{
            return "�ѷ���"
        }break;
    }
});

Vue.filter("state", function (type) {
    switch (type){
        case 0:{
            return "ͣ��";
        }break;
        case 1:{
            return "����";
        }break;
    }
});

Vue.filter("ctype", function (type) {
    switch (type){
        case 0:{
            return "�˹�";
        }break;
        case 1:{
            return "�Զ�����";
        }break;
    }
});

Vue.filter("check_state", function (type) {
    switch (type){
        case 0:{
            return "δ���";
        }break;
        case 1:{
            return "���ͨ��";
        }break;
    }
});

Vue.filter("cycle_type", function (type) {
    switch (type){
        case 0:{
            return "��";
        }break;
        case 1:{
            return "��";
        }break;
        case 2:{
            return "��";
        }break;
        case 3:{
            return "��";
        }break;
        case 4:{
            return "�Զ��壨��λΪ�죩";
        }break;
    }
});

module.exports = {
    tranDate:tranDate
}