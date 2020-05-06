const black = "#191927";
const purple = "#770fc8";
const purpleLight = "#a946f6";
const green = "#08a441";
const pink = "#f63f82";
const yellow = "#f6ad3f";
const white = "#ffffff";
const lightGrey = "#d4d4d4";
const blue = "#017aff;"
const lightBlack = "#27273f"

const theme = (darkStyle) => {
    return {
        palette: {
            background: {
                default: darkStyle ? black : white,
                paper: darkStyle ? black : white,
            },
            grid: {
                main: darkStyle ? lightBlack : white,
                content: darkStyle ? lightBlack : white,
            },
            primary: {
                main: darkStyle ? purpleLight : purple,
            },
            secondary: {
                main: purpleLight,
            },
            text: {
                primary: darkStyle ? white : black
            },
            action: {
                hover: purpleLight,
                active: purple,
                hoverOpacity: 0,
            },
            typography:{
                main: darkStyle ? white : black,
            },
        },
    }
}

export default theme;