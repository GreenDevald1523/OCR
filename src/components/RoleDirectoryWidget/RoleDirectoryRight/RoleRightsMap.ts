import { RoleDirectoryRights } from 'store/api/role';

interface RightInfo {
  title: string;
  description: string;
}

export const RoleRightsMap: Record<keyof RoleDirectoryRights, RightInfo> = {
  delete: {
    title: 'Удаление директории',
    description: 'Участники роли могут удалить данную директорию',
  },
  directory_create: {
    title: 'Создание дочерних директорий',
    description:
      'Участники роли могут создавать дочерние директории внутри данной',
  },
  directory_id: {
    title: 'Это не должно отображаться',
    description: '',
  },
  directory_modify: {
    title: 'Изменение диретории',
    description: 'Участники роли могут изменять параметры директории',
  },
  directory_move_from: {
    title: 'Перемещение директорий ИЗ этой директории',
    description: 'Участники роли могут выносить дочерние директории из данной',
  },
  directory_move_to: {
    title: 'Перемещение директорий В эту директорию',
    description: 'Участники роли могут вносить директории внутрь данной извне',
  },
  document_create: {
    title: 'Создание документа в директории',
    description:
      'Участники роли могут создавать новые документы в данной директории',
  },
  document_delete: {
    title: 'Удаление документа',
    description:
      'Участники роли могут удалять документы, находящиеся в данной директории',
  },
  document_modify: {
    title: 'Изменение документа',
    description:
      'Участники роли могут изменять поля документов, лежащих в данной директории',
  },
  document_move_from: {
    title: 'Перемещение документов ИЗ этой директории',
    description:
      'Участники роли могут переносить документы из этой директории в другие',
  },
  document_move_to: {
    title: 'Перемещение документа В эту директорию',
    description:
      'Участники роли могут вносить документы в эту директорию из других',
  },
  read: {
    title: 'Чтение директории',
    description: 'Участники роли могут видеть данную директорию',
  },
} as const;
