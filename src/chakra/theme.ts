import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import { extendTheme } from "@chakra-ui/react";
import { Button } from "./Button";

// 2. Call `extendTheme` and pass your custom values
export const theme = extendTheme({
  initialColorMode: "system",
  useSystemColorMode: true,
  colors: {
    brand: {
      100: "#FF3C00",
    },
  },
  fonts: {
    body: "Open Sans, sans-serif",
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === "light" ? "gray.200" : "blackAlpha.900",
      },
    }),
  },
  components: {
    Button,
  },
});
