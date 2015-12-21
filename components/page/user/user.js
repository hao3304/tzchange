/**
 * Created by jack on 2015/12/2.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");

module.exports = Vue.extend({
    inherit:true,
    template:__inline("user.html"),
    data: function () {
        return {
            list:[],
            do:"添加",
            user:{
                id:"",
                username:"",
                password:"",
                fullname:"",
                yunit:"",
                duty:"",
                phone:""
            }
        }
    },
    methods:{
        render: function () {
            this.renderList();
        },
        renderList: function () {
            var self = this;
            self.loading = true;
            Service.getUsers({username:"",fullname:"",unit:""}, function (rep) {
                self.list = rep;
                self.loading = false;
            })
        },
        onAddUser: function () {
            this.do = "添加";
            this.user.id = "";
            this.user.username = "";
            this.user.password = "";
            this.user.fullname = "";
            this.user.yunit = "";
            this.user.duty = "";
            this.user.phone = "";
            this.showModel();
        },
        onEditUser: function (l) {
            this.do = "编辑";
            this.user.id = l.ID;
            this.user.username = l.User_Name;
            this.user.password = l.Password;
            this.user.fullname = l.Full_Name;
            this.user.yunit = l.Unit;
            this.user.duty = l.Duty;
            this.user.phone = l.Phone;
            this.showModel();
        },
        onSubmit: function () {
            if(this.user.id){
                this.updateUser();
            }else{
                this.addUser();
            }
        },
        onDelUser: function (id) {
            var r = confirm("是否删除该用户？");
            if(r){
                var self = this;
                this.loading = true;
                Service.deleteuser(id, function (rep) {
                    self.loading = false;
                    self.renderList();
                })
            }
        },
        updateUser: function () {
            this.loading = true;
            var self = this;
            Service.modifyuser(this.user, function (rep) {
                self.loading = false;
                self.renderList();
                self.hideModal();
            })
        },
        addUser: function () {
            this.loading = true;
            var self = this;
            Service.adduser(this.user, function (rep) {
                self.loading = false;
                self.renderList();
                self.hideModal();
            })
        },
        showModel: function () {
            $("#userModal").modal("show");
        },
        hideModal: function () {
            $("#userModal").modal("hide");
        }
    },
    ready: function () {
        this.render();
    }
})