import { createStyles } from "@material-ui/styles";

export const theme = createStyles({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*": {
          margin: 0,
          padding: 0
        },
        "html, body, #root": {
          height: "100%"
        },
        ul: {
          listStyle: "none"
        }
      }
    },
    MuiSvgIcon: {
      root: { verticalAlign: "middle" }
    }
  }
});
