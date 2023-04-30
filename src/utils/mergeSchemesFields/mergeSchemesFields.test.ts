import { assert, describe } from 'vitest';
import { Scheme } from 'store/api/document/types';
import { mergeSchemesFields } from './mergeSchemesFields';

describe('mergeSchemesFields should work', () => {
  it('Test case 1 (correct objects)', () => {
    const object1: Scheme = {
      id: 1,
      title: 'Тестовая схема 1',
      createdate: new Date().toISOString(),
      modifydate: new Date().toISOString(),
      creator: 1,
      deletemark: false,
      ocr_available: true,
      fields: {
        int_field_scheme: [
          {
            id: 1,
            local_index: 1,
            name: 'Текущее количество подписей',
            required: true,
            min_val: 0,
            max_val: 5,
          },
          {
            id: 2,
            local_index: 2,
            name: 'Необходимое количество подписей',
            required: true,
            min_val: 5,
            max_val: 5,
          },
        ],
        real_field_scheme: [
          {
            id: 3,
            local_index: 3,
            name: 'Оценочная стоимость контракта',
            required: false,
            min_val: 0,
            max_val: 1_000_000_000_000,
            digits_after_point: 4,
          },
        ],
        datetime_field_scheme: [
          {
            id: 4,
            local_index: 4,
            name: 'Ещё дата',
            required: false,
            subtype: 'time',
          },
        ],
        text_field_scheme: [
          {
            id: 5,
            local_index: 5,
            name: 'Комментарий',
            max_length: 64,
            required: false,
            lettercase: 'firstupper',
          },
        ],
        enum_field_scheme: [],
        list_field_scheme: [],
        bool_field_scheme: [],
        file_field_scheme: [],
        filelist_field_scheme: [],
        link_field_scheme: [],
        linklist_field_scheme: [],
        user_field_scheme: [],
        userlist_field_scheme: [],
      },
    };
    const object2: Scheme = {
      id: 2,
      title: 'Тестовая схема 2',
      createdate: new Date().toISOString(),
      modifydate: new Date().toISOString(),
      creator: 1,
      deletemark: false,
      ocr_available: false,
      fields: {
        int_field_scheme: [],
        real_field_scheme: [
          {
            id: 6,
            local_index: 6,
            name: 'Оценочная стоимость контракта 2',
            required: false,
            min_val: 0,
            max_val: 1_000_000_000_000,
            digits_after_point: 4,
          },
        ],
        text_field_scheme: [
          {
            id: 8,
            local_index: 8,
            name: 'Комментарий 2',
            max_length: 64,
            required: false,
            lettercase: 'noformat',
          },
        ],
        enum_field_scheme: [],
        list_field_scheme: [],
        bool_field_scheme: [],
        file_field_scheme: [],
        filelist_field_scheme: [],
        link_field_scheme: [],
        linklist_field_scheme: [],
        user_field_scheme: [],
        userlist_field_scheme: [],

        datetime_field_scheme: [
          {
            id: 7,
            local_index: 7,
            name: 'Ещё какая-то дата',
            required: false,
            subtype: 'date',
          },
        ],
      },
    };

    const object3: Scheme = {
      id: 3,
      title: 'Схема новая 3',
      createdate: new Date().toISOString(),
      modifydate: new Date().toISOString(),
      creator: 1,
      deletemark: false,
      ocr_available: true,
      fields: {
        int_field_scheme: [
          {
            id: 9,
            local_index: 9,
            name: 'Численные подписи',
            required: true,
            min_val: 0,
            max_val: 5,
          },
          {
            id: 10,
            local_index: 10,
            name: 'Еще численные подписи',
            required: true,
            min_val: 5,
            max_val: 5,
          },
        ],
        real_field_scheme: [
          {
            id: 11,
            local_index: 11,
            name: 'Оценочная стоимость контракта',
            required: false,
            min_val: 0,
            max_val: 1_000_000_000_000,
            digits_after_point: 4,
          },
        ],
        datetime_field_scheme: [
          {
            id: 12,
            local_index: 12,
            name: 'Какая-то дата',
            required: false,
            subtype: 'datetime',
          },
        ],
        text_field_scheme: [],
        enum_field_scheme: [],
        list_field_scheme: [],
        bool_field_scheme: [],
        file_field_scheme: [],
        filelist_field_scheme: [],
        link_field_scheme: [],
        linklist_field_scheme: [],
        user_field_scheme: [],
        userlist_field_scheme: [],
      },
    };
    const result = mergeSchemesFields([object1, object2, object3]);

    const expectedResult = {
      bool_field_scheme: [],
      enum_field_scheme: [],
      file_field_scheme: [],
      filelist_field_scheme: [],
      int_field_scheme: [
        {
          id: 1,
          local_index: 1,
          name: 'Текущее количество подписей',
          required: true,
          min_val: 0,
          max_val: 5,
        },
        {
          id: 2,
          local_index: 2,
          name: 'Необходимое количество подписей',
          required: true,
          min_val: 5,
          max_val: 5,
        },
        {
          id: 3,
          local_index: 3,
          name: 'Текущее количество подписей 2',
          required: true,
          min_val: 0,
          max_val: 5,
        },
        {
          id: 4,
          local_index: 4,
          name: 'Необходимое количество подписей 2',
          required: true,
          min_val: 5,
          max_val: 5,
        },
      ],
      link_field_scheme: [],
      linklist_field_scheme: [],
      list_field_scheme: [],
      real_field_scheme: [
        {
          id: 5,
          local_index: 5,
          name: 'Оценочная стоимость контракта',
          required: false,
          min_val: 0,
          max_val: 1000000000000,
          digits_after_point: 4,
        },
        {
          id: 6,
          local_index: 6,
          name: 'Оценочная стоимость контракта 2',
          required: false,
          min_val: 0,
          max_val: 1000000000000,
          digits_after_point: 4,
        },
      ],
      text_field_scheme: [
        {
          id: 7,
          local_index: 7,
          name: 'Комментарий',
          max_length: 64,
          lettercase: 'firstupper',
          required: false,
        },
        {
          id: 8,
          local_index: 8,
          name: 'Комментарий 2',
          max_length: 64,
          lettercase: 'noformat',
          required: false,
        },
      ],
      datetime_field_scheme: [
        {
          id: 3,
          local_index: 3,
          name: 'Какая-то дата',
          required: false,
          subtype: 'time',
        },
      ],
      user_field_scheme: [],
      userlist_field_scheme: [],
    };

    assert.equal(JSON.stringify(result), JSON.stringify(expectedResult));
  });
  test.todo('More test cases');
});
