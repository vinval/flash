/*** JDom - HTML builder  ***/
/*** By Vincenzo Valrosso ***/
/*** This example work on ***/
/*** server side          ***/

// Import style module
const STYLE = __m("style");

// Create new instance of JDom
const JD = new JDom([
    {
        id: "main",
        style: {
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: 'center',
            height: SCREEN.height
        },
        childs: [
            {
                id: "clock",
                style: __c(
                    STYLE.clock,
                    STYLE.outlineShadow
                ),
                childs: [
                    {
                        id: "display",
                        style: __c(
                            STYLE.display,
                            STYLE.insetShadow
                        ),
                        hover: __c(
                            STYLE.hover,
                            STYLE.insetLight
                        ),
                        childs: [
                            {
                                id: "hours"
                            },
                            {
                                id: "seconds",
                                style: STYLE.seconds
                            }
                        ]
                    },
                    {
                        html: "JDom Clock",
                        style: {
                            fontSize: 10
                        }
                    }
                ]
            }
        ]
    }
]);

// When instance is created
JD.then(function(scope){
    
    // Get double number
    function doubleNumber(n) {
        return n<10 ? "0"+n : n
    }

    // Update target every 5 milliseconds
    setInterval(function(){
        scope.find("hours").html = doubleNumber(new Date().getHours())+":"+doubleNumber(new Date().getMinutes());
        scope.find("seconds").html = doubleNumber(new Date().getSeconds());
    },5)
});

// At the end prettify
JD.prettify();
