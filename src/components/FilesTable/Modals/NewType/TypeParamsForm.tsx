import { FC, memo, useEffect, useState } from 'react';
import {
  FieldsParams,
  LetterCaseVariants,
  SupportedFieldTypes,
} from 'store/slices/newSchemeSlice/types';
import { Checkbox, Flex, NumberInput, Select, Stack } from '@mantine/core';

interface TypeParamsFormProps {
  type: SupportedFieldTypes;
  onChange: React.Dispatch<React.SetStateAction<FieldsParams | null>>;
}

type FieldFormOnChange = React.Dispatch<
  React.SetStateAction<FieldsParams | null>
>;

const IntFieldForm = (onChange: { onChange: FieldFormOnChange }) => {
  const [maxVal, setMaxVal] = useState<number>(100);
  const [minVal, setMinVal] = useState<number>(0);
  const [required, setRequired] = useState<boolean>(false);

  useEffect(() => {
    onChange.onChange({
      max_val: maxVal,
      min_val: minVal,
      required,
    });
  }, [required, maxVal, minVal, onChange]);

  return (
    <Stack spacing={'xs'} mt={15}>
      <Checkbox
        sx={{ height: 20 }}
        label="Обязательное поле"
        checked={required}
        onChange={(e) => setRequired(e.currentTarget.checked)}
      />
      <NumberInput
        label="Максимальное значение"
        value={maxVal}
        onChange={(value) => value && setMaxVal(value)}
      />

      <NumberInput
        label="Минимальное значение"
        value={minVal}
        onChange={(value) => value && setMinVal(value)}
      />
    </Stack>
  );
};

const RealFieldForm = (onChange: { onChange: FieldFormOnChange }) => {
  const [maxVal, setMaxVal] = useState<number>(100);
  const [minVal, setMinVal] = useState<number>(0);
  const [digitsAfterPoint, setDigitsAfterPoint] = useState<number>(2);
  const [required, setRequired] = useState<boolean>(false);

  useEffect(() => {
    onChange.onChange({
      max_val: maxVal,
      min_val: minVal,
      digits_after_point: digitsAfterPoint,
      required,
    });
  }, [required, maxVal, minVal, digitsAfterPoint, onChange]);

  return (
    <Stack spacing={'xs'} mt={15}>
      <Checkbox
        sx={{ height: 20 }}
        label="Обязательное поле"
        checked={required}
        onChange={(e) => setRequired(e.currentTarget.checked)}
      />
      <NumberInput
        label="Максимальное значение"
        value={maxVal}
        onChange={(value) => value && setMaxVal(value)}
      />

      <NumberInput
        label="Минимальное значение"
        value={minVal}
        onChange={(value) => value && setMinVal(value)}
      />

      <NumberInput
        label="Количество знаков после запятой"
        value={digitsAfterPoint}
        onChange={(value) => value && setDigitsAfterPoint(value)}
      />
    </Stack>
  );
};

const BoolFieldForm = (onChange: { onChange: FieldFormOnChange }) => {
  const [required, setRequired] = useState<boolean>(false);

  useEffect(() => {
    onChange.onChange({ required });
  }, [required, onChange]);

  return (
    <Checkbox
      sx={{ height: 20, marginTop: 15 }}
      label="Обязательное поле"
      checked={required}
      onChange={(e) => setRequired(e.currentTarget.checked)}
    />
  );
};

const DateTimeFieldForm = (onChange: { onChange: FieldFormOnChange }) => {
  const [subtype, setSubtype] = useState<string>('');
  const [required, setRequired] = useState<boolean>(false);

  useEffect(() => {
    onChange.onChange({
      subtype: subtype,
      required,
    });
  }, [required, subtype, onChange]);
  return (
    <Flex direction="column" gap={20}>
      <Select
        label="Тип даты"
        placeholder="Выбери тип"
        data={[
          { value: 'datetime', label: 'Дата и время' },
          { value: 'date', label: 'Дата' },
          { value: 'time', label: 'Время' },
        ]}
        mt={20}
        styles={{ label: { fontSize: 16, fontWeight: 400, marginBottom: 10 } }}
        onChange={(e) => setSubtype(e || '')}
      />
      <Checkbox
        sx={{ height: 20 }}
        label="Обязательное поле"
        checked={required}
        onChange={(e) => setRequired(e.currentTarget.checked)}
      />
    </Flex>
  );
};

const TextLetterCaseData: { label: string; value: LetterCaseVariants }[] = [
  {
    label: 'Все буквы большие',
    value: 'upper',
  },
  {
    label: 'Первая большая',
    value: 'firstupper',
  },
  {
    label: 'Первая большая, остальные маленькие',
    value: 'onlyfirstupper',
  },
  {
    label: 'Без форматирования',
    value: 'noformat',
  },
];

const TextFieldForm = (onChange: { onChange: FieldFormOnChange }) => {
  const [lettercase, setLetterCase] = useState<LetterCaseVariants>('noformat');
  const [required, setRequired] = useState<boolean>(false);
  const [maxLength, setMaxLength] = useState<number>(10);

  useEffect(() => {
    onChange.onChange({ max_length: maxLength, required, lettercase });
  }, [required, maxLength, onChange, lettercase]);

  return (
    <Stack spacing={'xs'} mt={15}>
      <Checkbox
        sx={{ height: 20 }}
        label="Обязательное поле"
        checked={required}
        onChange={(e) => setRequired(e.currentTarget.checked)}
      />

      <Select
        label="Выберите стиль форматирования"
        data={TextLetterCaseData}
        value={lettercase}
        onChange={(value) => setLetterCase(value as LetterCaseVariants)}
      />

      <NumberInput
        label="Максимальная длина строки"
        value={maxLength}
        onChange={(value) => value && setMaxLength(value)}
      />
    </Stack>
  );
};

// eslint-disable-next-line react/display-name
export const TypeParamsForm: FC<TypeParamsFormProps> = memo(
  ({ type, onChange }) => {
    switch (type) {
      case 'int':
        return <IntFieldForm onChange={onChange} />;
      case 'bool':
        return <BoolFieldForm onChange={onChange} />;
      case 'real':
        return <RealFieldForm onChange={onChange} />;
      case 'text':
        return <TextFieldForm onChange={onChange} />;
      case 'datetime':
        return <DateTimeFieldForm onChange={onChange} />;
      default:
        return <>Какаято хуйня</>;
    }
  }
);
