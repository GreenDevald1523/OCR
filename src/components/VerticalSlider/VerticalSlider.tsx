import { useEffect, useState } from 'react';
import { useMantineTheme, Text, Tooltip } from '@mantine/core';
import { useMove, usePrevious } from '@mantine/hooks';

export function VerticalSlider({
  onChange,
}: {
  onChange?: (moveValue: number) => void;
}) {
  const theme = useMantineTheme();
  const [value, setValue] = useState(0.5);
  const previousValue = usePrevious(value);
  const { ref, active } = useMove(({ y }) => setValue(1 - y));

  useEffect(() => {
    if (active && typeof onChange === 'function') {
      if (!previousValue) {
        onChange(value * 2);
        return;
      }
      onChange((value - previousValue) * 2);
      // if (value - previousValue > 0) {
      //   onChange(value);
      // } else {
      //   onChange(-value);
      // }
    }
  }, [value, onChange, active, previousValue]);

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        border: '1px solid #D2D2D2',
      }}
    >
      <div
        ref={ref}
        style={{
          width: 4,
          borderRadius: 2,
          height: 120,
          backgroundColor: theme.colors.indigo[3],
          position: 'relative',
        }}
      >
        {/* Thumb */}
        <Tooltip
          position="left"
          color={theme.colors.indigo[6]}
          p={6}
          label={
            <Text fz={10} align="center">
              {Math.round(value * 100)} %
            </Text>
          }
        >
          <div
            style={{
              position: 'absolute',
              borderRadius: '50%',
              bottom: `calc(${value * 100}% - 8px)`,
              right: -6,
              width: 16,
              height: 16,
              backgroundColor: theme.colors.indigo[6],
            }}
          />
        </Tooltip>
      </div>
    </div>
  );
}
