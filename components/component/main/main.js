
var Vue = require('component_modules/vue');
var Router = require('component_modules/director').Router;
var home = require('components/page/home/home');
var Service = require('main/service.js');

require("loading/loading.js");
require("nav/nav.js");


window.app = new Vue({
    el:"#app",
    data:{
        contentHeight:document.documentElement.clientHeight-230,
        "currentView":"",
        "loading":false, /*是否显示加载*/
        "base":{
            "units":[],
            datatype:[],
            changeStatus:[
                {text:"全部状态",value:-1},
                {text:"未审核",value:0},
                {text:"审核通过",value:1}
            ]
        },
        auth:{
            id:"",
            name:""
        }
    },
    components:{
        "home":home
    },
    methods:{
        init: function () {
            this.getUnits();
            this.getDataType();
        },
        getUnits: function () {
            var self = this;
            Service.getChangeUnits({id:"",parent:""},function(rep){
                var lst = [];
                for(var i=0;i<rep.length;i++){
                    if(i!=0){
                        lst.push({text:rep[i].Unit_Name,value:rep[i].ID});
                    }
                }
                self.base.units = lst;
            })
        },
        getDataType: function () {
            var self = this;
            Service.getChangeTypes(21,function(rep){
                var lst = [];
                for(var i=0;i<rep.length;i++){
                    lst.push({text:rep[i].Base_Name,value:rep[i].ID});
                }
                self.base.datatype =lst;
            })
        },
        _onFeed: function (id,e) {
            window.app.$broadcast("onFeed",id);
            window.event.stopPropagation();
        },
        _onCheck: function (id) {
            window.app.$broadcast("onCheck",id);
            window.event.stopPropagation();
        },
        _onComp: function (id) {
            window.app.$broadcast("onComp",id);
            window.event.stopPropagation();
        },
        _onLookImage: function (id) {
            window.app.$broadcast("onLookImage",id);
            window.event.stopPropagation();
        }

    },
    ready: function () {

        if(window.location.hash.indexOf("login")<0){
            $("body").css("background-color","#fff");
            var userid = window.localStorage["changeUser"];
            var username = window.localStorage["changeUserName"];
            if(!userid){
                alert("请先登录");
                var router = new Router();
                router.setRoute("login");
            }else{
                this.auth.id = userid;
                this.auth.name = username;
            }
        }
        this.init();
    }
});


/*过场动画*/
Vue.transition('slide', {
    enter: function (el) {
        $(el).css({
            "opacity":0,
            "margin-top":20
        }).animate({
            "opacity":1,
            "margin-top":0
        },300,"linear");
    },
    leave: function (el) {
        if(el > 0 ){
            $(el).remove();
        }
    }
});


var router = new Router();

function doRouter(view,component){
    var coms = window.app.$options.components;

    if(!coms[view]){
        coms[view] = component;
    }
    app.currentView = view;
}

router.on("/home",function(){
    app.currentView = "home";
});

router.on("/stat",function(){
    require.async(["page/stat/stat.js"], function (p) {
        doRouter("stat",p);
    })
});

router.on("/error",function(){
    require.async(["page/error/error.js"], function (p) {
        doRouter("error",p);
    })
});


router.on("/unit",function(){
    require.async(["page/unit/unit.js"], function (p) {
        doRouter("unit",p);
    })
});

router.on("/user",function(){
    require.async(["page/user/user.js"], function (p) {
        doRouter("user",p);
    })
});

router.on("/mobile",function(){
    require.async(["page/mobile/mobile.js"], function (p) {
        doRouter("mobile",p);
    })
});

router.on("/login",function(){
    require.async(["page/login/login.js"], function (p) {
        doRouter("login",p);
    })
});

router.on("/merchant",function(){
    require.async(["page/merchant/merchant.js"], function (p) {
        doRouter("merchant",p);
    })
});

router.on("/log",function(){
    require.async(["page/log/log.js"], function (p) {
        doRouter("log",p);
    })
});
router.on("/history",function(){
    require.async(["page/history/history.js"], function (p) {
        doRouter("history",p);
    })
});

router.configure({
    notfound: function () {
        router.setRoute("/error")
    }
});

router.init("/login");


