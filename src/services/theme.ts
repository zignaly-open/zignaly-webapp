import PlexSansBoldttf from "../styles/fonts/Sans/IBMPlexSans-Bold.ttf";
import PlexSansLightttf from "../styles/fonts/Sans/IBMPlexSans-Light.ttf";
import PlexSansRegularttf from "../styles/fonts/Sans/IBMPlexSans-Regular.ttf";
import PlexSansMediumttf from "../styles/fonts/Sans/IBMPlexSans-Medium.ttf";
import PlexSansSemiBoldttf from "../styles/fonts/Sans/IBMPlexSans-SemiBold.ttf";
import PlexMonoBoldttf from "../styles/fonts/Mono/IBMPlexMono-Bold.ttf";
import PlexMonoMediumttf from "../styles/fonts/Mono/IBMPlexMono-Medium.ttf";

/**
 * @typedef {import("@mui/styles").CSSProperties} CSSProperties
 */

/**
 * @type {CSSProperties["@font-face"]} PlexMonoBold
 */
const PlexMonoBold = {
  fontFamily: "PlexMono",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 700,
  src: `
    local('PlexMono-Medium'),
    url(${PlexMonoBoldttf}) format('woff2')
  `,
  //   unicodeRange: "U+0030-0039",
};

/**
 * @type {CSSProperties["@font-face"]} PlexMonoMedium
 */
const PlexMonoMedium = {
  fontFamily: "PlexMono",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 500,
  src: `
    local('PlexMono-Medium'),
    url(${PlexMonoMediumttf}) format('woff2')
  `,
  //   unicodeRange: "U+0030-0039",
};

/**
 * @type {CSSProperties["@font-face"]} PlexSansBold
 */
const PlexSansBold = {
  fontFamily: "PlexSans",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 700,
  src: `
    local('PlesSans-Bold'),
    url(${PlexSansBoldttf}) format('woff2')
  `,
};

/**
 * @type {CSSProperties["@font-face"]} PlexSansSemiBold
 */
const PlexSansSemiBold = {
  fontFamily: "PlexSans",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 600,
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
  fontWeight: 500,
  fontStyle: "normal",
  fontDisplay: "swap",
  src: `
    local('PlesSans-Medium'),
    url(${PlexSansMediumttf}) format('woff2')
  `,
};

/**
 * @type {CSSProperties["@font-face"]} PlexSansRegular
 */
const PlexSansRegular = {
  fontFamily: "PlexSans",
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
  fontFamily: "PlexSans",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 300,
  src: `
    local('PlesSans-Light'),
    url(${PlexSansLightttf}) format('woff2')
  `,
};

export const colors = {
  black: "#191927",
  lightBlack: "#151521",
  lighterBlack: "#1b1b2c",
  lightestBlack: "#27273F",
  borderColor: "rgba(0, 0, 0, 0.1)",
  lighterBlackBorder: "#3e3946",
  lightBlackBorder: "rgba(64, 57, 70, 0.37)",
  blackTooltip: "#1b1b25",
  darkGrey: "#808080",
  blue: "#017aff",
  green: "#08a441",
  red: "#b52a00",
  yellow: "#f6ad3f",
  offWhite: "#fbfafc",
  purple: "#770fc8",
  purpleLight: "#a946f6",
  white: "#ffffff",
  lightWhite: "rgba(255, 255, 255, 0.94)",
};

/**
 * @typedef {Object} DeprecatedThemeOptionsGrid
 * @property {string} main
 * @property {string} content
 */

/**
 * @typedef {Object} ExtendedPaletteColorOptions
 * @property {DeprecatedThemeOptionsGrid} grid
 */

/**
 * @typedef {Object} CustomPaletteOptions
 * @typedef {import('@mui/material/styles').PaletteColorOptions} PaletteColorOptions
 * @typedef {PaletteColorOptions & ExtendedPaletteColorOptions} ExtendedPaletteOptions
 */

/**
 * @typedef {Object} ExtendedThemeOptions
 * @property {ExtendedPaletteOptions} palette
 * @property {*} overrides
 */

