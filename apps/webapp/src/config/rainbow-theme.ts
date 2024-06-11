import { Theme, darkTheme } from '@rainbow-me/rainbowkit';
import merge from 'lodash.merge';

export const rainbowTheme: Theme = merge(
  darkTheme({
    borderRadius: 'large',
  }),
  {
    colors: {
      accentColor: '#D8CCC3',
      accentColorForeground: '#000',
      modalBackground: '#111',
      modalBorder: '#412614',
      modalText: '#D8CCC3',
      modalTextSecondary: '#B5A295',
    },
  } as Theme,
);
