export const parseRoleRightValue = (value: string) => {
  if (typeof value !== 'string') throw new Error('Given value is not a string');

  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    case 'null':
      return null;
    default:
      return null;
  }
};
