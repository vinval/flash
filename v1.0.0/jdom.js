window.jdomActiveElement = null;
window.jdomDocChoosed = null;
const SCREEN = {
    width:  window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth,
    height: window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight
}

function JDom (dom, doc) {
    doc = doc 
        ? typeof doc === "string"
            ? document.getElementById(doc)
            : doc 
        : document.body;
    doc.innerHTML = ""; 
    domBuilder(dom, doc);
    window.jdomGlobal = dom;
    window.jdomDocChoosed = doc;
    domElementsObserve();
    if (jdomActiveElement) {
        const ae = document.getElementById(jdomActiveElement);
        ae.focus();
        ae.value = ae.value
    }
    
    function domElementsObserve() {
        Array.prototype.slice.call(document.querySelectorAll("input")).map(function(input){
            input.addEventListener('change', function (evt) {
                if (this.type !== "text") {
                    if (this.type === "radio") {
                        const radios = this.parentNode.querySelectorAll('input[type="radio"]');
                        Array.prototype.slice.call(radios).map(function(radio){
                            domVariableSearch(radio.id, "__delete__", "checked");        
                        })
                    }
                    domVariableSearch(this.id, this.checked ? true : "__delete__", "checked");
                }
            });
            input.addEventListener('input', function (evt) {
                domVariableSearch(this.id, this.value, "value");
            });
        })
    }
    
    function domVariableSearch(id, value, property, obj) {
        jdomActiveElement = id;
        obj = obj ? obj : window.jdomGlobal;
        try {
            obj.map(function(o){
                if (o.id === id) {
                    o[property] = value;
                    if (value === "__delete__") delete o[property]
                    return false;
                }
                if (o.childs) domVariableSearch(id, value, property, o.childs)
            })
        } catch (e) {
            console.log(e)
        }
    }

    function cssPseudo (domElement, elem, pseudo) {
        var style = {};
        var eventIn, eventOut;
        switch (pseudo) {
            case "hover": eventIn = "mouseenter"; eventOut = "mouseleave"; break;
            case "focus": eventIn = "focus"; eventOut = "blur"; break;
            case "active": eventIn = "mousedown"; eventOut = "mouseup"; break;
        };
        domElement.addEventListener(eventIn, function(){
            style = __f(elem.id).self.style;
            style = style ?  stringifyStyle(style) : {};
            domElement.style = parseStyle(
                __c(style, elem[pseudo]),
                elem,
                domElement
            )
        })
        domElement.addEventListener(eventOut, function(){
            domElement.style = parseStyle(
                style, 
                elem,
                domElement
            )
        })
    }

    function domBuilder (domObject, positionInDom) {
        try {
            domObject.map(function(elem){
                if (necessaryTagsCheck(elem)) {
                    var domElement = document.createElement(elem.tag || "div");
                    elem.id = "id" in elem ? elem.id : randomID();
                    Object.keys(elem).map(function(item){
                        try {
                            if (excludeTagsFromBuilding(item)) {
                                switch (item) {
                                    case "style": domElement.setAttribute(item, domEvaluateString(parseStyle(elem[item], elem, domElement), elem)); break;
                                }
                            } else {
                                switch (item) {
                                    case "html": if (typeof elem[item] === "number") domElement.innerHTML = elem[item]; else domElement.innerHTML = domEvaluateString(elem[item], elem); break;
                                    case "hover": cssPseudo (domElement, elem, "hover"); break;
                                    case "focus": cssPseudo (domElement, elem, "focus"); break;
                                    case "active": cssPseudo (domElement, elem, "active"); break;
                                }
                            }
                        } catch (e) {}
                    })
                    positionInDom.appendChild(domElement);
                    if (elem["childs"]) domBuilder(elem["childs"], domElement);
                }
                elem.element = domElement;
            })
        } catch (e) {
            if (dom.length) {
                console.info("JDom:: childs attribute must be array")
            }
        }
        
        function randomID() {
            const cases = "@-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var id = "";
            for (var n=0; n<10; n++) id+=cases[Math.floor(Math.random()*cases.length)];
            return id;
        }
    }
    
    function domEvaluateString(str, domObject) {
        const regExp = /{{(.*?)}}/g;
        var matches = regExp.exec(str);
        if (matches && str.indexOf("SELF")!==-1) str = str.replace(/SELF/g, "__f('"+domObject.id+"').self");
        if (matches && str.indexOf("PARENT")!==-1) str = str.replace(/PARENT/g, "__f('"+domObject.id+"').parent");
        str = str.replace(/{{/g,"").replace(/}}/g,"");            
        matches = regExp.exec(str);
        try {
            return eval(matches[1]);
        } catch (e) {
            return str;
        }
    }
        
    function stringifyStyle (style) {
        if (typeof style === "string") {
            var s = style.split(";");
            var r = {};
            s.map(function(e){
                const prop = e
                    .split(":")[0]
                    .split("-")
                    .map(function(a,k){
                        if (k>0) 
                            return a.charAt(0).toUpperCase()+a.substr(1)
                        else
                            return a
                    })
                    .join("");
                const value = e
                    .split(":")[1]
                r[prop] = value
            })
            return r;
        } else {
            return style;
        }
    }
    
    function parseStyle(style, domObject, domElement) {
        if (typeof style === "string") return domEvaluateString(style, domObject);
        try {
            var styleArray = [];
            Object.keys(style).map(function(item){
                const match = item.match(/([A-Z])/g);
                var itemTmp = item;
                if (match) match.map(function(m){
                    item = item.replace(m,"-"+m.toLowerCase());
                })
                if (typeof style[itemTmp] === "number" && itemTmp !== "flex") {
                    style[itemTmp] = style[itemTmp]+"px";
                }
                if (typeof style[itemTmp] === "string") 
                    style[itemTmp] = typeof domEvaluateString(style[itemTmp], domObject) === 'number' ?
                        domEvaluateString(style[itemTmp], domObject)+"px"
                        : domEvaluateString(style[itemTmp], domObject);
                if (typeof style[itemTmp] === "object") {
                    const props = style[itemTmp];
                    const delay = props.delay || 0;
                    const duration = props.duration || 1000;
                    const rangeLength = props.range.length-1;
                    const timeout = (duration/rangeLength)/10;
                    const type = props.type || (itemTmp !== "opacity") ? "px" : "";
                    var loops = 0;
                    looping()
                    function looping() {
                        var c = 0;
                        try {
                            var startValue = domEvaluateString(props.range[c], domObject);
                            var stopValue = domEvaluateString(props.range[c+1], domObject);
                            var delta = (stopValue-startValue)>1 ? 1 : -1;
                            var intervalCounter = 0;
                            var increment = Number((Math.abs(stopValue-startValue)/(timeout)).toFixed(2));
                            domElement.style[item] = Number(startValue.toFixed(2))+type;
                            setTimeout(function(){
                                var mainInterval = setInterval(function(){
                                    domElement.style[item] = Number(startValue.toFixed(2))+type;
                                    startValue+=(increment*(itemTmp !== "opacity" ? delta : 1));
                                    intervalCounter++
                                    if (intervalCounter>=timeout) {
                                        intervalCounter=0;
                                        c++;
                                        if (c>=rangeLength) {
                                            clearInterval(mainInterval)
                                            domElement.style[item] = Number(stopValue.toFixed(2))+type;
                                            loops++;
                                            if (typeof props.loop === "boolean" && props.loop) looping();
                                            if (typeof props.loop === "number" && props.loop>loops) looping();
                                        };
                                        startValue = domEvaluateString(props.range[c], domObject);
                                        stopValue = domEvaluateString(props.range[c+1], domObject);
                                        delta = (stopValue-startValue)>1 ? 1 : -1;
                                        increment = Number((Math.abs(stopValue-startValue)/timeout).toFixed(2));
                                    }
                                },1)
                            },delay)
                        } catch (e) {
                            console.error("JDom::", "please check your range. It must have at least 2 elements.");
                        }
                    }
                }
                styleArray.push(item+":"+style[itemTmp]);
            })
            return styleArray.join(";")
        } catch (e) {}
        return null;
    }

    function excludeTagsFromBuilding(item) {
        const attrList = [
            "tag",
            "childs",
            "html",
            "element",
            "hover",
            "focus",
            "active",
            "visited"
        ];
        if (attrList.indexOf(item)!==-1) 
            return false;
        return true
    }

    function necessaryTagsCheck (element) {
        const refs = Object.keys(element);
        var tagsList = [];
        var check = true;
        tagsList.map(function(tag){
            if (refs.indexOf(tag)===-1) {
                check = false;
                console.error("JDom::", tag+" element is necessary");
            }
        })
        if (!check) {
            console.info("JDom:: info");
            console.info("Necessary Tags: "+tagsList);
        }
        return check;
    }
}

