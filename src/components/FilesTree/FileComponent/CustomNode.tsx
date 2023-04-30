import { NodeModel, useDragOver } from '@minoru/react-dnd-treeview';
import { TypeIcon } from './TypeIcon';
import { IconChevronRight } from '@tabler/icons';
import { Flex, Box, useMantineTheme } from '@mantine/core';
import { useTypedSelector } from 'store/ReduxHooks';
import { selectCurrentDirectoryId } from 'store/slices/currentDirectory';
import { CreateDirectoryButton } from '../CreateDirectoryButton';

export const CustomNode = (props: {
  node: NodeModel<{ type: string }>;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const { id, droppable } = props.node;
  const nodeData = props.node.data;
  const theme = useMantineTheme();
  const currentDirectoryId = useTypedSelector(selectCurrentDirectoryId);

  const isChosen = id === currentDirectoryId;

  const handleToggle = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    props.onToggle();
  };

  const dragOverProps = useDragOver(id, props.isOpen, props.onToggle);

  return (
    <Flex maw={300} mb={5} gap={5} direction="column">
      <Box
        mih={35}
        onClick={handleToggle}
        sx={() => ({
          '&:hover': {
            backgroundColor: isChosen
              ? theme.fn.rgba(theme.colors.indigo[6], 0.3)
              : theme.fn.rgba(theme.colors.indigo[5], 0.15),
          },
          borderRadius: '5px',
          padding: '1px 18px 1px 16px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxSizing: 'border-box',
          marginTop: '-2px',
          backgroundColor: isChosen
            ? theme.fn.rgba(theme.colors.indigo[6], 0.15)
            : '',
          gap: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        })}
        {...dragOverProps}
      >
        <Flex gap={10} h={25}>
          <IconChevronRight
            style={{
              transform: `rotate(${props.isOpen ? '90deg' : '0deg'})`,
              transition: 'transform 0.1s ease-in-out',
            }}
            color={isChosen ? theme.colors.indigo[6] : theme.colors.dark[6]}
          />
          <TypeIcon
            droppable={droppable}
            type={nodeData?.type}
            color={isChosen ? theme.colors.indigo[6] : theme.colors.dark[6]}
          />
        </Flex>
        <Box
          sx={() => ({
            cursor: 'pointer',
            fontWeight: 500,
            color: isChosen ? theme.colors.indigo[6] : theme.colors.dark,
          })}
        >
          {props.node.text}
        </Box>
      </Box>
      {isChosen && props.isOpen ? (
        <Box pl={15} w="100%">
          <CreateDirectoryButton />
        </Box>
      ) : null}
    </Flex>
  );
};
