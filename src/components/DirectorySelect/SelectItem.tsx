import { forwardRef } from 'react';
import { Group, Text } from '@mantine/core';
import { IconFolder } from '@tabler/icons';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  name: string;
}

export const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, name, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <IconFolder />

        <div>
          <Text size="md">{name}</Text>
          <Text size="xs" opacity={0.65}>
            {label}
          </Text>
        </div>
      </Group>
    </div>
  )
);

SelectItem.displayName = 'SelectItem';
