import PlexSansBoldttf from "../styles/fonts/Sans/IBMPlexSans-Bold.ttf";
import PlexSansLightttf from "../styles/fonts/Sans/IBMPlexSans-Light.ttf";
import PlexSansRegularttf from "../styles/fonts/Sans/IBMPlexSans-Regular.ttf";
import PlexSansMediumttf from "../styles/fonts/Sans/IBMPlexSans-Medium.ttf";
import PlexSansSemiBoldttf from "../styles/fonts/Sans/IBMPlexSans-SemiBold.ttf";

/**
 * @typedef {import("@material-ui/styles").CSSProperties} CSSProperties
 */

/**
 * @type {CSSProperties["@font-face"]} PlexSansBold
 */
const PlexSansBold = {
  fontFamily: "PlexSans-Bold",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
    local('PlesSans-Bold'),
    url(${PlexSansBoldttf}) format('woff2')
  `,
};

/**
 * @type {CSSProperties["@font-face"]} PlexSansSemiBold
 */
const PlexSansSemiBold = {
  fontFamily: "PlexSans-SemiBold",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
    local('PlesSans-SemiBold'),
    url(${PlexSansSemiBoldttf}) format('woff2')
  `,
};

/**
 *
 * @type {CSSProperties["@font-face"]} PlexSansMedium
 */
const PlexSansMedium = {
  fontFamily: "PlexSans-Medium",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
    local('PlesSans-Medium'),
    url(${PlexSansMediumttf}) format('woff2')
  `,
};

/**
 * @type {CSSProperties["@font-face"]} PlexSansRegular
 */
const PlexSansRegular = {
  fontFamily: "PlexSans-Regular",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
    local('PlesSans-Regular'),
    url(${PlexSansRegularttf}) format('woff2')
  `,
};

/**
 * @type {CSSProperties["@font-face"]} PlexSansLight
 */
const PlexSansLight = {
  fontFamily: "PlexSans-Light",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
    local('PlesSans-Light'),
    url(${PlexSansLightttf}) format('woff2')
  `,
};

export const colors = {
  black2: "#1b1b2c",
  black: "#191927",
  darkGrey: "#808080",
  green: "#08a441",
  lightBlack: "#27273f",
  offWhite: "#fbfafc",
  purple: "#770fc8",
  purpleLight: "#a946f6",
  white: "#ffffff",
};

/**
 * @typedef {Object} ThemeOptionsGrid
 * @property {string} main
 * @property {string} content
 */

/**
 * @typedef {Object} ExtendedPaletteColorOptions
 * @property {ThemeOptionsGrid} grid
 */

/**
 * @typedef {Object} CustomPaletteOptions
 * @typedef {import('@material-ui/core/styles').PaletteColorOptions} PaletteColorOptions
 * @typedef {PaletteColorOptions & ExtendedPaletteColorOptions} ExtendedPaletteOptions
 */

/**
 * @typedef {Object} ExtendedThemeOptions
 * @property {ExtendedPaletteOptions} palette
 * @property {*} overrides
 */

/**
 * @typedef {import('@material-ui/core/styles').ThemeOptions} ThemeOptions
 * @typedef {ThemeOptions & ExtendedThemeOptions} CustomThemeOptions
 */

/**
 * Theme mode based on darkStyle flag.
 *
 * @param {boolean} darkStyle Flag that shows if dark theme is enabled.
 * @returns {CustomThemeOptions} Options to customize the Material UI theme based on darkStyle.
 *
 */
const theme = (darkStyle) => {
  return {
    palette: {
      background: {
        default: darkStyle ? colors.black : colors.offWhite,
        paper: darkStyle ? colors.black2 : colors.white,
      },
      grid: {
        main: darkStyle ? colors.lightBlack : colors.white,
        content: darkStyle ? colors.black2 : colors.white,
      },
      primary: {
        main: colors.purple,
      },
      secondary: {
        main: colors.purpleLight,
      },
      text: {
        primary: darkStyle ? colors.white : colors.black,
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
        // this is sub headings eg "Available", "Invested" inside crypto composition
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
      body1: {
        fontSize: "16px",
        fontFamily: "PlexSans-Regular",
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
  };
};

export default theme;
