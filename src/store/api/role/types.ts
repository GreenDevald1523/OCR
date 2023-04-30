export interface UserByRoleId {
  allowed: boolean;
  displayname: string;
  email: string;
  additionalinfo: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  webprops: string;
}
export interface RoleDirectoryRights {
  directory_id: number; // айди директории
  read: boolean | null; // Чтение директории (его видимость)
  delete: boolean | null; // Удаление директории
  document_create: boolean | null; // Создание документа в директории
  document_delete: boolean | null; // Удаление документа
  document_modify: boolean | null; // Изменение документа
  document_move_from: boolean | null; // Перемещение документов ИЗ этой директории
  document_move_to: boolean | null; // Перемещение документа В эту директорию
  directory_create: boolean | null; // Создание дочерних директорий
  directory_modify: boolean | null; // Изменение диретории (не знаю, этой, или дочерней)
  directory_move_from: boolean | null; // Перемещение директорий ИЗ этой директории
  directory_move_to: boolean | null; // Перемещение директорий В эту директорию
}

export interface RoleDirectoryRightsRequestBody
  extends Omit<RoleDirectoryRights, 'directory_id'> {
  group_id: number;
}

export interface UserIdFromNewRole {
  user_id: number;
}
