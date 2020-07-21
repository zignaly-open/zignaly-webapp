import PlexSansBoldttf from "../styles/fonts/Sans/IBMPlexSans-Bold.ttf";
import PlexSansLightttf from "../styles/fonts/Sans/IBMPlexSans-Light.ttf";
import PlexSansRegularttf from "../styles/fonts/Sans/IBMPlexSans-Regular.ttf";
import PlexSansMediumttf from "../styles/fonts/Sans/IBMPlexSans-Medium.ttf";
import PlexSansSemiBoldttf from "../styles/fonts/Sans/IBMPlexSans-SemiBold.ttf";
import PlexMonoBoldttf from "../styles/fonts/Mono/IBMPlexMono-Bold.ttf";
import PlexMonoMediumttf from "../styles/fonts/Mono/IBMPlexMono-Medium.ttf";

/**
 * @typedef {import("@material-ui/styles").CSSProperties} CSSProperties
 */

/**
 * @type {CSSProperties["@font-face"]} PlexMonoBold
 */
const PlexMonoBold = {
  fontFamily: "PlexMono-Bold",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
    local('PlexMono-Medium'),
    url(${PlexMonoBoldttf}) format('woff2')
  `,
  unicodeRange: "U+0030-0039",
};

/**
 * @type {CSSProperties["@font-face"]} PlexMonoMedium
 */
const PlexMonoMedium = {
  fontFamily: "PlexMono-Medium",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
    local('PlexMono-Medium'),
    url(${PlexMonoMediumttf}) format('woff2')
  `,
  unicodeRange: "U+0030-0039",
};

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
  blue: "#017aff",
  green: "#08a441",
  red: "#b52a00",
  yellow: "#f6ad3f",
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
      type: darkStyle ? "dark" : "light",
    },
    typography: {
      h1: {
        // this is for page title eg "Dashboard" (Large Title)
        fontSize: "33px",
        fontFamily: "PlexSans-Bold",
        textTransform: "capitalize",
        lineHeight: 1.21,
        letterSpacing: "1.25px",
      },
      h3: {
        // this is for titles inside components eg: "Total Equity" (Title 2/3)
        fontSize: "21px",
        fontFamily: "PlexSans-Bold",
        textTransform: "capitalize",
        lineHeight: 1.24,
        letterSpacing: "0.8px",
      },
      h4: {
        // this is sub headings eg "Available", "Invested" inside crypto composition (Body 1/2)
        fontSize: "16px",
        fontFamily: "PlexSans-SemiBold",
        lineHeight: 1.31,
        letterSpacing: "0.61px",
      },
      h5: {
        // for BTC counts inside Available Balance and Total Equity (Number 1/2)
        fontSize: "14px",
        // fontFamily: "PlexMono-Medium",
        fontFamily: "PlexSans-Medium",
        textTransform: "capitalize",
        lineHeight: 1.5,
        letterSpacing: "0.53px",
      },
      subtitle1: {
        // this is a small text which is being used for balance in USD like in Available Balance component (Footnote)
        fontSize: "11px",
        fontFamily: "PlexSans-Bold",
        lineHeight: 1.45,
        letterSpacing: ".42px",
        textTransform: "uppercase",
        opacity: "0.6",
      },
      subtitle2: {
        // this is a small text which is being used for balance in USD like in Available Balance component (Caption 1)
        fontSize: "12px",
        fontFamily: "PlexSans-Light",
        textTransform: "capitalize",
        lineHeight: 1.08,
        letterSpacing: "0.46px",
      },
      h6: {
        // this is for sidebar link but we can use it anywhere else as well (Callout 2)
        fontSize: "14px",
        fontFamily: "PlexSans-SemiBold",
        textTransform: "capitalize",
        lineHeight: 1.43,
        letterSpacing: "0.53px",
      },
      caption: {
        // this is for sidebar link but we can use it anywhere else as well (Callout 1)
        fontSize: "14px",
        fontFamily: "PlexSans-Regular",
        textTransform: "capitalize",
        lineHeight: 1.43,
        letterSpacing: "0.53px",
      },
      body1: {
        fontSize: "16px",
        fontFamily: "PlexSans-Regular",
        letterSpacing: "0.61px",
        lineHeight: 1.31,
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
            PlexMonoMedium,
            PlexMonoBold,
          ],
        },
      },
      MuiTooltip: {
        tooltip: {
          fontSize: "14px",
          color: colors.white,
          backgroundColor: colors.black,
        },
      },
      MuiToggleButton: {
        root: {
          color: colors.purple,
          backgroundColor: darkStyle ? colors.lightBlack : colors.white,
          borderColor: colors.purple,
          "&$selected": {
            color: colors.white,
            backgroundColor: colors.purple,
            "&:hover": {
              backgroundColor: colors.purpleLight,
            },
          },
        },
      },
      MuiSelect: {
        select: {
          "&:focus": {
            backgroundColor: "transparent",
          },
        },
      },
      MuiFormHelperText: {
        root: {
          fontSize: "12px",
        },
      },
      MuiCircularProgress: {
        root: {
          padding: "3px",
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
