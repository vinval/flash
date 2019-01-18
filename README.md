![Alt text](https://github.com/vinval/JDom/blob/master/logo_small.png?raw=true "JDOM")
# JDOM INTRODUCTION
###### v1.0.0
## Compile simple javascript/json to obtain html
---
#### First of all declare the script reference into your main html then write your script after the body tag.

#### So create main html page like index.html

```html
<!doctype html>
<html>
    <head>
        <title>JDom</title>
        <script type="text/javascript" src="path/to/jdom.js"></script>
    </head>
    <body>
    </body>
</html>
```
#### After that insert your script where you want after the body tag.

---

#### Every DOM element is represented by an object in array like the example below.

```javascript
/*
    JDom(siteStructure [array], domElement [HTMLElement])
    the second argument is optional (if not specified is body)
    or if declared could be a string (id element) or HTMLElement
*/

JDom([
    {} //this is a <div></div>
])
```
#### Inside the object you can add others by two properties:

1. html [string] (correspond to HTMLElement.innerHTML)
2. childs [array] (correspond to HTMLElement.appendChild)

## html property
```javascript
JDom([
    {
        html: "<input type='text' value='...'/>"
    }
])
```
##### creates this html code
```html
<body>
    <div>
        <input type='text' value='...'/>
    </div>
</body>
```
## childs property
```javascript
JDom([
    {
        childs: [
            {}, // first div
            {}  // second div
        ]
    }
])
```
##### creates this html code
```html
<body>
    <div>
        <div></div>
        <div></div>
    </div>
</body>
```
---
# JDOM PROPERTIES
#### JDom has different properties you can use as html attributes.
#### All properties are optional. By defaul property tag value is div.

## Special properties
#### not visible in the elements structure inside inspector
| Property Name | Value Typeof    |
|---------------|-----------------|
|tag            |string           |
|html           |string           |
|childs         |array            |
|hover          |object           |
|focus          |object           |
|active         |object           |

## Standard properties
#### depends on tag you would to create
| Property Name | Value Typeof              | Note                                 |
|---------------|---------------------------|--------------------------------------|
|id             |string                     |if not declared it is auto generated  |
|style          |string or animation object |                                      |
|type           |string                     |                                      |
|width          |string or number           |reserved to table, img, ...           |
|height         |string or number           |reserved to table, img, ...           |
|onclick        |string                     |                                      |
|onkeyup        |string                     |                                      |
|...            |                           |                                      |

## Reserved* property
#### not visible in the elements structure inside inspector
| Property Name | Value Typeof    |
|---------------|-----------------|
|element        |HTMLElement      |

###### *JDom has a global object inside his parent (window) who is called jdomGlobal where you retreive each object with element property that contains the real HTMLElement 

---
# FROM OBJECT TO HTMLElement
## JDom input
```javascript
{
    tag: "input",
    type: "checkbox",
    checked: true
}
```
## HTML input tag
```html
<input type="checkbox" checked/>
```
:
## JDom button
```javascript
{
    tag: "button",
    html: "click me!",
    onclick: "alert('clicked!')"
}
```
## HTML button tag
```html
<button onclick="alert('clicked!')">click me!</button>
```
:

---
# JDOM METHODS
#### Two methods allow you to compile faster your HTML page
## JDomConcat
```javascript
// you can use JDomConcat() or __c()

const styles = {
    div: {
        color: "#f00",
        backgroundColor: "#000"
    }
}

JDom([
    {
        style: JDomConcat(
            styles.div,
            {
                height: 100
            }
        )
    }
])
```
##### collapse two or more objects
## JDomTransform
```javascript
/* 
    you can use JDomTransform() or __t()

    JDomTransform (
        htmlQueryReference [string], 
        movementsObject [object], // the property must be composed by numeric array [start,stop] 
        duration [number], // (optional) milliseconds 
        callback [function] // (optional)
    ) 
*/

JDomTransform(
    "#someId",
    {
        scale: [0,2],
        translateX: [100,500]
    },
    1000,
    function(){
        alert("Wow! transformation complete.")
    }
)
```
##### provide to animate HTMLElements by style transformation
## JDomFind
```javascript
/*
    you can use JDomFind(#id) or __f()
*/

console.info(JDomFind("ID"))
```
##### returns an object that contains element based on ID with self, path and parent properties
## JDomModule
```javascript
/*
    you can use JDomModule("path/to/file") or __m() just inside the server
    use of extension is necessary if it isn't json
*/

{
    tag: "input",
    style: JDomModule("path/to/file"))
}
```
##### returns file callback (json object for example)
## JDomPrettify
```javascript
/*
    you can use JDomPrettify() or __p()
*/

JDomPrettify() 
```
##### stylize and removes margins from the body

---
# JDOM STYLE
## STYLE PROPERTY METHODS
#### as string value (static mode)
```javascript
{
    style: "background-color: red; color: white"
}
```
#### as object value (dynamic mode)
```javascript
{
    style: {
        backgroundColor: "red",
        color: "white"
    }
}
```
#### as object value (dynamic mode with query)
```javascript
{
    style: {
        backgroundColor: "red",
        color: "white",
        width: SCREEN.width
    }
}
```
## STYLE ANIMATIONS
#### Using an object as a property value, you can animate the style
| Property Name | Value Typeof     | Note                     |Optional|default|
|---------------|------------------|--------------------------|--------|-------|
|range          |numeric array     | [n,n1,n2,n3,...]         |no      |       |
|type           |string            | "px" or "deg" ...        |yes     |auto   |
|duration       |numeric           | cycle duration           |yes     |1000   |
|delay          |numeric           | cycle delay              |yes     |0      |
|loop           |boolean or numeric| true is infinite         |yes     |false  |

```javascript
{
    style: {
        width: {
            range: [0,100,0],
            duration: 2500,
            delay: 10000
        }
    }
}
```
---
# JDOM PSEUDO-CLASSES
## HOVER PROPERTY
#### you can use this to see changes when mouse gets hover the element and goes outside
| Property Name | Value Typeof    |
|---------------|-----------------|
|hover          |object           |
```javascript
{
    style: {
        width: 10
    },
    hover: {
        width: 100
    }
}
```
## FOCUS PROPERTY
#### you can use this to see changes when an element is focused
| Property Name | Value Typeof    |
|---------------|-----------------|
|focus          |object           |
```javascript
{
    style: {
        width: 10
    },
    focus: {
        width: 100
    }
}
```
## ACTIVE PROPERTY
#### you can use this to see changes when an element is actived
| Property Name | Value Typeof    |
|---------------|-----------------|
|active         |object           |
```javascript
{
    style: {
        width: 10
    },
    active: {
        width: 100
    }
}
```
---
# JDOM QUERIES
#### All properties can be used by query. To do this assign string value to the property with double curly brackets.
#### In this case you can use the reseved object words like below
| Reserved Word | Typeof           | Return           |
|---------------|------------------|------------------|
|SCREEN         |object            |width:[num]       |
|               |                  |height:[num]      |
|SELF           |object            |this child object |
|PARENT         |object            |this parent object|

```javascript
    {
        html: "{{SELF.id}}",
        style: {
            width: SCREEN.width/2,
            height: SCREEN.height
        }
    }
```
---
# JDOM EXAMPLE
#### index.html
```html
<!doctype html>
<html>
    <head>
        <title>JDom</title>
        <script type="text/javascript" src="jdom.js"></script>
    </head>
    <body>
    </body>
</html>
<script type="text/javascript" src="site.js"></script>
```
#### site.js
```javascript
const styles = {
    main: {
        width: SCREEN.width,
        height: SCREEN.height,
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: '#333',
        color: "white"
    },
    child: {
        width: SCREEN.height/3,
        height: SCREEN.height/3,
        backgroundColor: '#fff',
        borderRadius: {
            range: [0,SCREEN.height/1.5],
            duration: 300,
        },
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        color: '#222',
        opacity: {
            range: [0.0,0.2,1.0],
            duration: 300
        }
    }
}

JDom([
    {
        id: "main",
        style: styles.main,
        childs: [
            {
                id: "child",
                html: "Hello JDom!",
                style: styles.child,
                hover: {
                    color: "red"
                }
            }
        ]
    }
]);

JDomTransform(
    "#child",
    {
        scale: [10,1]
    },
    150
)

JDomPrettify();
```
