import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = {
  config: {
    intialColorMode: "light",
    useSystemColorMode: true,
  },
  styles: {
    global: {
      body: {
        margin: 0,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',sans-serif",
        WebKitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
    },
  },
  components: {
    Button: {
      baseStyle: (props) => ({
        background: mode("white", "rgb(38, 38, 38)")(props),
        _hover: {
          background: mode("#ddd", "#333")(props),
        },
        _active: {
          opacity: 0.5,
        },
      }),
      variants: {
        base: {},
      },
      defaultProps: {
        // Then here we set the base variant as the default
        variant: "base",
      },
    },
  },
};

export default extendTheme(theme);
