import "styled-components";
import Theme from "zignaly-ui/lib/theme/theme";
// import { Theme } from "@mui/material/styles";
interface CustomTheme {
  background?: {
    image: any;
  };
}
// declare module "@mui/material/styles" {
//   interface Theme extends CustomTheme {}
//   interface ThemeOptions extends CustomTheme {}
// }

declare module "styled-components" {
  export interface DefaultTheme extends Theme, CustomTheme {}
}
