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

const getTheme = (darkMode: boolean): ThemeOptions => ({
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