const __c = JDomConcat = function () {
    const len = arguments.length;
    var ret = {};
    for (var i=0; i<len; i++) {
      for (p in arguments[i]) {
        try {
            if (arguments[i].hasOwnProperty(p)) {
              ret[p] = arguments[i][p];
            }
        } catch (e) {
            console.error("JDom::", "check your arguments in JDomConcat. They must be objects.");
        }
      }
    }
    return ret;
}

const __p = JDomPrettify = function () {
    document.body.style.boxSizing = "border-box";
    document.body.style.padding = "0px";
    document.body.style.margin = "0px";
}

const __t = JDomTransform = function (htmlQueryReference, movementsObject, duration, callback) {
    const elements = document.querySelectorAll(htmlQueryReference);
    Array.prototype.slice.call(elements).map(function(elem) {
        const i = setInterval(frame, 1);
        var incrementation = 0;
        elem.style.transform = settingMovement (incrementation);
        function frame() {
            if (incrementation == 1) {
                clearInterval(i);
            } else {
                incrementation+= duration ? (6/duration) : 0.1;
                if (incrementation > 1) {
                    incrementation = 1;
                    if (callback) setTimeout(function(){callback()},50);
                }
            }
            elem.style.transform = settingMovement (incrementation);
        }
    })
    
    function settingMovement (inc) {
        var transformation = [];
        Object.keys(movementsObject).map(function(mov){
            var type = "";
            if (mov.indexOf("translate")!==-1) type = "px";
            if (mov.indexOf("rotate")!==-1) type = "deg";
            transformation.push(
                mov+"("+(movementsObject[mov][0]+((movementsObject[mov][1]-movementsObject[mov][0])*inc))+type+")"
            );
        })
        return transformation.join(" ");
    }
}

