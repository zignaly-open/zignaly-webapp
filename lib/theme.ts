import { createTheme, PaletteMode, ThemeOptions } from "@mui/material";
import BackgroundImage from "../src/images/bg.jpg";

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

const getTheme = (darkMode: boolean, login: boolean): ThemeOptions => ({
  palette: {
    mode: (darkMode ? "dark" : "light") as PaletteMode,
    ...(!darkMode
      ? {
          primary: { main: colors.purple },
          background: {
            default: colors.offWhite,
            paper: colors.white,
          },
          text: {
            primary: colors.black,
          },
          secondary: {
            main: colors.purpleLight,
          },
          grid: {
            main: colors.white,
            content: colors.white,
          },
        }
      : {
          primary: { main: colors.purpleLight },
          // divider: deepOrange[700],
          background: {
            default: colors.lightBlack,
            paper: colors.lighterBlack,
          },
          text: {
            primary: colors.lightWhite,
          },
          secondary: {
            main: colors.purpleLight,
          },
          grid: {
            main: colors.lighterBlack,
            content: colors.lighterBlack,
          },
        }),
  },
  typography: {
    fontFamily: "Avenir Next, Helvetica Neue, Helvetica, Arial, sans-serif",
    ...(login && {
      fontFamily: "PlexSans, Roboto, Helvetica, Arial, sans-serif",
      // This is from legacy theme for login page
      h1: {
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
        fontSize: "21px",
        fontWeight: 700,
        textTransform: "capitalize",
        lineHeight: 1.24,
        letterSpacing: "0.8px",
      },
      h4: {
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: 1.31,
        letterSpacing: "0.61px",
      },
      h5: {
        fontSize: "14px",
        // fontFamily: "PlexMono-Medium",
        fontWeight: 500,
        textTransform: "capitalize",
        lineHeight: 1.5,
        letterSpacing: "0.53px",
      },
      subtitle1: {
        fontSize: "11px",
        fontWeight: 700,
        lineHeight: 1.45,
        letterSpacing: ".42px",
        textTransform: "uppercase",
        opacity: "0.6",
      },
      subtitle2: {
        fontSize: "12px",
        fontWeight: 700,
        textTransform: "capitalize",
        lineHeight: 1.08,
        letterSpacing: "0.46px",
      },
      h6: {
        fontSize: "14px",
        fontWeight: 600,
        textTransform: "capitalize",
        lineHeight: 1.43,
        letterSpacing: "0.53px",
      },
      caption: {
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
    }),
  },
  // components: {
  //   MuiButtonBase: {
  //     defaultProps: {
  //       disableRipple: true,
  //     },
  //   },
  // },
  background: {
    image: BackgroundImage,
  },
});

export default getTheme;
