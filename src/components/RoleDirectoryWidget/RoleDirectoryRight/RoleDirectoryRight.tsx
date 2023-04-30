import {
  Box,
  Divider,
  Flex,
  SegmentedControl,
  Text,
  Title,
} from '@mantine/core';
import { IconCheck, IconPlus, IconSlash } from '@tabler/icons';
import { FC } from 'react';

interface RoleDirectoryRightProps {
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
}

export const RoleDirectoryRight: FC<RoleDirectoryRightProps> = ({
  title,
  description,
  value,
  onChange,
}) => {
  return (
    <>
      <Flex pr={20} w="100%" align="center">
        <Flex direction="column" w="calc(100% - 120px)">
          <Title fz={20} weight={500} mb={9}>
            {title}
          </Title>
          <Text> {description} </Text>
        </Flex>
        <SegmentedControl
          styles={(theme) => ({
            root: {
              borderRadius: '9px',
              backgroundColor: theme.colors.gray[0],
            },
            active: {
              borderRadius: '9px',
              backgroundColor:
                value === 'true'
                  ? '#DEF7EC'
                  : value === 'false'
                  ? theme.colors.pink[1]
                  : theme.colors.indigo[1],
              boxShadow: 'none',
            },
            control: {
              width: 40,
            },
          })}
          value={value}
          onChange={onChange}
          data={[
            {
              label: (
                <Flex w="100%" h="100%" justify="center" align="center">
                  <IconPlus size={20} style={{ transform: 'rotate(45deg)' }} />
                </Flex>
              ),
              value: 'false',
            },
            {
              label: (
                <Flex w="100%" h="100%" justify="center" align="center">
                  <IconSlash size={20} />
                </Flex>
              ),
              value: 'null',
            },
            {
              label: (
                <Flex w="100%" h="100%" justify="center" align="center">
                  <IconCheck size={20} />
                </Flex>
              ),
              value: 'true',
            },
          ]}
        ></SegmentedControl>
      </Flex>
      <Divider my={30} />
    </>
  );
};
