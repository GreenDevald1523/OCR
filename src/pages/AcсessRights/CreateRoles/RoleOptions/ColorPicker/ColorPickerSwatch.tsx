import { Box } from '@mantine/core';
import { IconCheck } from '@tabler/icons';
import { FC } from 'react';
import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import {
  selectCurrentRoleColor,
  selectIsColorChanged,
  setCurrentRoleColor,
  setIsColorChanged,
} from 'store/slices/roles';

interface ColorPickerElementProps {
  color: string;
  currentColor?: string;
}

export const ColorPickerSwatch: FC<ColorPickerElementProps> = ({
  color,
  currentColor,
}) => {
  const dispatch = useTypedDispatch();
  const currentRoleColor = useTypedSelector(selectCurrentRoleColor);
  const isColorChanged = useTypedSelector(selectIsColorChanged);
  return (
    <Box
      bg={color}
      sx={{ width: 37, height: 34, borderRadius: 2.27 }}
      onClick={() => {
        dispatch(setCurrentRoleColor(`{ "color": "${color}" }`));
        dispatch(setIsColorChanged(true));
      }}
    >
      {((currentRoleColor && JSON.parse(currentRoleColor).color === color) ||
        (currentColor === color && !isColorChanged)) && (
        <IconCheck color="white" style={{ margin: 6 }} />
      )}
    </Box>
  );
};
