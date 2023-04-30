import { NodeModel } from '@minoru/react-dnd-treeview';

interface InnerDocument {
  document_id: number;
  scheme_id: number;
}
export interface DirectoryWithInnerInfo {
  directory: Directory;

  inner_directories_id: number[];

  inner_documents_id: InnerDocument[];
}

export type NodeModelType = NodeModel<{
  type: string;
  creator?: number;
  webprops?: string;
  deletemark?: boolean;
}>;

export interface Directory {
  id: number;
  title: string;
  parent: number;
  creator: number;
  webprops: string;
  deletemark: boolean;
}

export interface CreateDirectoryRequestBody {
  title: string;
  parent: number | null;
  webprops: string;
}
