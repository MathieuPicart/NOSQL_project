(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{12:function(t,e,n){},13:function(t,e,n){},15:function(t,e,n){"use strict";n.r(e);var c=n(0),i=n.n(c),s=n(3),a=n.n(s),o=(n(12),n(4)),r=n(5),u=n(7),l=n(6),h=(n.p,n(13),n(1)),p=function(t){Object(u.a)(n,t);var e=Object(l.a)(n);function n(t){var c;return Object(o.a)(this,n),(c=e.call(this,t)).state={response:{}},c}return Object(r.a)(n,[{key:"callAPI",value:function(){var t=this;fetch("/api").then((function(t){return t.json()})).then((function(e){t.setState({response:e})}))}},{key:"componentWillMount",value:function(){this.callAPI()}},{key:"render",value:function(){return Object(h.jsx)("div",{className:"App",children:Object(h.jsx)("h2",{className:"App-intro",children:this.state.response.message})})}}]),n}(i.a.Component),f=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,16)).then((function(e){var n=e.getCLS,c=e.getFID,i=e.getFCP,s=e.getLCP,a=e.getTTFB;n(t),c(t),i(t),s(t),a(t)}))};a.a.render(Object(h.jsx)(i.a.StrictMode,{children:Object(h.jsx)(p,{})}),document.getElementById("root")),f()}},[[15,1,2]]]);
//# sourceMappingURL=main.ddd11a98.chunk.js.map