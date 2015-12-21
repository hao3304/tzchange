/**
 * Created by jack on 2015/12/2.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Router = require('component_modules/director').Router;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("login.html"),
    data: function () {
        return {
            height:"100%",
            user:{
                userName:"",
                pwd:""
            }
        }
    },
    methods:{
        onLogin: function () {
            var self = this;
            this.loading = true;
            Service.login(this.user, function (rep) {
                self.loading = false;
                if(rep.length > 0){
                    window.localStorage["changeUser"] = rep[0].ID;
                    window.localStorage["changeUserName"] = rep[0].Full_Name;

                    self.auth.id = rep[0].ID;
                    self.auth.name = rep[0].Full_Name;

                    var router = new Router();
                    router.setRoute("home");
                }
            });

            $("body").css("background-color","#fff");

        }
    },
    ready: function () {

    }
})