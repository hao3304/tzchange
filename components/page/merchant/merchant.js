/**
 * Created by jack on 2015/12/2.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var filter = require("component/filter/filter.js");
var template = require("component_modules/template.js");
var Router = require('component_modules/director').Router;

module.exports  = Vue.extend({
    inherit:true,
    template:__inline("merchant.html"),
    data: function () {
        return {
            tabs:[
                {name:"地图",className:"icon-map-marker",key:"map"},
                {name:"列表",className:"icon-list",key:"list"}
            ],
            list:[],
            targetTab:"map",
            query:{
                businessname:"",
                phone:"",
                status:-1,
                datatype:-1
            }
        }
    },
    methods:{
        render: function () {
            this.getList();

        },
        getList: function () {
            this.loading = true;
            var self = this;
            Service.getBusiness({
                businessname:this.query.businessname,
                phone:this.query.phone,
                datatype:this.query.datatype <0?"":this.query.datatype,
                status:this.query.status < 0 ?"":this.query.status
            }, function (rep) {
                self.loading = false;
                self.list = rep;
                self.renderMarker(rep);
            })
        },
        onCheck: function (id) {
            var r = confirm("确定审核通过该商户入驻信息？");
            if(r){
                var self = this;
                Service.businessfeedback({id:id,status:1,content:"",user:""},function(rep){
                    self.getList();
                })
            }
        },
        onTabChange: function (k) {
            this.targetTab = k;
        },
        onQuery: function () {
            this.getList();
        },
        onReset: function () {
            this.query.businessname = "";
            this.query.phone = "";
            this.query.status= -1;
            this.query.datatype= -1;
            this.getList();
        },
        onDel: function (id) {
            var r = confirm("确定删除该入驻记录？");
            if(r){
                var self = this;
                self.loading = true;
                Service.businessdelete({id:id,user:this.auth.id}, function (rep) {
                    self.loading = false;
                    self.render();
                })
            }
        },
        panTo: function (latlng) {
            var latlng = latlng.replace("POINT(","").replace(")","").split(" ");
            this.targetTab = "map";
            this.Map.panTo([parseFloat(latlng[1]),parseFloat(latlng[0])],15);
        },
        renderMap: function () {
            var  map = this.Map = new L.map("merchant-map",{
                minZoom: 1,
                maxZoom: 18,
                center: [28.658128746033, 121.41615288591],
                zoom: 15
            });

            this.markerLayer = new L.featureGroup().addTo(map);
            var slmap = new L.tileLayer.chinaProvider("TianDiTu.Normal.Map",{
                maxZoom: 18,
                minZoom: 1
            });

            var slmapa = new L.tileLayer.chinaProvider("TianDiTu.Normal.Annotion",{
                maxZoom: 18,
                minZoom: 1
            });

            var yxmap = new L.tileLayer.chinaProvider("TianDiTu.Satellite.Map",{
                maxZoom: 18,
                minZoom: 1
            });
            var yxmapa = new L.tileLayer.chinaProvider("TianDiTu.Satellite.Annotion",{
                maxZoom: 18,
                minZoom: 1
            });

            var sl = new L.layerGroup([slmap,slmapa]).addTo(map),
                yx = new L.layerGroup([yxmap,yxmapa]);

            var baseLayers = {
                "矢量图": sl,
                "影像图": yx
            };
            L.control.layers(baseLayers, {}).addTo(map);
        },
        renderMarker: function (data) {
            this.markerLayer.clearLayers();
            for(var i =0;i<data.length;i++){
                if( data[i].Coords){
                    var latlng = data[i].Coords.replace("POINT(","").replace(")","").split(" ");
                    if(latlng.length>0){
                        var marker = new L.marker([parseFloat(latlng[1]),parseFloat(latlng[0])],{icon:this.getIcon(data[i].Status)});
                        marker.bindPopup(this.getTemp(data[i]),{className:"bubble",closeButton:false,offset:[0,-42]});
                        marker.addTo(this.Map);
                    }
                }
            }


        },
        getIcon: function (type) {
            var src = "/static/images/icon/";
            switch (type){
                case 1:{
                    src += "sh.png";
                }break;
            }
            return new L.icon({
                iconUrl:src,
                iconSize: [22, 30],
                iconAnchor: [11, 38]
            });
        },
        getTemp: function (data) {
            return  template.compile(this.parseHtml(function () {
                /*
                 <div class="site-box box-shadow-1">
                 <h2 class="blue">{{Place}}</h2>
                 <div class="site-content" >
                 <table cellpadding="0" cellspacing="0" style="width:100%">
                 <tr>
                 <td class="text01">商户名称：</td>
                 <td class="text02"></td><td style="padding-right: 5px;">{{Business_Name}}</td>
                 </tr>
                 <tr>
                 <td class="text01">行业类型：</td>
                 <td class="text02"></td><td style="padding-right: 5px;">{{Base_Name}}</td>
                 </tr>
                 <tr>
                 <td class="text01">状态：</td>
                 <td class="text02"></td><td style="padding-right: 5px;">{{if Status == 0}}未审核{{else}}审核通过{{/if}}</td>
                 </tr>
                 <tr>
                 <td class="text01">上报用户：</td>
                 <td class="text02"></td><td style="padding-right: 5px;">{{Phone_User}}</td>
                 </tr>
                 <tr>
                 <td class="text01">手机号码：</td>
                 <td class="text02"></td><td style="padding-right: 5px;">{{Phone}}</td>
                 </tr>
                 <tr>
                 <td class="text01">上报时间：</td>
                 <td class="text02"></td><td style="padding-right: 5px;">{{Upload_Time}}</td>
                 </tr>
                 <td class="text01">商户说明：</td>
                 <td class="text02"></td><td style="padding-right: 5px;">{{Content}}</td>
                 </tr>

                 {{if Imgs}}
                 </tr>
                 <td class="text01">现场照片：</td>
                 <td class="text02"></td><td style="padding-right: 5px;"><a href="javascript:;" onclick="window.app._onLookImage('{{Imgs}}')">查看照片<span class="icon icon-picture"></span></a></td>
                 </tr>
                 {{/if}}
                 </table>
                 </div>
                 <div class="triangle"></div>
                 </div>
                 */
            }))(data)
        },
        parseHtml: function (fn) {
            return fn.toString()
                .replace(/^[^\/]+\/\*!?\s?/,"")
                .replace(/\*\/[^\/]+$/,"")
        }
    },
    ready: function () {
        this.render();
        this.renderMap();
    }
})


