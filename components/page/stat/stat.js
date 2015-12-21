/**
 * Created by jack on 2015/12/2.
 */

var Vue = require("component_modules/vue.js");
var Service = require('main/service.js');

module.exports = Vue.extend({
    inherit:true,
    template:__inline("stat.html"),
    data: function () {
        return {
            view:"year"
        }
    },
    methods:{
        render: function () {
            this.renderYearChart();
            $(".menu").menu({});
        },
        renderChart: function () {

        },
        onTabChange: function (v) {
            this.view = v;
        },
        renderYearChart: function () {
            this.loading = true;
            var self = this;
            Service.changesstat(function (rep) {

                if(rep.length > 0){
                    var maxMon = rep[rep.length-1].UploadTime.split("-")[1];
                    var categories = self._getDate(maxMon);
                    var wsh = {
                            name:"未审核",
                            data:[]
                        },
                        wtg  ={
                            name:"未通过",
                            data:[]
                        },
                        ygx = {
                            name:"已更新",
                            data:[]
                        },
                        ytg = {
                            name:"已通过",
                            data:[]
                        }
                    for(var i in categories){
                        var a = 0,
                            b = 0,
                            c = 0,
                            d = 0;

                        for(var j =0;j<rep.length;j++){
                            if(rep[j].UploadTime == categories[i]){
                                a = rep[j]["WSH"];
                                b = rep[j]["WTG"];
                                c = rep[j]["YGX"];
                                d = rep[j]["YTG"];

                            }
                        }

                        wsh.data.push(a);
                        wtg.data.push(b);
                        ygx.data.push(c);
                        ytg.data.push(d);
                    }

                    self._renderYearChart(categories,[wsh,wtg,ygx,ytg]);
                    self.loading = false;
                }
            })

        },
        _renderYearChart: function (cate,data) {
            $('.year-chart').highcharts({
                title: {
                    text: '变化发现年度统计',
                    x: -20
                },
                credits:{
                    enabled:false
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: cate
                },
                yAxis: {
                    title: {
                        text: '个'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '个',
                    shared: true,
                    crosshairs: {
                        width: 2,
                        color: 'gray',
                        dashStyle: 'shortdot'
                    }
                },
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                series:data
            });
        },
        renderMerchantChart: function () {
            var self = this;
            this.loading = true;
            Service.businessstat(function (rep) {
                self.loading = false;

                if(rep.length > 0){
                    var maxMon = rep[0].UploadTime.split("-")[1];
                    var categories = self._getDate(maxMon);
                    var wsh = {
                            name:"未审核",
                            data:[]
                        },
                        wtg  ={
                            name:"未通过",
                            data:[]
                        },
                        ygx = {
                            name:"已更新",
                            data:[]
                        },
                        ytg = {
                            name:"已通过",
                            data:[]
                        }

                    for(var i in categories){
                        for(var j =0;j<rep.length;j++){
                            if(rep[j].UploadTime == categories[i]){
                                wsh.data.push(rep[j]["WSH"]);
                                wtg.data.push(rep[j]["WTG"]);
                                ygx.data.push(rep[j]["YGX"]);
                                ytg.data.push(rep[j]["YTG"]);

                            }else{
                                wsh.data.push(0);
                                wtg.data.push(0);
                                ygx.data.push(0);
                                ytg.data.push(0);
                            }
                        }
                    }

                    self._renderMerchantChart(categories,[wsh,wtg,ygx,ytg]);
                    self.loading = false;
                }
            })
        },
        _renderMerchantChart: function (cate,data) {
            $('.merchant-chart').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: '商户入驻年度统计',
                    x: -20
                },
                credits:{
                    enabled:false
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: cate
                },
                yAxis: {
                    title: {
                        text: '个'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '个',
                    shared: true,
                    crosshairs: {
                        width: 2,
                        color: 'gray',
                        dashStyle: 'shortdot'
                    }
                },
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                series:data
            });
        },
        renderUnitChart: function () {
            var units = this.base.units;
            var self = this;
            for(var i = 0;i<units.length;i++){
                (function(i){
                    Service.unitstat(units[i].value, function (rep) {
                        var data = [
                            ["未审核",rep.WSH],
                            ["未通过",rep.WTG],
                            ["已更新",rep.YGX],
                            ["已通过",rep.YTG]
                        ];
                        var title = units[i].text;
                        var target = $(".unit-chart-"+i);
                        self._renderUnitChart(target,title,data)
                    })
                })(i);
            }
        },
        _renderUnitChart: function (target,title,data) {
            target.parents(".panel-body:first").find(".wsh").html(data[0][1]);
            target.parents(".panel-body:first").find(".wtg").html(data[1][1]);
            target.parents(".panel-body:first").find(".ygx").html(data[2][1]);
            target.parents(".panel-body:first").find(".ytg").html(data[3][1]);

            target.highcharts({
                chart:{
                    height:200
                },
                credits:{
                    enabled:false
                },
                title: {
                    text: title
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: '工单',
                    data: data
                }]
            });
        },
        _getDate: function (max) {
            max = parseInt(max);
            var d = new Date();
            var year = d.getFullYear(),lst = [];
            for(var i = 1;i < (max+1);i++){
                var mon = i<10?("0"+String(i)):i;
                lst.push(year+"-"+mon);
            }
            return lst;
        }
    },
    watch:{
        view: function (v) {
            switch (v){
                case "year":this.renderYearChart();break;
                case "merchant":this.renderMerchantChart();break;
                case "unit":this.renderUnitChart();break;
            }
        }
    },
    ready: function () {
        this.render();
    }
})