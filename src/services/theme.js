const black = "#191927";
const black2 = "#1b1b2c";
const purple = "#770fc8";
const purpleLight = "#a946f6";
const green = "#08a441";
const pink = "#f63f82";
const yellow = "#f6ad3f";
const white = "#ffffff";
const lightGrey = "#ededed";
const blue = "#017aff;"
const lightBlack = "#27273f"
const offWhite = "#fbfafc";

const theme = (darkStyle) => {
    return {
        palette: {
            background: {
                default: darkStyle ? black : offWhite,
                paper: darkStyle ? black2 : white,
            },
            grid: {
                main: darkStyle ? lightBlack : white,
                content: darkStyle ? black2 : white,
            },
            primary: {
                main: purple,
            },
            secondary: {
                main: purple,
            },
            text: {
                primary: darkStyle ? white : black,
            },
            action: {
                hover: purple,
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