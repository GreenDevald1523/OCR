import { NodeModelType } from 'store/api/directory/types';

export const generateFullDirectoryPath = ({
  data,
  separator = ' / ',
}: {
  data: NodeModelType[];
  separator?: string;
}) => {
  const fullPathValues: Record<string | number, string[]> = {
    0: [],
  };

  const computeFullPath = (directory: NodeModelType | undefined) => {
    if (!directory) return;

    const { parent, id, text } = directory;

    if (fullPathValues[`${parent}`]) {
      fullPathValues[`${id}`] = [...fullPathValues[`${parent}`], text];
      return;
    }

    computeFullPath(data.find((dir) => dir.id === parent));
  };

  data.forEach((directory) => computeFullPath(directory));

  const selectData = data.map((directory) => {
    return {
      label: fullPathValues[`${directory.id}`].join(separator),
      name: directory.text,
      value: `${directory.id}`,
    };
  });
  return selectData;
};
