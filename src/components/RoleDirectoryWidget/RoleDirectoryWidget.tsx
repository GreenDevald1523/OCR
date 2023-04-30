import { FC } from 'react';
import { useRoleDirectoryRights } from '../../hooks/useRoleDirectoryRights';
import { RoleDirectoryRight } from './RoleDirectoryRight/RoleDirectoryRight';
import { Box, Loader } from '@mantine/core';
import { RoleRightsMap } from './RoleDirectoryRight/RoleRightsMap';
import { parseRoleRightValue } from '../../hooks/parseRoleRightValue';

interface RoleDirectoryWidgetProps {
  directoryId: number;
  roleId: number;
}

export const RoleDirectoryWidget: FC<RoleDirectoryWidgetProps> = ({
  directoryId,
  roleId,
}) => {
  const { rights, onChangeRoleRight } = useRoleDirectoryRights(
    directoryId,
    roleId
  );

  if (!rights) {
    return (
      <Box
        mah={'100%'}
        h="calc(100% - 70px)"
        sx={{ overflowY: 'auto', display: 'grid', placeItems: 'center' }}
      >
        <Loader />
      </Box>
    );
  }

  return (
    <Box mah={'100%'} styles={{ overflowY: 'auto' }}>
      {Object.entries(rights).map(([key, value]) => {
        if (key !== 'directory_id')
          return (
            <RoleDirectoryRight
              key={key}
              value={String(value)}
              onChange={(newRightValue: string) => {
                const reqObject: typeof rights = { ...rights };
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                reqObject[key as keyof typeof rights] =
                  parseRoleRightValue(newRightValue);
                onChangeRoleRight(reqObject);
              }}
              title={RoleRightsMap[key as keyof typeof RoleRightsMap].title}
              description={
                RoleRightsMap[key as keyof typeof RoleRightsMap].description
              }
            />
          );
      })}
    </Box>
  );
};
