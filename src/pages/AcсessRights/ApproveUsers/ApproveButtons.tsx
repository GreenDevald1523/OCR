import { ActionIcon, Flex } from '@mantine/core';
import { IconCheck, IconPlus } from '@tabler/icons';

interface ApproveButtonsProps {
  onApprove: () => void;
  onReject: () => void;
}

export const ApproveButtons = ({
  onApprove,
  onReject,
}: ApproveButtonsProps) => {
  return (
    <Flex ml="auto" gap={10} mr={40}>
      <ActionIcon
        w={34}
        h={34}
        color={'pink.1'}
        variant="filled"
        sx={(theme) => ({
          borderRadius: 10,

          '&:hover': {
            backgroundColor: theme.colors.pink[1],
          },
        })}
        onClick={() => onReject()}
      >
        <IconPlus
          size={28}
          color="black"
          style={{ transform: 'rotate(45deg)' }}
        />
      </ActionIcon>
      <ActionIcon
        w={34}
        h={34}
        color="teal.1"
        variant="filled"
        sx={(theme) => ({
          borderRadius: 10,

          '&:hover': {
            backgroundColor: theme.colors.teal[1],
          },
        })}
        onClick={() => onApprove()}
      >
        <IconCheck size={28} color="black" />
      </ActionIcon>
    </Flex>
  );
};