const __f = JDomFind = function (id) {
    var found = false
    function recursive(id, obj, index, parent) {
        const jg = obj ? obj : window.jdomGlobal;
        var index = index ? index : [];
            parent = parent ? parent : null;
        if (typeof jg === "object" && jg.length > 0) {
            jg.map(function(e,k){
                if (e.id === id) {
                    index.push(k);
                    e.width = "width" in e
                        ? e.width
                        : e.element.offsetWidth;
                    e.height = "height" in e
                        ? e.height
                        : e.element.offsetHeight;
                    if (parent) {
                        parent.width = "width" in parent
                            ? parent.width
                            : parent.element.offsetWidth;
                        parent.height = "height" in parent
                            ? parent.height
                            : parent.element.offsetHeight;
                    }
                    found = {
                        self: e,
                        path: index,
                        parent: parent
                    };
                    return true;
                } else if ("childs" in e) {
                    index.push(k);
                    recursive(id, e.childs, index, e)
                } else {
                    return false
                }
            })
        }
    }
    recursive(id);
    return found
}

const __i = JDomInclude = function(filePath) {
    if (window.location.protocol !== "file:") {
        const splice = filePath.split(".");
        filePath = splice.length>1 ? filePath : filePath+".js";
        var req = new XMLHttpRequest();
        req.open("GET", filePath, false); // 'false': synchronous.
        req.send(null);
        var headElement = document.getElementsByTagName("head")[0];
        var newScriptElement = document.createElement("script");
        newScriptElement.type = "text/javascript";
        newScriptElement.text = req.responseText;
        headElement.appendChild(newScriptElement);
    } else {
        console.error("Jdom::", "you cannot use JDomModule outside server");
        return false;
    } 
};

const __m = JDomModule = function(filePath) {
    if (window.location.protocol !== "file:") {
        const splice = filePath.split(".");
        filePath = splice.length>1 ? filePath : filePath+".json";
        // Load json file;
        function JDomloadTextFileAjaxSync(filePath, mimeType) {
            var xmlhttp=new XMLHttpRequest();
            xmlhttp.open("GET",filePath+"?updated="+(new Date().getTime()),false);
            if (mimeType != null) {
                if (xmlhttp.overrideMimeType) {
                    xmlhttp.overrideMimeType(mimeType);
                }
            }
            xmlhttp.send();
            if (xmlhttp.status==200) {
                return xmlhttp.responseText;
            }
            else {
                // TODO Throw exception
                return null;
            }
        }
        var json = JDomloadTextFileAjaxSync(filePath, "application/json");
        // Parse json
        return JSON.parse(json);
    } else {
        console.error("Jdom::", "you cannot use JDomModule outside server");
        return false;
    } 
};

JDom.prototype.update = function() {
    //console.log(this);
    JDom(jdomGlobal, jdomDocChoosed)
}

JDom.prototype.then = function(callback) {
    return callback(
        new Proxy(jdomGlobal, {
            get(target, key) {
                if (typeof target[key] === 'object' && target[key] !== null) {
                    return new Proxy(target[key], this)
                } else {
                    return target[key];
                }
            },
            set (target, key, value) {
                switch(key) {
                    case "html": __f(target.id).self.element.innerHTML = value; break;
                }        
                return true
            }
        })
    )
}

Array.prototype.find = function (id) {
    try {
        return eval("this"+__f(id).path.map(function(p){
            return "["+p+"]"
        }).join(".childs"))
    } catch (e) {
        console.log("JDom::", "check the scope there was a");
        return {}
    }
}

JDom.prototype.prettify = function () {
    JDomPrettify()
}
