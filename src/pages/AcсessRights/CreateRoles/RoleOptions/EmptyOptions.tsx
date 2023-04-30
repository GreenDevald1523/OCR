import { Center, Text } from '@mantine/core';

export const EmptyOptions = () => {
  return (
    <Center h="100%">
      <Text
        maw={700}
        component={Center}
        c="gray.4"
        fw={500}
        fz={36}
        ta="center"
      >
        Создайте новую роль или отредактируйте готовую
      </Text>
    </Center>
  );
};
