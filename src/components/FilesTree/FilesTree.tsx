import { Tree } from '@minoru/react-dnd-treeview';
import { Box, createStyles } from '@mantine/core';
import { CustomNode } from './FileComponent/CustomNode';
import { CustomDragPreview } from './FileComponent/CustomDragPreview';
import { useFileTree } from '../../hooks/useFileTree';
import { useGetClientUserQuery } from 'store/api/user/userApi';
import { CreateDirectoryButton } from './CreateDirectoryButton';

const useStyles = createStyles(() => ({
  treeRoot: {
    margin: '0',
    listStyle: 'none',
  },
  draggingSource: {
    opacity: '.3',
  },
  dropTarget: {
    backgroundColor: '#e8f0fe',
  },
}));

export const FilesTree = () => {
  const { classes } = useStyles();
  const clientUser = useGetClientUserQuery({} as unknown as void, {
    refetchOnMountOrArgChange: true,
  });
  const { treeData, handleDrop, toggleHandler } = useFileTree();

  return (
    <Box>
      <Tree
        canDrag={() => false}
        canDrop={() => false}
        tree={treeData}
        rootId={0}
        sort={false}
        render={(node, { depth, isOpen, onToggle }) => (
          <CustomNode
            node={node}
            depth={depth}
            isOpen={isOpen}
            onToggle={() => toggleHandler(onToggle, node)}
          />
        )}
        dragPreviewRender={(monitorProps) => (
          <CustomDragPreview monitorProps={monitorProps} />
        )}
        onDrop={handleDrop}
        classes={{
          root: classes.treeRoot,
          draggingSource: classes.draggingSource,
          dropTarget: classes.dropTarget,
        }}
      />
      {clientUser && clientUser.data?.superuser && (
        <Box mt={12}>
          <CreateDirectoryButton isRoot label={'Создать директорию в корне'} />
        </Box>
      )}
    </Box>
  );
};
