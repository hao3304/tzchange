/**
 * Created by jack on 2015/8/24.
 */

var Vue = require("component_modules/vue.js");
var Router = require('component_modules/director').Router;

module.exports = Vue.component("c-nav",{
    template:__inline("nav.html"),
    props:["view","username"],
    data: function () {
        return {
            "func": [
                {
                    name: "变化工单",
                    key: "home",
                    img:"/static/images/order.png",
                    active: true,
                    child:[]
                },
                {
                    name: "商户入驻",
                    key: "merchant",
                    img:"/static/images/shrz.png",
                    active: false,
                    child:[]
                },
                {
                    name: "变化统计",
                    key: "stat",
                    img:"/static/images/bhtj.png",
                    active: false,
                    child:[]
                },
               /* {
                    name: "变化对比",
                    key: "contrast",
                    img:"/static/images/bhdb.png",
                    active: false,
                    child:[]
                },*/
                {
                    name: "历史查询",
                    key: "history",
                    img:"/static/images/lscx.png",
                    active: false,
                    child:[]
                },
                {
                    name: "系统管理",
                    key: "config",
                    img:"/static/images/xtgl.png",
                    active: false,
                    child:[
                        {
                            name:"单位管理",
                            key:"unit",
                            active:false
                        },
                        {
                            name:"系统用户管理",
                            key:"user",
                            active:false
                        },
                        {
                            name:"手机用户管理",
                            key:"mobile",
                            active:false
                        },
                        {
                            name:"日志管理",
                            key:"log",
                            active:false
                        }
                    ]
                }

            ],
            "active":""
        }
    },
    watch:{
        "view": function (v) {
            for(var i in this.func){
                this.func[i].active = false;
                if(this.func[i].key == v){
                    this.func[i].active = true;
                }

                if(this.func[i].child.length > 0){
                    var child = this.func[i].child;
                    for(var c in child){
                        child[c].active = false;
                        if(child[c].key == v){
                            this.func[i].active = true;
                            child[c].active = true;
                        }
                    }
                }
            }
        }
    },
    methods:{
        layout: function () {

            window.localStorage["changeUser"] = "";
            window.localStorage["changeUserName"] = "";

            var router = new Router();
            router.setRoute("login");
            setTimeout(function () {
                window.location.reload()
            },200)
        }
    }
});