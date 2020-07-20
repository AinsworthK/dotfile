Registry.require(["promise","helper","xmlhttprequest","cloud","tools"],function(){var r=Registry.log,b=Registry.get("promise"),y=Registry.get("helper"),z=Registry.get("xmlhttprequest"),I=z.run,A=Registry.get("cloud"),B=Registry.get("tools"),l=0,p={ePASTEBIN:1,eCHROMESYNC:2,eSYNCFS:3,eGDRIVE:4,eDROPBOX:5,eWEBDAV:6,eYANDEX:7,eONEDRIVE:8},x=[],t=!1,v=null,D=[{method:"HEAD",url:"https://www.google.com",extract:function(a,b){try{var c=z.parseHeaders(b).date;if(c)return new Date(c)}catch(l){}return null}},
{method:"GET",url:"https://json-time.appspot.com/time.json",extract:function(a){try{var b=JSON.parse(a);if(!b.error&&b.datetime)return new Date(b.datetime)}catch(c){}return null}}],g=function(){var a=function(a){var c=a.type,g=a.id,d,m=function(a,h){if(h==l){var b=a.name,n=/.user.js$/;r.debug("si: cloud file changed",b,a);(b.match(/.meta.json$/)||b.match(n))&&x.forEach(function(k){k(b)})}},e={},p;return{init:function(a){d=A[c](y.assign(a,{path:"sync"}));return b.Pledge().then(function(){if(!d.credentials&&
!a.basic_auth)return d.list()}).then(function(){p||(p=d.changes.listen(),p.progress(function(a){m(a,g)}));return!0})},list:function(a){return d.list(a).then(function(a){e={};var b={},n={},k,u,w=Date.now();a.forEach(function(f){e[f.name]=f;var a=/.meta.json$/,h=/.user.js$/;if(f.modified>w)r.debug("si: ignore future list item",w,f);else if((k=f.name.match(a))||(u=f.name.match(h)))k?(f.uuid=a=f.name.replace(a,""),f.lastModified=f.modified,f.precision=f.precision,b[a]=f):u&&(a=f.name.replace(h,""),n[a]=
f)});return Object.keys(b).map(function(f){var a;if(a=b[f])return a.source=n[f],a.options=a.options||{},a}).filter(function(a){return a})})},setSource:function(a,h){var c=a+".user.js",n=e[c],k;return b.Pledge(!1).then(function(){if(n&&d.compare)return d.compare(n,h)}).then(function(a){if(a)return r.debug("si: remote source data matches, skip upload of",c),b.Pledge();k=new Blob([h],{type:"text/plain"});return d.put(n||c,k)})},getSource:function(a,h){var c=a+".user.js",n=e[c];if(n)return b.Pledge(!1).then(function(){if(h&&
d.compare)return d.compare(n,h)}).then(function(a){return a?(r.debug("si: remote source data matches, skip download of",c),b.Pledge(h)):d.get(n).then(B.readAsText)});r.warn("si: list cache does not contain this UUID",a);return b.Breach()},getMeta:function(a){var h;return(h=e[a+".meta.json"])?d.get(h).then(B.readAsText).then(function(b){var c;var k=null;try{k=JSON.parse(b)}catch(u){}k&&k.uuid?b=k:(r.debug("si: unable to parse extended info of undefined"),b=null);if((c=b)&&(c.uuid=a))return c.lastModified=
h.modified||c.lastModified,c.precision=h.precision,c.options=c.options||{},c}):b.Breach()},setMeta:function(a,b){var c=new Blob([JSON.stringify(a)],{type:"text/plain"}),n=a.uuid+".meta.json";return d.put(e[n]||n,c,b)},remove:function(a){a.options.removed=Date.now()+v;var b=new Blob([JSON.stringify(a)],{type:"text/plain"});return d.put(a.uuid+".meta.json",b).then(function(){var b;if(b=e[a.uuid+".user.js"])return d.delete(b)})},reset:function(){return d.list(!0).then(function(a){return a=a.filter(function(a){var b=
/.user.js$/;return a.name.match(/.meta.json$/)||a.name.match(b)})}).then(function(a){var c=[];a.forEach(function(a){c.push(function(){var c=b();d.delete(a).always(function(){c.resolve()});return c.promise()}())});return b.when(c).always(function(){e={}})})},getRemoteUrl:function(a){if(d.getRemoteUrl)return d.getRemoteUrl(a.uuid+".user.js")},getRemoteDomains:function(){if(d.getRemoteDomains)return d.getRemoteDomains()}}},m=a({type:"drive",id:p.eGDRIVE}),c=a({type:"dropbox",id:p.eDROPBOX}),g=a({type:"onedrive",
id:p.eONEDRIVE}),e=a({type:"webdav",id:p.eWEBDAV}),a=a({type:"yandex",id:p.eYANDEX}),t=function(){var a=!1,c,e=function(a,u){l==p.eCHROMESYNC&&"sync"==u&&b.Pledge().then(function(){if(null===v)return E()}).then(function(){var b=new RegExp(c+"$");a&&Object.keys(a).forEach(function(f){var c=a[f];r.debug('si: storage key "%s" in namespace "%s" changed. Old value was "%s", new value is "%s".',f,u,c.oldValue,c.newValue);if(-1!=f.search(b))for(var e=0;e<x.length;e++)if(!h[f]){var d=m(c.newValue,f);if(d)x[e](f,
d)}})})},d=function(a){var c=b(),w=[];a?g().done(function(b){w=y.select(b,function(c){return c.item&&c.item.uuis==a});c.resolve(w)}).fail(function(a){c.reject(a)}):c.resolve(w);return c.promise()},g=function(){return F(function(){var a=b(),u=new RegExp(c+"$");rea.storage.sync.get(null,function(c){var b=[];c&&Object.keys(c).forEach(function(a){-1!=a.search(u)&&b.push({key:a,item:m(c[a],a)})});a.resolve(b)});return a.promise()})},m=function(a,c){var b=null;try{b=JSON.parse(a)}catch(f){}return b&&(b.url||
b.options)?b:(r.debug("si: unable to parse extended info of "+c),null)},C=function(a){return a.then(function(a){var c={};a=y.select(a,function(a,b){if(!c[a.key])return c[a.key]=!0});if(1<a.length){var f=b(),k=[],e=a.pop();a.forEach(function(a){k.push(t(a.key))});b.when(k).done(function(){f.resolve(e)});return f.promise()}return b.Pledge(a[0])})},q=null,h={},t=function(a,c){var e=b();rea.storage.sync.remove(a,function(a){(a=rea.runtime.lastError)?e.reject(a):e.resolve()});return e.promise()},n=function(a){var c=
b();rea.storage.sync.set(h,function(a){(a=rea.runtime.lastError)?c.reject(a):(h={},c.resolve())});return c.promise()};return{init:function(){var k=!0;if(!a)try{rea.storage.onChanged.addListener(e),a=!0}catch(d){r.warn("si: error registering sync callback: "+d.message),k=!1}c="@v2";return b.Pledge(k)},list:function(){return b.Pledge().then(function(){if(null===v)return E()}).then(function(){return g()}).then(function(a){var e=new RegExp(c+"$"),d=[];a.forEach(function(a){var c=a.key,b=a.item;a=c.replace(e,
"");var k=null;if(k=h[c]?m(h[c],c):b)c=k.options||{},b=!!c.removed,d.push({id:a,uuid:b?a:k.uuid,lastModified:b?c.removed:k.lastModified,url:k.url,options:c})});return b.Pledge(d)})},setMeta:function(a,e){var m=b();C(d(a.uuid)).done(function(b){var d;b?(d=b.key,b=b.item):(d=a.uuid+c,b={});b.url=a.url;b.options=a.options||{};b.uuid=a.uuid;e.lastModified&&(b.lastModified=e.lastModified);h[d]=JSON.stringify(b);q&&window.clearTimeout(q);q=window.setTimeout(n,3E3);m.resolve()});return m.promise()},remove:function(a){var e=
b();C(d(a.uuid)).done(function(b){var d;b?(d=b.key,b=b.item):(d=a.uuid+c,b={});b.options=b.options||{};b.options.removed=Date.now()+v;h[d]=JSON.stringify(b);q&&window.clearTimeout(q);q=window.setTimeout(n,3E3);e.resolve()});return e.promise()},reset:function(){return F(function(){var a=b();rea.storage.sync.clear(function(){h={};a.resolve()});return a.promise()})}}}(),q={};rea.storage.sync.supported&&(q[p.eCHROMESYNC]=t);q[p.eGDRIVE]=m;q[p.eDROPBOX]=c;q[p.eONEDRIVE]=g;q[p.eWEBDAV]=e;q[p.eYANDEX]=a;
return q}(),G=function(){var a=b(),m=0,c=function(){if(m<D.length){var b=D[m];I({method:b.method,url:b.url},{ondone:function(e){4==e.readyState&&200==e.status?(e=b.extract(e.responseText,e.responseHeaders),null===e?(m++,window.setTimeout(c,1)):a.resolve(e)):(m++,window.setTimeout(c,1))}})}else a.reject(void 0)};c();return a.promise()},E=function(){var a=b();G().done(function(a){v=a.getTime()-Date.now()}).fail(function(){v=0;r.log("si: time offset detection failed!")}).always(a.resolve);return a.promise()},
F=function(a,m){var c=b();void 0===m&&(m=3);var g=function(){if(t)window.setTimeout(g,500);else{t=!0;try{a().always(function(){t=!1}).done(function(){c.resolve.apply(this,arguments)}).fail(function(){0<--m?(r.log("si: some retries left, wait for",6E4,"ms"),window.setTimeout(g,6E4)):(r.warn("si: no retries left, skipping this sync request!"),c.reject("no retries left"))})}catch(b){r.warn(b),t=!1,c.reject(b)}}};g();return c.promise()},H={init:function(a,m){x=[];l=a;return g[l]?g[l].init(m).done(function(a){}):
b.Breach()},getUtc:G,debug:function(a){},addChangeListener:function(a){x.push(a)},getRemoteUrl:function(a){if(g[l]&&g[l].getRemoteUrl)return g[l].getRemoteUrl(a)},getRemoteDomains:function(){if(g[l]&&g[l].getRemoteDomains)return g[l].getRemoteDomains()},caps:function(){var a={};Object.defineProperties(a,{specialMeta:{get:function(){return g[l]&&!!g[l].getMeta},enumerable:!0},syncsSource:{get:function(){return g[l]&&!!g[l].getSource},enumerable:!0}});return a}(),types:p};"list setMeta getMeta setSource getSource reset remove".split(" ").forEach(function(a){H[a]=
function(){return g[l]&&g[l][a]?g[l][a].apply(this,arguments):b.Pledge()}});Registry.register("syncinfo","6095",function(a){A.init(function(g){var c=b(),l=a.openAndWatch({url:g.url},function(a){a?c&&c.notify(a):c&&(c.resolve("tab closed"),c=null)});return{promise:c.promise(),close:function(){l.cancel()}}});return H})});