/**
 * @typedef {import('@mui/material/styles').ThemeOptions} DeprecatedThemeOptions
 * @typedef {DeprecatedThemeOptions & ExtendedThemeOptions} CustomThemeOptions
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
      mode: darkStyle ? "dark" : "light",
      background: {
        default: darkStyle ? colors.lightBlack : colors.offWhite,
        paper: darkStyle ? colors.lighterBlack : colors.white,
      },
      grid: {
        main: darkStyle ? colors.lighterBlack : colors.white,
        content: darkStyle ? colors.lighterBlack : colors.white,
      },
      primary: {
        main: darkStyle ? colors.purpleLight : colors.purple,
      },
      secondary: {
        main: colors.purpleLight,
      },
      text: {
        primary: darkStyle ? colors.lightWhite : colors.black,
      },
    },
    typography: {
      fontFamily: "PlexSans, Roboto, Helvetica, Arial, sans-serif",
      h1: {
        // this is for page title eg "Dashboard" (Large Title)
        fontSize: "33px",
        fontWeight: 700,
        textTransform: "capitalize",
        lineHeight: 1.21,
        letterSpacing: "1.25px",
        "@media (max-width:600px)": {
          fontSize: "21px",
        },
      },
      h3: {
        // this is for titles inside components eg: "Total Equity" (Title 2/3)
        fontSize: "21px",
        fontWeight: 700,
        textTransform: "capitalize",
        lineHeight: 1.24,
        letterSpacing: "0.8px",
      },
      h4: {
        // this is sub headings eg "Available", "Invested" inside crypto composition (Body 1/2)
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: 1.31,
        letterSpacing: "0.61px",
      },
      h5: {
        // for BTC counts inside Available Balance and Total Equity (Number 1/2)
        fontSize: "14px",
        // fontFamily: "PlexMono-Medium",
        fontWeight: 500,
        textTransform: "capitalize",
        lineHeight: 1.5,
        letterSpacing: "0.53px",
      },
      subtitle1: {
        // this is a small text which is being used for balance in USD like in Available Balance component (Footnote)
        fontSize: "11px",
        fontWeight: 700,
        lineHeight: 1.45,
        letterSpacing: ".42px",
        textTransform: "uppercase",
        opacity: "0.6",
      },
      subtitle2: {
        // this is a small text which is being used for balance in USD like in Available Balance component (Caption 1)
        fontSize: "12px",
        fontWeight: 700,
        textTransform: "capitalize",
        lineHeight: 1.08,
        letterSpacing: "0.46px",
      },
      h6: {
        // this is for sidebar link but we can use it anywhere else as well (Callout 2)
        fontSize: "14px",
        fontWeight: 600,
        textTransform: "capitalize",
        lineHeight: 1.43,
        letterSpacing: "0.53px",
      },
      caption: {
        // this is for sidebar link but we can use it anywhere else as well (Callout 1)
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: 1.43,
        letterSpacing: "0.53px",
      },
      body1: {
        fontSize: "16px",
        fontWeight: 400,
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
          backgroundColor: colors.blackTooltip,
        },
      },
      MuiToggleButton: {
        root: {
          color: darkStyle ? colors.purpleLight : colors.purple,
          backgroundColor: darkStyle ? colors.lightestBlack : colors.white,
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
      MuiOutlinedInput: {
        notchedOutline: {
          borderColor: darkStyle ? colors.lightBlackBorder : colors.borderColor,
        },
        root: {
          "&$focused $notchedOutline": {
            borderColor: darkStyle ? colors.purpleLight : colors.purple,
            borderWidth: 1,
          },
          "&:hover $notchedOutline": {
            borderColor: darkStyle ? colors.lighterBlackBorder : "rgba(0, 0, 0, 0.3)",
          },
          // Override border for inputs inside a modal with dark theme
          "[data-theme='dark'] .modal &:not($focused):not(.Mui-error):not(:hover) $notchedOutline":
            {
              borderColor: "rgba(255, 255, 255, 0.23)",
            },
          "[data-theme='dark'] .modal &:not($focused):not(.Mui-error):hover $notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.4)",
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
      MuiDialog: {
        paper: {
          backgroundColor: darkStyle ? colors.lighterBlack : colors.offWhite,
        },
      },
      MuiTableCell: {
        root: {
          borderBottom: `1px solid ${darkStyle ? colors.lightBlackBorder : colors.borderColor}`,
        },
      },
      MuiPaper: {
        elevation1: {
          boxShadow: darkStyle ? "none" : "0 2px 8px 0 rgba(64, 34, 95, 0.2);",
          border: darkStyle ? `1px solid ${colors.lightBlackBorder}` : "none",
        },
      },
    },
    props: {
      MuiButtonBase: {
        disableRipple: true,
      },
    },
    newTheme: darkStyle
      ? {
          backgroundColor: "#12132d",
          backgroundAltColor: "#222249",
          secondaryText: "#9ca3af",
          borderColor: "#1e1c4f",
          borderColor2: "#413BA0",
          green: "#26c4c1",
          yellow: "#F7CF00",
          red: "#F63F82",
          error: "#F268C3",
          linkText: "#829fff",
          purple: colors.purpleLight,
          neutralText: "#f3f4f6",
          neutralText3: "#65647E",
        }
      : {
          backgroundColor: "#ffffff",
          backgroundAltColor: "#e7e6f8",
          // backgroundColor: "#dcdaf4",
          secondaryText: "#6D6C96",
          // borderColor: "#c1c2f7",
          borderColor: "rgba(0, 0, 0, 0.1)",
          borderColor2: "#9CA3AF",
          green: "#2EC9C0",
          yellow: "#C39713",
          red: "#F63F82",
          error: "#F268C3",
          linkText: "#36A6F4",
          purple: colors.purple,
          neutralText: "#36373F",
          neutralText3: "#5955B6",
        },
    transactionTable: darkStyle
      ? {
          headBackgroundColor: "#0C0D21",
          border: "#222249",
        }
      : {
          // headBackgroundColor: "#CCCAEF",
          headBackgroundColor: "#ffffff",
          border: "rgba(0, 0, 0, 0.1)",
        },
  };
};

export default theme;
