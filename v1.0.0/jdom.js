window.jdomActiveElement = null;
const SCREEN = {
    width:  window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth,
    height: window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight
}
function JDom (dom, doc) {
    doc = doc ? doc : document.body;
    doc.innerHTML = ""; 
    domBuilder(dom, doc);
    window.jdomGlobal = dom;
    domElementsObserve();
    domObjectObserve();
    if (jdomActiveElement) {
        const ae = document.getElementById(jdomActiveElement);
        ae.focus();
        ae.value = ae.value
    }
    function domObjectObserve() {
        /*
        var domTmp = null;
        setInterval(function(){
            if (JSON.stringify(domTmp) !== JSON.stringify(jdomGlobal)) {
                domTmp = jdomGlobal;
            }
        },1000)
        */
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
    function domBuilder (domObject, positionInDom) {
        try {
            domObject.map(function(elem){
                if (necessaryTagsCheck(elem)) {
                    var domElement = document.createElement(elem.tag || "div");
                    elem.id = elem.id ? elem.id : randomID();
                    Object.keys(elem).map(function(item){
                        try {
                            if (excludeTagsFromBuilding(item)) {
                                switch (item) {
                                    case "style": elem[item] = formattingStyle(elem[item], elem, domElement); break;
                                }
                            } else {
                                switch (item) {
                                    case "html": domElement.innerHTML = domEvaluateString(elem[item], elem); break;
                                }
                            }
                            if (elem[item]) domElement.setAttribute(item, domEvaluateString(elem[item], elem));
                        } catch (e) {}
                    })
                    positionInDom.appendChild(domElement);
                    if (elem["childs"]) domBuilder(elem["childs"], domElement);
                }
                elem.element = domElement;
            })
        } catch (e) {
            if (dom.length) {
                console.error("JDom::", e)
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
        const regExp = /\{([^)]+)\}/;
        var match = regExp.exec(str);
        if (match && str.indexOf("SELF")!==-1) {
            str = str.replace("SELF", "domObject");
            match = regExp.exec(str);
        }
        try {
            const result = eval(match[1]);
            return result;
        } catch (e) {
            return str;
        }
    }
    function formattingStyle(style, domObject, domElement) {
        if (typeof style === "string") return domEvaluateString(style, domObject);
        try {
            var styleArray = [];
            Object.keys(style).map(function(item){
                const match = item.match(/([A-Z])/g);
                var itemTmp = item;
                if (match) match.map(function(m){
                    item = item.replace(m,"-"+m.toLowerCase());
                })
                if (typeof style[itemTmp] === "number") {
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