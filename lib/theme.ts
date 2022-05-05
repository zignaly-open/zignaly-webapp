const getTheme = (darkMode: boolean) => ({
  // palette: {
  // mode: (darkMode ? "dark" : "light") as PaletteMode,
  //   ...(!darkMode
  //     ? {
  //         primary: { main: colors.purple },
  //       }
  //     : {}),
  // },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  background: {
    image: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/bg.jpg`,
  },
});

export default getTheme;
