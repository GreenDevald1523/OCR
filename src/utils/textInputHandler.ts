import { TextProcessingMode } from 'store/api/document/types';

export const textInputHandler = (text: string, mode: TextProcessingMode) => {
  let result = text.trim();

  if (result) {
    switch (mode) {
      case 'firstupper':
        result = result.replace(result[0], result[0].toUpperCase());
        break;
      case 'onlyfirstupper':
        result = result.toLowerCase();
        result = result.replace(result[0], result[0].toUpperCase());
        break;
      case 'upper':
        result = result.toUpperCase();
        break;
      default:
        break;
    }
  }

  return result;
};
