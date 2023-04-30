import { Box } from '@mantine/core';
import { ReactComponent as StacksGroup } from '../../assets/SVG/StacksGroup.svg';

export const SideRegisterArt = () => {
  return (
    <Box
      sx={(theme) => ({
        width: '40vw',
        position: 'relative',
        background: theme.fn.gradient({
          from: '#5F3DC4',
          to: '#3654B6',
        }),
        overflow: 'hidden',
      })}
    >
      <StacksGroup
        style={{
          height: '100%',
          width: '100%',
        }}
      />
    </Box>
  );
};
