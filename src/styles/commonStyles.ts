import {StyleSheet} from 'react-native';
import {fonts, fontSizes} from './typography';

export const PADDING = 16;

const commonStyles = StyleSheet.create({
  heading1: {
    fontSize: fontSizes.basePlus,
    fontFamily: fonts.Noto,
    lineHeight: fontSizes.basePlus * 1.4,
  },
  mainText: {
    fontSize: fontSizes.base,
    fontFamily: fonts.Noto,
    lineHeight: fontSizes.base * 1.4,
  },
  mainTextMedium: {
    fontSize: fontSizes.base,
    fontFamily: fonts.Noto,
    lineHeight: fontSizes.base * 1.4,
    fontWeight: 500,
  },
  tinyText: {
    fontSize: fontSizes.tinyPlus,
    fontFamily: fonts.Noto,
    lineHeight: fontSizes.tinyPlus * 1.4,
  },
  tinyTextSemi: {
    fontSize: fontSizes.tinyPlus,
    fontFamily: fonts.Noto,
    lineHeight: fontSizes.tinyPlus * 1.4,
    fontWeight: 500,
  },
});

export default commonStyles;
