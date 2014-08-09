if (!window.adriver || (window.adriver.version.substr(0, 3) != '2.3')) {
    window.adriver = function (ph, prm, defer) {
        if (this instanceof adriver) {
            var my = this, p = ph;
            if (typeof(p) == 'string')p = document.getElementById(ph); else ph = p.id;
            if (!p)return null;
            if (adriver.items[ph])return adriver.items[ph];
            my.p = p;
            my.defer = defer;
            my.prm = adriver.extend(prm, {ph: ph});
            my.loadCompleteQueue = new adriver.queue();
            my.domReadyQueue = new adriver.queue(adriver.isDomReady);
            adriver.initQueue.push(function () {
                my.init()
            });
            return adriver.items[ph] = my
        } else {
            return arguments.length ? adriver.items[ph] : adriver.items
        }
    }
    adriver.prototype = {isLoading: 0, init: function () {
    }, loadComplete: function () {
    }, domReady: function () {
    }, onLoadComplete: function (f) {
        var my = this;
        my.loadCompleteQueue.push(function () {
            f.call(my)
        });
        return my
    }, onDomReady: function (f) {
        this.domReadyQueue.push(f);
        return this
    }, reset: function () {
        this.loadCompleteQueue.flush();
        this.domReadyQueue.flush(adriver.isDomReady);
        return this
    }}
    adriver.extend = function () {
        for (var l = arguments[0], i = 1, len = arguments.length, r, j; i < len; i++) {
            r = arguments[i];
            for (j in r) {
                if (r.hasOwnProperty(j)) {
                    if (r[j] instanceof Function) {
                        l[j] = r[j]
                    } else if (r[j] instanceof Object) {
                        if (l[j]) {
                            adriver.extend(l[j], r[j])
                        } else {
                            l[j] = adriver.extend(r[j] instanceof Array ? [] : {}, r[j])
                        }
                    } else {
                        l[j] = r[j]
                    }
                }
            }
        }
        return l
    }
    adriver.extend(adriver, {version: '2.3.1.1', defaults: {tail256: escape(document.referrer || 'unknown')}, items: {}, options: {}, plugins: {}, pluginPath: {}, redirectHost: '//ad.adriver.ru', defaultMirror: '//content.adriver.ru', loadScript: function (req) {
        try {
            var head = document.getElementsByTagName('head')[0], s = document.createElement('script');
            s.setAttribute('type', 'text/javascript');
            s.setAttribute('charset', 'windows-1251');
            s.setAttribute('src', req.split('![rnd]').join(Math.round(Math.random() * 9999999)));
            s.onreadystatechange = function () {
                if (/loaded|complete/.test(this.readyState))head.removeChild(s)
            };
            s.onload = function (e) {
                head.removeChild(s)
            };
            head.insertBefore(s, head.firstChild)
        } catch (e) {
        }
    }, onDomReady: function (f) {
        adriver.domReadyQueue.push(f)
    }, onBeforeDomReady: function (f) {
        adriver.domReadyQueue.unshift(f)
    }, domReady: function () {
        adriver.isDomReady = true;
        adriver.domReadyQueue.execute()
    }, onLoadComplete: function (f) {
        adriver.loadCompleteQueue.push(f);
        return adriver
    }, loadComplete: function () {
        adriver.loadCompleteQueue.execute();
        return adriver
    }, setDefaults: function (o) {
        adriver.extend(adriver.defaults, o)
    }, setOptions: function (o) {
        adriver.extend(adriver.options, o)
    }, setPluginPath: function (o) {
        adriver.extend(adriver.pluginPath, o)
    }, queue: function (flag) {
        this.q = [];
        this.flag = flag ? true : false
    }, Plugin: function (id) {
        if (this instanceof adriver.Plugin) {
            if (id && !adriver.plugins[id]) {
                this.id = id;
                this.q = new adriver.queue();
                adriver.plugins[id] = this;
            }
        }
        return adriver.plugins[id]
    }});
    adriver.queue.prototype = {push: function (f) {
        this.flag ? f() : this.q.push(f)
    }, unshift: function (f) {
        this.flag ? f() : this.q.unshift(f)
    }, execute: function (flag) {
        var f, undefined;
        while (f = this.q.shift())f();
        if (flag == undefined)flag = true;
        this.flag = flag ? true : false
    }, flush: function (flag) {
        this.q.length = 0;
        this.flag = flag ? true : false
    }}
    adriver.Plugin.prototype = {loadingStatus: 0, load: function () {
        this.loadingStatus = 1;
        adriver.loadScript((adriver.pluginPath[this.id.split('.').pop()] || (adriver.defaultMirror + '/plugins/')) + this.id + '.js')
    }, loadComplete: function () {
        this.loadingStatus = 2;
        this.q.execute();
        return this
    }, onLoadComplete: function (f) {
        this.q.push(f);
        return this
    }}
    adriver.Plugin.require = function () {
        var my = this, counter = 0;
        my.q = new adriver.queue();
        for (var i = 0, len = arguments.length, p; i < len; i++) {
            p = new adriver.Plugin(arguments[i]);
            if (p.loadingStatus != 2) {
                counter++;
                p.onLoadComplete(function () {
                    if (counter-- == 1) {
                        my.q.execute()
                    }
                });
                if (!p.loadingStatus)p.load()
            }
        }
        if (!counter) {
            my.q.execute()
        }
    };
    adriver.Plugin.require.prototype.onLoadComplete = function (f) {
        this.q.push(f);
        return this
    }
    adriver.domReadyQueue = new adriver.queue();
    adriver.loadCompleteQueue = new adriver.queue();
    adriver.initQueue = new adriver.queue();
    adriver.domReady();
    new adriver.Plugin.require('autoUpdate.adriver').onLoadComplete(function () {
        adriver.initQueue.execute()
    })
}
var ar_ph = '{{id}}';
new adriver(ar_ph, {bt: 52, sid: 1}, 1);
new adriver.Plugin.require('old.adriver').onLoadComplete((function (ph) {
    return function () {
        try {
            var a = adriver(ph);
            a.reply = {ph: ph, rnd: '123', bt: 52, sid: 0, pz: 0, sz: '', bn: 0, sliceid: 0, netid: 0, ntype: 0, tns: 0, adid: 0, bid: 0, cgihref: 'http://www.ru/?', target: '_blank', width: '', height: '', alt: 'Adriver', mirror: '{{server}}'};
            a.reply.comppath = a.reply.mirror;
            adriver.loadScript(a.reply.comppath + 'script.js' + '?v' + ph);
//if(construct)s+='adriver.Plugin.require("checkFlash.adriver", "makeFlash.adriver", "makeImage.adriver", "MPU.adriver")';
        } catch (e) {
        }
    }
})(ar_ph));