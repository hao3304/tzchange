/**
 * Created by jack on 2015/12/2.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");

module.exports = Vue.extend({
    inherit:true,
    template:__inline("log.html"),
    data: function () {
        return {
            list:[]
        }
    },
    methods:{
        render: function () {
          this.getList();
        },
        getList: function () {
            var self = this;
            self.loading = true;
            Service.logs({user:"",keywords:""}, function (rep) {
                self.list = rep;
                self.loading = false;
            })
        }
    },
    ready: function () {
        this.render();
    }
})