<img width="100px" src="./flash.svg"/>{ FLASH.js }
# INTRODUCTION
###### v1.0.0
## Develope html and css simply coding javascript
---
#### First of all declare the script reference into your main html then write your script after the body tag.

#### Create main html page like index.html and insert your script where you want after the body tag

```html
<!doctype html>
<html>
    <head>
        <title>Flash</title>
        <script type="text/javascript" src="path/to/flash.js"></script>
    </head>
    <body>
    </body>
    <script type="text/javascript" src="path/to/site.js"></script>
</html>
```
---

#### Every DOM element is represented by an object in array like the example below.

```javascript
/*
    Flash(siteStructure [array], domElement [HTMLElement])
    the second argument is optional (if not specified is body)
    or if declared could be a string (element id) or HTMLElement
    after that you can get callback with then method and use it
    to update dom
*/

new Flash([
    {}
]).then((scope)=>{
    scope.find("elementId").html = "Hello Flash"; //find elementId inside dom and change his html
})
```
#### Inside the object you can add others by two properties:

1. html [string] (equivalent to HTMLElement.innerHTML)
2. childs [array] (equivalent to HTMLElement.appendChild)
## creating any html element
```javascript
new Flash([
    {}, //this is equivalent to <div></div>,
    {
        tag: "input" //this is equivalent to <input/>
    }
])
```
## childs property
```javascript
new Flash([
    {
        childs: [
            {}, // first div
            {}  // second div
        ]
    }
])
```
##### equivalent html code
```html
<body>
    <div>
        <div></div>
        <div></div>
    </div>
</body>
```
## html property
```javascript
new Flash([
    {
        html: "<input type='text' value='...'/>"
    }
])
```
##### equivalent html code
```html
<body>
    <div>
        <input type='text' value='...'/>
    </div>
</body>
```
---
# PROPERTIES
#### Flash has different properties you can use as html attributes.
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

###### *Flash has a global object inside his parent (window) who is called flashGlobal where you retreive each object with element property that contains the real HTMLElement 

---
# FROM OBJECT TO HTMLElement
## Flash input
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
## Flash button
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
# METHODS
#### Two methods allow you to compile faster your HTML page
## FlashConcat
```javascript
// you can use FlashConcat() or __c()

const STYLE = {
    div: {
        color: "#f00",
        backgroundColor: "#000"
    }
}

new Flash([
    {
        style: FlashConcat(
            STYLE.div,
            {
                height: 100
            }
        )
    }
])
```
##### collapse two or more objects
## FlashTransform
```javascript
/* 
    you can use FlashTransform() or __t()

    FlashTransform (
        htmlQueryReference [string], 
        movementsObject [object], // the property must be composed by numeric array [start,stop] 
        duration [number], // (optional) milliseconds 
        callback [function] // (optional)
    ) 
*/

FlashTransform(
    "#someId",
    {
        scale: [0,2],
        translateX: [100,500]
    },
    1000,
    ()=>{
        alert("Wow! transformation complete.")
    }
)
```
##### provide to animate HTMLElements by style transformation
## FlashFind
```javascript
/*
    you can use FlashFind(#id) or __f()
*/

console.info(FlashFind("ID"))
```
##### returns an object that contains element based on ID with self, path and parent properties
## FlashModule
```javascript
/*
    you can use FlashModule("path/to/file") or __m("path/to/file") just inside the server
    to include synchronously any external json file
*/

{
    tag: "input",
    style: FlashModule("path/to/file"))
}
```
##### returns an external json object
## FlashInclude
```javascript
/*
    you can use FlashInclude("path/to/file") or __i("path/to/file") just inside the server
    to include synchronously any external javascript file
*/

FlashInclude("path/to/file"))
```
##### load an external js file
## FlashPrettify
```javascript
/*
    you can use FlashPrettify() or __p()
*/

FlashPrettify() 
```
##### stylize and removes margins from the body

---
# STYLE
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
# PSEUDO-CLASSES
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
# QUERIES
#### All properties can be used by query. To do this assign string value to the property with double curly brackets.
#### In this case you can use the reseved object words like below
| Reserved Word | Typeof           | Return           |Where is    |
|---------------|------------------|------------------|------------|
|SCREEN         |object            |width:[num]       |Public      |
|               |                  |height:[num]      |            |
|SELF           |object            |this child object |Private     |
|               |                  |width:[num]       |            |
|               |                  |height:[num]      |            |
|PARENT         |object            |this parent object|Private     |
|               |                  |width:[num]       |            |
|               |                  |height:[num]      |            |
```javascript
{
    html: "{{SELF.id}}",
    style: {
        width: SCREEN.width/2,
        height: SCREEN.height
    },
    onclick: "console.log({{PARENT.width}})"
}
```
---
# EXAMPLE
#### index.html
```html
<!doctype html>
<html>
    <head>
        <title>Flash</title>
        <script type="text/javascript" src="flash.js"></script>
    </head>
    <body>
    </body>
</html>
<script type="text/javascript" src="site.js"></script>
```
#### site.js
```javascript
const STYLE = {
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

let F = new Flash([
    {
        id: "main",
        style: STYLE.main,
        childs: [
            {
                id: "child",
                html: "Hello World",
                style: STYLE.child,
                hover: {
                    color: "red"
                }
            }
        ]
    }
]);

F.then((scope)=>{
    setTimeout(()=>{
        scope.find("child").html = "Hello Flash"
    },5000)
})

FlashTransform(
    "#child",
    {
        scale: [10,1]
    },
    1500
)

F.prettify();
```
Another working example [at link](https://vinval.github.io/jdom/)
