/**
 * Created by jack on 2015/12/2.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var filter = require("component/filter/filter.js");
var template = require("component_modules/template.js");


module.exports  = Vue.extend({
    inherit:true,
    template:__inline("history.html"),
    data: function () {
        return {
            list:[],
            query:{
                phone:"",
                status:-1,
                datatype:-1,
                yunit:""
            }
        }
    },
    methods:{
        render: function () {
            this.getList();
            $('table.datatable').datatable({checkable: true,sortable:true});
        },
        getList: function () {
            this.loading = true;
            var self = this;
            Service.ochangequery({
                phone:this.query.phone,
                yunit:this.query.yunit,
                datatype:this.query.datatype < 0?"":this.query.datatype,
                status:this.query.status < 0 ?"":this.query.status
            }, function (rep) {
                self.loading = false;
                self.list = rep;
                Vue.nextTick(function () {
                    $('table.datatable').datatable('load');
                });
            })
        },
        onQuery: function () {
            this.getList();
        },
        onReset: function () {
            this.query.phone = "";
            this.query.status = -1;
            this.query.datatype= -1;
            this.query.yunit= "";
            this.getList();
        }
    },
    ready: function () {
        this.render();
    }
})


