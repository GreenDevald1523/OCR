import { Text } from '@mantine/core';

interface DateTimeCellProps {
  subtype: 'datetime' | 'time' | 'date';
  value: string;
}

export default function DateTimeCell({ subtype, value }: DateTimeCellProps) {
  switch (subtype) {
    case 'datetime':
      return <Text>{new Date(value).toLocaleString('ru')}</Text>;
    case 'date':
      return <Text>{new Date(value).toLocaleDateString('ru')}</Text>;
    case 'time':
      return <Text>{new Date(value).toLocaleTimeString('ru')}</Text>;

    default:
      return <Text></Text>;
  }
}
