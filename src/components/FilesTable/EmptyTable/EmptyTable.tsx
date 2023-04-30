import { FC } from 'react';
import { Box, Center, Flex, Text } from '@mantine/core';
import { IconEmptyTable } from './IconEmptyTable';

interface EmptyTableProps {
  isSuperUser: boolean;
}

export const EmptyTable: FC<EmptyTableProps> = ({ isSuperUser }) => {
  return (
    <Center m="auto" h="100%">
      <Flex direction="column" align="center">
        <Box w={150} h={150}>
          <IconEmptyTable />
        </Box>
        {isSuperUser ? (
          <Text
            maw={700}
            component={Center}
            c="gray.4"
            fw={500}
            fz={36}
            ta="center"
            h="100%"
          >
            Начните работу, создав или выбрав директорию в меню слева
          </Text>
        ) : (
          <Text
            maw={700}
            component={Center}
            c="gray.3"
            fw={500}
            fz={36}
            ta="center"
            h="100%"
          >
            Начните работу, выбрав директорию в меню слева
          </Text>
        )}
      </Flex>
    </Center>
  );
};
