import { IconFolder } from '@tabler/icons';

export const TypeIcon = (props: {
  droppable?: boolean;
  type?: string;
  color?: string;
}) => {
  switch (props.type) {
    case 'folder':
      return (
        <IconFolder
          height={25}
          width={20}
          stroke={2}
          color={props.color || '#1E1E1E'}
        />
      );
    default:
      return null;
  }
};
