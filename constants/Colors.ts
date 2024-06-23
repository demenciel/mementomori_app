/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#2C2C54', // Darker text color for better contrast on light background
    background: '#ECECEC', // Light background color
    tint: tintColorLight, // Light mode tint color
    icon: '#474787', // Icon color
    tabIconDefault: '#AAABB8', // Default tab icon color
    tabIconSelected: tintColorLight, // Selected tab icon color
  },
  dark: {
    text: '#ECECEC', // Lighter text color for better contrast on dark background
    background: '#2C2C54', // Dark background color
    tint: tintColorDark, // Dark mode tint color
    icon: '#474787', // Icon color
    tabIconDefault: '#AAABB8', // Default tab icon color
    tabIconSelected: tintColorDark, // Selected tab icon color
  },
};
