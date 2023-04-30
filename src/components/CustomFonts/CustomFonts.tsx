import { Global } from '@mantine/core';
import bold from '../../assets/fonts/EuclidCircularA/EuclidCircularABold.ttf';
import medium from '../../assets/fonts/EuclidCircularA/EuclidCircularAMedium.ttf';
import regular from '../../assets/fonts/EuclidCircularA/EuclidCircularARegular.ttf';
import semibold from '../../assets/fonts/EuclidCircularA/EuclidCircularASemiBold.ttf';
import light from '../../assets/fonts/EuclidCircularA/EuclidCircularALight.ttf';

export function CustomFonts() {
  return (
    <Global
      styles={[
        {
          '@font-face': {
            fontFamily: 'Euclid Circular A',
            src: `url('${bold}') format("truetype")`,
            fontWeight: 700,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Greycliff CF',
            src: `url('${semibold}') format("truetype")`,
            fontWeight: 600,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Euclid Circular A',
            src: `url('${medium}') format("truetype")`,
            fontWeight: 500,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Euclid Circular A',
            src: `url('${regular}') format("truetype")`,
            fontWeight: 400,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Euclid Circular A',
            src: `url('${light}') format("truetype")`,
            fontWeight: 300,
            fontStyle: 'normal',
          },
        },
      ]}
    />
  );
}
