(function(e){function t(t){for(var r,a,u=t[0],c=t[1],s=t[2],f=0,p=[];f<u.length;f++)a=u[f],o[a]&&p.push(o[a][0]),o[a]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);l&&l(t);while(p.length)p.shift()();return i.push.apply(i,s||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],r=!0,u=1;u<n.length;u++){var c=n[u];0!==o[c]&&(r=!1)}r&&(i.splice(t--,1),e=a(a.s=n[0]))}return e}var r={},o={remote:0},i=[];function a(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=e,a.c=r,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="/";var u=window["webpackJsonp"]=window["webpackJsonp"]||[],c=u.push.bind(u);u.push=t,u=u.slice();for(var s=0;s<u.length;s++)t(u[s]);var l=c;i.push([2,"chunk-vendors"]),n()})({0:function(e,t){},"0e7a":function(e,t,n){},2:function(e,t,n){e.exports=n("970c")},"52a5":function(e,t,n){},"718f":function(e,t,n){"use strict";var r=n("0e7a"),o=n.n(r);o.a},"970c":function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("097d");var r=n("2b0e"),o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},["welcome"==e.state?n("the-mobile-home-screen",{on:{"code-accepted":e.joinGame}}):e._e(),"joined-game"==e.state?n("the-enter-name-screen"):e._e()],1)},i=[],a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"the-mobile-home-screen"}},[n("div",{staticClass:"container"},[e._m(0),n("form",{on:{submit:function(t){return t.preventDefault(),e.emitCodeSubmitted(t)}}},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.inputCode,expression:"inputCode"}],staticClass:"text-input",attrs:{placeholder:"Game Code"},domProps:{value:e.inputCode},on:{input:function(t){t.target.composing||(e.inputCode=t.target.value)}}}),n("button",{staticClass:"mobile-main-button",attrs:{type:"submit"},on:{":click":e.emitCodeSubmitted}},[e._v("Continue")])])])])},u=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("h1",[e._v("Battle"),n("br"),e._v("of the"),n("br"),e._v("Planets")])}],c={name:"TheMobileHomeScreen",data:function(){return{inputCode:""}},methods:{emitCodeSubmitted:function(){this.$emit("code-accepted",this.inputCode)}}},s=c,l=(n("718f"),n("2877")),f=Object(l["a"])(s,a,u,!1,null,null,null);f.options.__file="TheMobileHomeScreen.vue";var p=f.exports,m=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"the-enter-home-screen"}},[n("div",{staticClass:"container"},[e._m(0),n("form",{on:{submit:function(e){e.preventDefault()}}},[n("input",{staticClass:"text-input",attrs:{placeholder:"First Name"}}),n("button",{staticClass:"mobile-main-button"},[e._v("Join Game")])])])])},d=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("h1",[e._v("Battle"),n("br"),e._v("of the"),n("br"),e._v("Planets")])}],v={name:"TheEnterNameScreen"},b=v,h=(n("f3e2"),Object(l["a"])(b,m,d,!1,null,null,null));h.options.__file="TheEnterNameScreen.vue";var _=h.exports,g=r["a"].extend({name:"AppRemote",components:{TheMobileHomeScreen:p,TheEnterNameScreen:_},data:function(){return{state:"welcome"}},methods:{joinGame:function(e){var t=this;t.$socket.emit("join-session",e,function(e){e.error?alert(e.error):(t.state="joined-game",alert("Joined Game. You're: "+e.username))})}}}),C=g,j=(n("deb8"),Object(l["a"])(C,o,i,!1,null,null,null));j.options.__file="AppRemote.vue";var y=j.exports,S=n("0a12"),w=n.n(S),x=n("8055"),O=n.n(x);r["a"].config.productionTip=!1,r["a"].use(w.a,O()()),new r["a"]({render:function(e){return e(y)}}).$mount("#app")},deb8:function(e,t,n){"use strict";var r=n("52a5"),o=n.n(r);o.a},ee2f:function(e,t,n){},f3e2:function(e,t,n){"use strict";var r=n("ee2f"),o=n.n(r);o.a}});
//# sourceMappingURL=remote.488a3c5c.js.map