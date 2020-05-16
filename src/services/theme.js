import PlexSansBoldttf from "../styles/fonts/Sans/IBMPlexSans-Bold.ttf"
import PlexSansLightttf from "../styles/fonts/Sans/IBMPlexSans-Light.ttf"
import PlexSansRegularttf from "../styles/fonts/Sans/IBMPlexSans-Regular.ttf"
import PlexSansMediumttf from "../styles/fonts/Sans/IBMPlexSans-Medium.ttf"
import PlexSansSemiBoldttf from "../styles/fonts/Sans/IBMPlexSans-SemiBold.ttf"

const PlexSansBold = {
  fontFamily: "PlexSans-Bold",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
      local('PlexSans'),
      local('PlesSans-Bold'),
      url(${PlexSansBoldttf}) format('woff2')
    `,
}

const PlexSansSemiBold = {
  fontFamily: "PlexSans-SemiBold",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
      local('PlexSans'),
      local('PlesSans-SemiBold'),
      url(${PlexSansSemiBoldttf}) format('woff2')
    `,
}

const PlexSansMedium = {
  fontFamily: "PlexSans-Medium",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
      local('PlexSans'),
      local('PlesSans-Medium'),
      url(${PlexSansMediumttf}) format('woff2')
    `,
}

const PlexSansRegular = {
  fontFamily: "PlexSans-Regular",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
      local('PlexSans'),
      local('PlesSans-Regular'),
      url(${PlexSansRegularttf}) format('woff2')
    `,
}

const PlexSansLight = {
  fontFamily: "PlexSans-Light",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
      local('PlexSans'),
      local('PlesSans-Bold'),
      url(${PlexSansLightttf}) format('woff2')
    `,
}

const black = "#191927"
const black2 = "#1b1b2c"
const purple = "#770fc8"
const purpleLight = "#a946f6"
const white = "#ffffff"
const lightBlack = "#27273f"
const offWhite = "#fbfafc"

const theme = darkStyle => {
  return {
    palette: {
      background: {
        default: darkStyle ? black : offWhite,
        paper: darkStyle ? black2 : white,
      },
      typography: {
        h1: {
          // this is for page title eg "Dashboard"
          fontSize: "33px",
          fontFamily: "PlexSans-Bold",
          textTransform: "capitalize",
        },
        h2: {
          // this is for page title inside testimonials"
          fontSize: "28px",
          fontFamily: "PlexSans-Medium",
          textTransform: "capitalize",
        },
        h3: {
          // this is for titles inside components eg: "Totla Equity"
          fontSize: "21px",
          fontFamily: "PlexSans-Bold",
          textTransform: "capitalize",
        },
        h4: {
          //this is sub headings eg "Available", "Invested" inside crypto composition
          fontSize: "16px",
          fontFamily: "PlexSans-SemiBold",
          wordSpacing: "5px",
        },
        h5: {
          // for BTC counts inside Available Balance and Total Equity
          fontSize: "14px",
          fontFamily: "PlexSans-Medium",
          wordSpacing: "5px",
          textTransform: "capitalize",
        },
        subtitle1: {
          // this is a small text which is being used for balance in USD like in Available Balance component
          fontSize: "11px",
          fontFamily: "PlexSans-Bold",
          wordSpacing: "5px",
          letterSpacing: ".42px",
          textTransform: "uppercase",
          opacity: "0.6",
        },
        subtitle2: {
          // this is a small text which is being used for balance in USD like in Available Balance component
          fontSize: "12px",
          fontFamily: "PlexSans-Light",
          wordSpacing: "5px",
          textTransform: "capitalize",
        },
        h6: {
          // this is for sidebar link but we can use it anywhere else as well
          fontSize: "14px",
          fontFamily: "PlexSans-SemiBold",
          wordSpacing: "5px",
          textTransform: "capitalize",
        },
        caption: {
          // this is for sidebar link but we can use it anywhere else as well
          fontSize: "14px",
          fontFamily: "PlexSans-Regular",
          wordSpacing: "5px",
          textTransform: "capitalize",
        },
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
    },
    typography: {
      h1: {
        // this is for page title eg "Dashboard"
        fontSize: "33px",
        fontFamily: "PlexSans-Bold",
        textTransform: "capitalize",
      },
      h3: {
        // this is for titles inside components eg: "Totla Equity"
        fontSize: "21px",
        fontFamily: "PlexSans-Bold",
        textTransform: "capitalize",
      },
      h4: {
        //this is sub headings eg "Available", "Invested" inside crypto composition
        fontSize: "16px",
        fontFamily: "PlexSans-SemiBold",
        wordSpacing: "5px",
      },
      h5: {
        // for BTC counts inside Available Balance and Total Equity
        fontSize: "14px",
        fontFamily: "PlexSans-Medium",
        wordSpacing: "5px",
        textTransform: "capitalize",
      },
      subtitle1: {
        // this is a small text which is being used for balance in USD like in Available Balance component
        fontSize: "11px",
        fontFamily: "PlexSans-Bold",
        wordSpacing: "5px",
        letterSpacing: ".42px",
        textTransform: "uppercase",
        opacity: "0.6",
      },
      subtitle2: {
        // this is a small text which is being used for balance in USD like in Available Balance component
        fontSize: "12px",
        fontFamily: "PlexSans-Light",
        wordSpacing: "5px",
        textTransform: "capitalize",
      },
      h6: {
        // this is for sidebar link but we can use it anywhere else as well
        fontSize: "14px",
        fontFamily: "PlexSans-SemiBold",
        wordSpacing: "5px",
        textTransform: "capitalize",
      },
      caption: {
        // this is for sidebar link but we can use it anywhere else as well
        fontSize: "14px",
        fontFamily: "PlexSans-Regular",
        wordSpacing: "5px",
        textTransform: "capitalize",
      },
    },
    overrides: {
      MuiCssBaseline: {
        "@global": {
          "@font-face": [
            PlexSansMedium,
            PlexSansRegular,
            PlexSansSemiBold,
            PlexSansBold,
            PlexSansLight,
          ],
        },
      },
    },
    props: {
      MuiButtonBase: {
        disableRipple: true,
      },
    },
  }
}

export default theme
