import { Box, Text } from '@mantine/core';

import { IconX, IconCheck } from '@tabler/icons';

export const PasswordRequirement = ({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) => {
  return (
    <Text
      color={meets ? 'teal' : 'red'}
      sx={{ display: 'flex', alignItems: 'center', fontSize: 15 }}
      mt={5}
    >
      {meets ? <IconCheck size={15} /> : <IconX size={15} />}{' '}
      <Box ml={10}>{label}</Box>
    </Text>
  );
};
