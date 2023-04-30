import { FC, useMemo } from 'react';

import { Select } from '@mantine/core';
import { SelectItem } from './SelectItem';
import { IconFolder } from '@tabler/icons';

import { useTypedSelector } from 'store/ReduxHooks';
import { selectDirectoriesList } from 'store/slices/currentDirectory';
import { generateFullDirectoryPath } from '../../utils/generateFullDirectoryPath';

interface DirectorySelectProps {
  value: string | null;
  setValue: React.Dispatch<string | null>;
}

export const DirectorySelect: FC<DirectorySelectProps> = ({
  value,
  setValue,
}) => {
  const directoriesList = useTypedSelector(selectDirectoriesList);

  const selectData = useMemo(
    () => generateFullDirectoryPath({ data: directoriesList }),
    [directoriesList]
  );

  return (
    <Select
      maw="50%"
      placeholder="Выберите директорию"
      searchable
      creatable
      size="lg"
      styles={{
        input: {
          fontWeight: 500,
        },
      }}
      itemComponent={SelectItem}
      w="40%"
      miw={300}
      height={53}
      value={value}
      onChange={setValue}
      icon={<IconFolder color="gray" size={25} />}
      clearable
      data={selectData}
    />
  );
};
