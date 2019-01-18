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
