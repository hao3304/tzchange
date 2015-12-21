/**
 * Created by jack on 2015/12/2.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var filter = require("component/filter/filter.js");
var template = require("component_modules/template.js");


module.exports  = Vue.extend({
    inherit:true,
    template:__inline("home.html"),
    data: function () {
        return {
            tabs:[
                {name:"地图",className:"icon-map-marker",key:"map"},
                {name:"列表",className:"icon-list",key:"list"}
            ],
            query:{
                yunit:0,
                phone:"",
                status:-1,
                keywords:"",
                datatype:-1
            },
            form:{
                ids:"",
                lnglat:"",
                place:"",
                datatype:-1,
                content:"",
                user:""
            },
            content:"", /*反馈*/
            list:[],
            targetTab:"map",
            images:[],
            compId:"",
            ids:[]
        }
    },
    methods:{
        renderMap: function () {
            var  map = this.Map = new L.map("map",{
                minZoom: 1,
                maxZoom: 18,
                center: [28.658128746033, 121.41615288591],
                zoom: 15
            });

            this.markerLayer = new L.layerGroup().addTo(map);

//                var slmap = new L.TileLayer("http://tmap.tzsjs.gov.cn/services/wmts/chinaemap?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=chinaemap&STYLE=default&TILEMATRIXSET=esritilematirx&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fpng&token=AD0C3FECD10270F9C5C75D3630C48532",
//                        {
//                            maxZoom: 18,
//                            minZoom: 1,
//                            subdomains:['0','1','2','3','4','5','6','7']
//                        });
//
//                var yxmap = new L.TileLayer("http://tmap.tzsjs.gov.cn/services/wmts/chinaimgmap?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=chinaimgmap&STYLE=default&TILEMATRIXSET=esritilematirx&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fpng&token=AD0C3FECD10270F9C5C75D3630C48532",
//                        {
//                            maxZoom: 18,
//                            minZoom: 1,
//                            subdomains:['0','1','2','3','4','5','6','7']
//                        });
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
        onTabChange: function (k) {
            this.targetTab = k;
        },
        renderTable: function () {
            this.loadTableList();
        },
        loadTableList: function () {
            var self = this;
            this.loading = true;
            Service.getChanges({
                yunit:this.query.yunit,
                phone:"",
                status:this.query.status < 0?"":this.query.status,
                keywords:"",
                datatype:this.query.datatype < 0?"":this.query.datatype
            }, function (rep) {
                self.list = rep;
                self.renderMarker(rep);

                self.loading = false;
            })
        },
        showFeedModal: function () {
            $("#feedModal").modal("show","fit");
        },
        hideFeedModal: function () {
            $("#feedModal").modal("hide");
        },
        showCompModal: function () {
            $("#compModal").modal("show");
        },
        showImgModal: function () {
            $("#imgModal").modal("show");
        },
        showMergeModal: function () {
            $("#mergeModal").modal("show");
        },
        hideMergeModal: function () {
            $("#mergeModal").modal("hide");
        },
        onQuery: function () {
            this.loadTableList();
        },
        onReset: function () {
            this.query.yunit= 0;
            this.query.phone="";
            this.query.status=-1;
            this.query.keywords="";
            this.loadTableList();
        },
        onBind: function (id) {
            var self = this;
            this.$on("onCheck", function (id) {
                var r = confirm("确定审核通过该记录？");
                if(r){
                    var self = this;
                    Service.changefeedback({id:id,status:1,content:"",user:this.auth.id},function(rep){
                        self.loadTableList();
                    })
                }
            });

            this.$on("onFeed", function (id) {
                self.compId = id;
                self.showFeedModal();
            });

            this.$on("onComp", function (id) {
                self.compId = id;
                self.showCompModal();
            });

            this.$on("onLookImage", function (imgs) {
                var images = imgs.split(",");
                for(var i in images){
                    images[i] = Service.prefix + images[i];
                }
                this.images = images;
                self.showImgModal();
            })
        },
        postFeed: function () {
            var self = this;
            this.loading = true;
            Service.changefeedback({id:this.compId,status:1,content:this.content,user:this.auth.id},function(rep){
                self.loading = false;
                self.hideFeedModal();
                self.loadTableList();
            })
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
                case 0:{
                    src += "wsh.png";
                }break;
                case 1:{
                    src += "ytg.png";
                }break;
                case 2:{
                    src += "sht.png";
                }break;
                case 3:{
                    src += "ytg.png";
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
                 <td class="text01">变化类型：</td>
                 <td class="text02"></td><td style="padding-right: 5px;">{{Base_Name}}</td>
                 </tr>
                 <tr>
                 <td class="text01">状态：</td>
                 <td class="text02"></td><td style="padding-right: 5px;">{{if Status == 0}}未审核{{else}}审核通过{{/if}}</td>
                 </tr>
                 <tr>
                 <td class="text01">上报单位：</td>
                 <td class="text02"></td><td style="padding-right: 5px;">{{Unit}}</td>
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
                 <td class="text01">变化内容：</td>
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
        },
        upPreFile: function () {
            Service.uploadprevimage(this.compId, function (rep) {
            })
        },
        onCheck: function (id) {
            var checked = window.event.target.checked;
            if(checked){
                this.ids.push(id);
            }else{
                var ids = this.ids,lst = [];
                for(var i=0;i<ids.length;i++){
                    if(ids[i] != id){
                        lst.push(ids[i])
                    }
                }
                this.ids = lst;
            }
        },
        isCheck: function (id) {
            var check = false,ids = this.ids;
            for(var i=0;i<ids.length;i++){
                if(ids[i] == id){
                    check= true;
                }
            }
            return check;
        },
        changemerge: function () {
            this.form.user = this.auth.id;
            this.form.ids = this.ids.join(",");
            var self = this;
            this.loading = true;
            Service.changemerge(this.form, function (rep) {
                self.loading = false;
                self.hideMergeModal();
                self.renderTable();
            })
        },
        panTo: function (latlng) {
            var latlng = latlng.replace("POINT(","").replace(")","").split(" ");
            this.targetTab = "map";
            this.Map.panTo([parseFloat(latlng[1]),parseFloat(latlng[0])],15);
        },
        onDel: function (id) {
            var r = confirm("确定删除该工单？");
            if(r){
                var self = this;
                self.loading = true;
                Service.changedelete({id:id,user:this.auth.id}, function (rep) {
                    self.loading = false;
                    self.renderTable();
                })
            }
        }
    },
    ready: function () {
        this.renderMap();
        this.renderTable();
        this.onBind();

        var self = this;
        this.$on("flyTo", function (d) {
            self.panTo(d.latlng)
        })
    }
})


