import { Flex, Text } from '@mantine/core';

interface UserProfileAvatarProps {
  displayname: string | undefined;
  size?: string | number;
}

export const UserProfileAvatar = ({
  displayname,
  size = 60,
}: UserProfileAvatarProps) => {
  return (
    <Flex
      align="center"
      justify="center"
      w={size}
      h={size}
      bg="#F5F5F5"
      sx={{ borderRadius: '3px', flexShrink: 0, boxSizing: 'unset' }}
    >
      <Text
        sx={{
          color: 'black',
          fontWeight: 400,
        }}
        fz={20}
      >
        {displayname &&
          displayname
            .split(' ')
            .map((partOfName) => partOfName[0].toUpperCase())}
      </Text>
    </Flex>
  );
};
