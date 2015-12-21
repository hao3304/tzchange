/**
 * Created by jack on 2015/12/2.
 */

var Vue = require("component_modules/vue.js");

module.exports = Vue.extend({
    inherit:true,
    template:__inline("error.html"),
    data: function () {
        return {
            height:"100%"
        }
    },
    methods:{

    },
    ready: function () {
    }
})