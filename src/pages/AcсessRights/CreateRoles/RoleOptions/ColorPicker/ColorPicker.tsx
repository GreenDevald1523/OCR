import { Flex } from '@mantine/core';
import { FC } from 'react';
import { ColorPickerSwatch } from './ColorPickerSwatch';
import { colors } from './Colors';

interface ColorPickerProps {
  currentColor?: string;
}

export const ColorPicker: FC<ColorPickerProps> = ({ currentColor }) => {
  return (
    <Flex maw="80%" gap={10} wrap="wrap">
      {colors.map((color, index) => (
        <ColorPickerSwatch
          color={color}
          key={index}
          currentColor={currentColor}
        />
      ))}
    </Flex>
  );
};
