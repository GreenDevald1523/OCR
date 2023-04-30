import { FC } from 'react';
import { Button } from '@mantine/core';
import { IconCornerDownRight } from '@tabler/icons';
import { useTypedSelector } from 'store/ReduxHooks';
import { selectCurrentDirectoryId } from 'store/slices/currentDirectory';
import { openModal } from '@mantine/modals';
import { CreateDirectory } from '../Modals/CreateDirectory';

interface CreateDirectoryButtonProps {
  label?: string;
  isRoot?: boolean;
}

export const CreateDirectoryButton: FC<CreateDirectoryButtonProps> = ({
  label = 'Создать папку',
  isRoot = false,
}) => {
  const currentDirectoryId = useTypedSelector(selectCurrentDirectoryId);

  return (
    <Button
      variant="subtle"
      size="sm"
      w="100%"
      color="gray"
      onClick={() =>
        openModal({
          children: (
            <CreateDirectory directoryId={isRoot ? null : currentDirectoryId} />
          ),
          centered: true,
          title: 'Создание директории',
          size: 'md',
        })
      }
      leftIcon={<IconCornerDownRight size={22} />}
    >
      {label}
    </Button>
  );
};
