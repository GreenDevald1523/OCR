export interface DisableAble {
  disabled?: boolean;
}

export interface BasicCustomButtonProps extends DisableAble {
  selectedId: number | null;
}

export { CreateDoc } from './CreateDoc';
export { DeleteDoc } from './DeleteDoc';
export { ExportDoc } from './ExportDoc';
export { FilterDoc } from './FilterDoc';
export { OpenDoc } from './OpenDoc';
export { OcrDoc } from './OcrDoc';
