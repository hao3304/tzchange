/**
 * Created by jack on 2015/12/2.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");

module.exports = Vue.extend({
    inherit:true,
    template:__inline("unit.html"),
    data: function () {
        return {
            list:[],
            do:"添加",
            unit:{
                id:"",
                unitname:"",
                unitaddress:"",
                contacter:"",
                contactphone:"",
                parent:0
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
            Service.getChangeUnits({id:"",parent:""}, function (rep) {
                var list = [];
                for(var i=1;i<rep.length;i++){
                    list.push(rep[i]);
                }
                self.list = list;

                self.loading = false;

            })
        },
        onAddUnit: function () {
            this.do = "添加";
            this.unit.id = "";
            this.unit.unitname = "";
            this.unit.unitaddress = "";
            this.unit.contacter = "";
            this.unit.contactphone = "";
            this.showModel();
        },
        onEditUnit: function (l) {
            this.do = "编辑";
            this.unit.id = l.ID;
            this.unit.unitname = l.Unit_Name;
            this.unit.unitaddress = l.Unit_Address;
            this.unit.contacter = l.Contacter;
            this.unit.contactphone = l.Contact_Phone;
            this.showModel();
        },
        onSubmit: function () {
            if(this.unit.id){
                this.updateUnit();
            }else{
                this.addUnit();
            }
        },
        onDelUnit: function (id) {
            var r = confirm("是否删除该单位？");
            if(r){
                var self = this;
                this.loading = true;
                Service.deleteunit(id, function (rep) {
                    self.loading = false;
                    self.renderList();
                })
            }
        },
        updateUnit: function () {
            this.loading = true;
            var self = this;
            Service.modifyunit(this.unit, function (rep) {
                self.loading = false;
                self.renderList();
                self.hideModal();
            })
        },
        addUnit: function () {
            this.loading = true;
            var self = this;
            Service.addunit(this.unit, function (rep) {
                self.loading = false;
                self.renderList();
                self.hideModal();
            })
        },
        showModel: function () {
            $("#unitModal").modal("show");
        },
        hideModal: function () {
            $("#unitModal").modal("hide");
        }
    },
    ready: function () {
        this.render();
    }
})