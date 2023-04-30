import { useEffect, useState, useMemo } from 'react';
import { useActionCreators, useTypedSelector } from 'store/ReduxHooks';

import {
  selectCurrentDirectoryId,
  setCurrentDirectoryId,
  setDirectoriesList,
} from 'store/slices/currentDirectory';
import { NodeModelType } from 'store/api/directory/types';
import { useGetAllDirectoriesQuery } from 'store/api/directory';

export const useFileTree = () => {
  // Отсюда мы не берём data потому что тут она в том виде, какая она приходит с сервера
  const { data, isSuccess } = useGetAllDirectoriesQuery();

  const actions = useActionCreators({
    setCurrentDirectoryId,
    setDirectoriesList,
  });
  const currentDirectoryId = useTypedSelector(selectCurrentDirectoryId);

  const directoriesList = useMemo(
    () =>
      data
        ? data.map(({ title, parent, id, ...other }) => ({
            text: title,
            parent: +parent,
            id,
            data: {
              ...other,
              type: 'folder',
            },
          }))
        : [],
    [data]
  );

  useEffect(() => {
    actions.setDirectoriesList(directoriesList);
  }, [actions, directoriesList]);

  const [treeData, setTreeData] = useState<NodeModelType[]>([]);
  const handleDrop = (newTree: NodeModelType[]) => setTreeData(newTree);
  const toggleHandler = (onToggle: () => void, node: NodeModelType) => {
    actions.setCurrentDirectoryId(Number(node.id));
    localStorage.setItem('currentDirectoryId', node.id.toString());
    if (currentDirectoryId === Number(node.id)) onToggle();
  };

  useEffect(() => {
    if (isSuccess) {
      setTreeData(directoriesList);
    }
  }, [isSuccess, directoriesList]);

  return { treeData, handleDrop, toggleHandler };
};
