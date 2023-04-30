/* eslint-disable import/no-extraneous-dependencies */

import JSONServer from 'json-server';
import path from 'path';

const server = JSONServer.create();
const router = JSONServer.router('server/db.json');
const middlewares = JSONServer.defaults();

server.use(middlewares);

server.use(JSONServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
  }
  next();
});

server.post('/auth/signup', (req, res) => {
  let options = {
    maxAge: 1000 * 60 * 3,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  };

  if (req.body.username === '422') {
    res.status(422).jsonp({
      error: 'Пользователь с указанными данными уже зарегистрирован в системе',
    });
    return;
  }

  res.cookie('accessToken', 'cookieValue', options);

  res.status(204).jsonp({ refresh_token: 'asjkdhqwwieu,zxcb' });
});

server.post('/auth/login', (req, res) => {
  let options = {
    maxAge: 1000 * 60 * 3,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  };

  if (req.body.username === 'test' && req.body.password === 'Asd123') {
    res.cookie('accessToken', 'cookieValue', options);

    res.status(200).jsonp({ refresh_token: 'asjkdhqwwieu,zxcb' });

    return;
  }

  res.status(401).jsonp({ error: 'Неверный логин или пароль' });
});

server.delete('/auth/logout', (req, res) => {
  res.status(204).clearCookie('accessToken').jsonp({ message: 'Токен удалён' });
});

server.get('/directory/root', (req, res) => {
  res.status(200).jsonp([1, 4]);
});

server.get('/directory/:id', (req, res) => {
  const directories = {
    1: {
      directory: {
        id: 1,
        title: 'Корневая директория',
        parent: null,
        creator: 1,
        webprops: 'string',
        deletemark: true,
      },
      inner_directories_id: [2, 3],
      inner_documents_id: [
        { document_id: 2, scheme_id: 11 },
        { document_id: 3, scheme_id: 2 },
      ],
    },
    2: {
      directory: {
        id: 2,
        title: 'Первая дочерняя',
        parent: 1,
        creator: 0,
        webprops: 'string',
        deletemark: true,
      },
      inner_directories_id: [],
      inner_documents_id: [
        {
          document_id: 2,
          scheme_id: 4,
        },

        {
          document_id: 3,
          scheme_id: 4,
        },
      ],
    },
    3: {
      directory: {
        id: 3,
        title: 'Вторая дочерняя',
        parent: 1,
        creator: 0,
        webprops: 'string',
        deletemark: true,
      },
      inner_directories_id: [],
      inner_documents_id: [
        {
          document_id: 2,
          scheme_id: 4,
        },

        {
          document_id: 3,
          scheme_id: 4,
        },
      ],
    },
    4: {
      directory: {
        id: 4,
        title: 'третья дочерняя',
        parent: null,
        creator: 0,
        webprops: 'string',
        deletemark: true,
      },
      inner_directories_id: [5],
      inner_documents_id: [],
    },
    5: {
      directory: {
        id: 5,
        title: 'четвёртая дочерняя',
        parent: 4,
        creator: 0,
        webprops: 'string',
        deletemark: true,
      },
      inner_directories_id: [],
      inner_documents_id: [
        {
          document_id: 2,
          scheme_id: 4,
        },

        {
          document_id: 3,
          scheme_id: 4,
        },
      ],
    },
  };

  res.status(200).jsonp(directories[req.params.id]);
});

server.post('/directory', (req, res) => {
  return res.status(200).jsonp({});
});

server.get('/document/scheme/all', (req, res) => {
  res.status(200).jsonp([1, 2, 3, 11]);
});

server.get('/document/scheme/:id', (req, res) => {
  const schemes = {
    1: {
      id: 1,
      title: 'Счет (OCR)',
      fields: {
        int_field_scheme: [],
        real_field_scheme: [],
        datetime_field_scheme: [
          {
            id: 6,
            local_index: 6,
            name: 'Дата',
            required: true,
            subtype: 'date',
          },
        ],
        text_field_scheme: [
          {
            id: 0,
            local_index: 1,
            name: 'Продавец',
            max_length: 100,
            required: true,
            lettercase: 'noformat',
          },
          {
            id: 1,
            local_index: 2,
            name: 'ИНН Продавца',
            max_length: 10,
            required: true,
            lettercase: 'noformat',
          },
          {
            id: 2,
            local_index: 0,
            name: 'КПП Продавца',
            max_length: 9,
            required: true,
            lettercase: 'noformat',
          },
          {
            id: 3,
            local_index: 4,
            name: 'Покупатель',
            max_length: 100,
            required: true,
            lettercase: 'noformat',
          },
          {
            id: 4,
            local_index: 5,
            name: 'ИНН Покупателя',
            max_length: 10,
            required: true,
            lettercase: 'noformat',
          },
          {
            id: 5,
            local_index: 3,
            name: 'КПП Покупателя',
            max_length: 9,
            required: true,
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
      },
      createdate: '2022-12-18T19:10:17.547362',
      modifydate: null,
      creator: null,
      deletemark: false,
      ocr_available: true,
    },
    2: {
      id: 2,
      title: 'Счет-фактура (OCR)',
      fields: {
        int_field_scheme: [],
        real_field_scheme: [],
        datetime_field_scheme: [
          {
            id: 14,
            local_index: 7,
            name: 'Дата',
            required: true,
            subtype: 'time',
          },
        ],
        text_field_scheme: [
          {
            id: 6,
            local_index: 0,
            name: 'Продавец',
            max_length: 100,
            required: true,
            lettercase: 'noformat',
          },
          {
            id: 7,
            local_index: 1,
            name: 'ИНН Продавца',
            max_length: 10,
            required: true,
            lettercase: 'noformat',
          },
          {
            id: 8,
            local_index: 3,
            name: 'КПП Продавца',
            max_length: 9,
            required: true,
            lettercase: 'noformat',
          },
          {
            id: 9,
            local_index: 5,
            name: 'Покупатель',
            max_length: 100,
            required: true,
            lettercase: 'noformat',
          },
          {
            id: 10,
            local_index: 4,
            name: 'ИНН Покупателя',
            max_length: 10,
            required: true,
            lettercase: 'noformat',
          },
          {
            id: 11,
            local_index: 2,
            name: 'КПП Покупателя',
            max_length: 9,
            required: true,
            lettercase: 'noformat',
          },
          {
            id: 12,
            local_index: 6,
            name: 'ИНН',
            max_length: 9,
            required: true,
            lettercase: 'noformat',
          },
          {
            id: 13,
            local_index: 5,
            name: 'НИИ',
            max_length: 100,
            required: true,
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
      },
      createdate: '2022-12-18T19:10:17.556343',
      modifydate: null,
      creator: null,
      deletemark: false,
      ocr_available: true,
    },
    3: {
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
            id: 10,
            local_index: 2,
            name: 'Численные подписи',
            required: true,
            min_val: 0,
            max_val: 5,
          },
          {
            id: 11,
            local_index: 4,
            name: 'Еще численные подписи',
            required: true,
            min_val: 5,
            max_val: 19,
          },
        ],
        real_field_scheme: [
          {
            id: 12,
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
            id: 15,
            local_index: 7,
            name: 'Дата',
            required: true,
            subtype: 'datetime',
          },
        ],
        text_field_scheme: [
          {
            id: 13,
            local_index: 1,
            name: 'Комментарий 3',
            max_length: 4,
            required: false,
            lettercase: 'capital',
          },
        ],
        enum_field_scheme: [],
        list_field_scheme: [],
        bool_field_scheme: [
          {
            id: 14,
            local_index: 0,
            name: 'Булевая штука 2',
            required: true,
          },
        ],
        file_field_scheme: [],
        filelist_field_scheme: [],
        link_field_scheme: [],
        linklist_field_scheme: [],
        user_field_scheme: [],
        userlist_field_scheme: [],
      },
    },
    11: {
      id: 11,
      title: '12345',
      fields: {
        int_field_scheme: [
          {
            id: 22,
            local_index: 0,
            name: 'А',
            required: true,
            min_val: 0,
            max_val: 100,
          },
        ],
        real_field_scheme: [
          {
            id: 23,
            local_index: 3,
            name: 'Г',
            required: true,
            min_val: 0,
            max_val: 100,
            digits_after_point: 2,
          },
        ],
        text_field_scheme: [
          {
            id: 24,
            local_index: 1,
            name: 'Б',
            max_length: 10,
            required: true,
            lettercase: 'upper',
          },
        ],
        enum_field_scheme: [],
        list_field_scheme: [],
        bool_field_scheme: [
          {
            id: 25,
            local_index: 2,
            name: 'В',
            required: true,
          },
        ],
        file_field_scheme: [],
        filelist_field_scheme: [],
        link_field_scheme: [],
        linklist_field_scheme: [],
        user_field_scheme: [],
        userlist_field_scheme: [],
      },
      createdate: '2022-12-21T15:45:10.429215',
      modifydate: null,
      creator: 2,
      deletemark: false,
      ocr_available: false,
    },
  };

  res.status(200).jsonp(schemes[req.params.id]);
});

server.delete('/document/:id', (req, res) => {
  res.status(204).send();
  return;
});

server.delete('/document/scheme/:id', (req, res) => {
  res.status(204).send();
  return;
});

server.delete('/group/:id/users', (req, res) => {
  res.status(204).send();
  return;
});

server.post('/document', (req, res) => {
  setTimeout(() => {
    res.status(200).jsonp({
      id: 0,
      original: 'string',
      scheme: 0,
      directory: 0,
      createdate: '2022-12-15T16:38:12.842Z',
      modifydate: '2022-12-15T16:38:12.843Z',
      creator: 0,
      deletemark: true,
    });
  }, 1500);
});

server.put('/document/:id', (req, res) => {
  res.status(204).send();
  return;
});

server.put('/group/:id', (req, res) => {
  res.status(204).send();
  return;
});

server.get('/document/:id', (req, res) => {
  const even = Number(req.params.id) % 2;

  const responces = {
    0: {
      id: 25,
      original_name: '3 самостоятельная работа.docs',
      original:
        'https://storage.yandexcloud.net/ocrproject/originals/25.3%20%D1%81%D0%B0%D0%BC%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%B0?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=YCAJEXchuVag7skBJzRB62Ubk%2F20221221%2Fru-central1%2Fs3%2Faws4_request&X-Amz-Date=20221221T155431Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=cf0bb0ae2b1f13f03e939356d8142e7f79dc1d067e6b2a882af8a46c5a47cf61',
      scheme: 11,
      fields: {
        int_field: [
          {
            id: 22,
            local_index: 0,
            name: 'А',
            value: 0,
          },
        ],
        real_field: [
          {
            id: 23,
            local_index: 3,
            name: 'Г',
            value: 50.0,
          },
        ],
        text_field: [
          {
            id: 24,
            local_index: 1,
            name: 'Б',
            value: '40',
          },
          {
            id: 25,
            local_index: 2,
            name: 'Продавец',
            value: 'Миша',
          },
        ],
        enum_field: [],
        list_field: [],
        bool_field: [
          {
            id: 26,
            local_index: 3,
            name: 'В',
            value: true,
          },
        ],
        file_field: [],
        filelist_field: [],
        link_field: [],
        linklist_field: [],
        user_field: [],
        userlist_field: [],
      },
      directory: 1,
      createdate: '2022-12-21T15:54:30.618049',
      modifydate: null,
      creator: 2,
      deletemark: false,
    },
    1: {
      id: 9,
      original_name: 'doc_1.jpg',
      original:
        'https://storage.yandexcloud.net/ocrproject/originals/9.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=YCAJEXchuVag7skBJzRB62Ubk%2F20221219%2Fru-central1%2Fs3%2Faws4_request&X-Amz-Date=20221219T083104Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=e8ced323c69bd8da6ed93495e9adfd57e59315bbc137e0e7b14af7adc2710df5',
      scheme: 2,
      fields: {
        int_field: [],
        real_field: [],
        text_field: [
          {
            id: 0,
            local_index: 0,
            name: 'Продавец',
            value: 'ООО "КАРГО-ЭКСПРЕСС"',
          },
          {
            id: 1,
            local_index: 1,
            name: 'ИНН Продавца',
            value: '7723831352',
          },
          {
            id: 2,
            local_index: 2,
            name: 'КПП Продавца',
            value: '772301001',
          },
          {
            id: 3,
            local_index: 3,
            name: 'Покупатель',
            value: 'ООО "СИСТЕМНЫЕ ТЕХНОЛОГИИ"',
          },
          {
            id: 4,
            local_index: 4,
            name: 'ИНН Покупателя',
            value: '7726588120',
          },
          {
            id: 5,
            local_index: 5,
            name: 'КПП Покупателя',
            value: '772301001',
          },
        ],
        enum_field: [],
        list_field: [],
        bool_field: [],
        file_field: [],
        filelist_field: [],
        link_field: [],
        linklist_field: [],
        user_field: [],
        userlist_field: [],
      },
      directory: 2,
      createdate: '2022-12-19T08:15:55.022591',
      modifydate: '2022-12-19T08:15:55.022591',
      creator: 2,
      deletemark: false,
    },
  };

  res.status(200).jsonp(responces[even]);
});
server.post('/scheme/ocr', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { scheme_id, file_type, document } = req.body;

  if (scheme_id === 1) {
    res.status(200).jsonp({
      fields: {
        3: 49,
        5: 'К',
        1: -13,
        6: '2023-12-18T19:10:17.547362',
      },
      mismatch_warning: false,
    });
  } else if (scheme_id === 2) {
    res.status(200).jsonp({
      fields: {
        12: '',
        13: 'и что-то еще',
        10: 3,
        11: null,
        14: '2024-12-18T19:10:17.547362',
      },
      mismatch_warning: true,
    });
  } else if (scheme_id === 3) {
    res.status(200).jsonp({
      fields: {
        12: null,
        13: null,
        10: null,
        11: null,
        15: '2025-12-18T19:10:17.547362',
      },
      mismatch_warning: true,
    });
  }
});

server.put('/user/me/password', (req, res) => {
  res.status(204).jsonp({});
});

server.put('/user/me', (req, res) => {
  res.status(204).jsonp({});
});

server.post('/scheme/pdftoimg', (req, res) => {
  var options = {
    root: './server',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };

  var fileName = './balls.png';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

server.get('/user/me', (req, res) => {
  res.status(200).jsonp({
    id: 1,
    username: 'Garmash',
    superuser: true,
    allowed: true,
    displayname: 'Арсений Гармаш',
    email: 'arseni@gmail.com',
    additionalinfo: 'вафел',
    createdate: '3 сентября',
    passwordmodifydate: '2 сентября',
  });
  return;
  // return res.status(403).jsonp('Access Denied');
});

server.get('/group/all', (req, res) => {
  res.status(200).jsonp([1, 2, 3]);
});

server.get('/group/:id', (req, res) => {
  const responces = {
    1: {
      id: 1,
      name: 'Хомяки',
      description: 'КУШАТЬ',
      webprops: '{ "color": "teal.5" }',
    },
    2: {
      id: 2,
      name: 'Бурундуки',
      description: 'БУРУНДУЧИТЬ',
      webprops: '{ "color": "pink.5" }',
    },
    3: {
      id: 3,
      name: 'Варенники',
      description: 'ВКУСНО',
      webprops: '{ "color": "indigo.5" }',
    },
  };

  res.status(200).jsonp(responces[req.params.id]);
});

server.get('/group/:id/users', (req, res) => {
  const responces = {
    1: [1, 2, 3],
    2: [1, 2],
    3: [3],
  };

  res.status(200).jsonp(responces[req.params.id]);
});

server.get('/directory/:directoryid/group_rules/:groupid', (req, res) => {
  const response = {
    directory_id: 0,
    read: true,
    delete: true,
    document_create: true,
    document_delete: true,
    document_modify: true,
    document_move_from: false,
    document_move_to: true,
    directory_create: null,
    directory_modify: true,
    directory_move_from: true,
    directory_move_to: true,
  };

  const magickNumber = Math.round(Math.random())
    ? res.status(200).jsonp(response)
    : res.status(400).jsonp();
});

server.get('/user/all', (req, res) => {
  res.status(200).jsonp([1, 2, 3]);
});

server.get('/user/:id', (req, res) => {
  const responces = {
    1: {
      allowed: true,
      displayname: 'Арсений Гармаш',
      email: 'arseni@example.com',
      additionalinfo: 'Frontend Developer 1',
    },
    2: {
      allowed: false,
      displayname: 'Михаил Югай',
      email: 'mihail@example.com',
      additionalinfo: 'Frontend Developer 2',
    },
    3: {
      allowed: false,
      displayname: 'Евгений Жмакин',
      email: 'eugeni@example.com',
      additionalinfo: 'Teamlead',
    },
  };

  res.status(200).jsonp(responces[req.params.id]);
});

server.use(router);
server.listen(3005, () => {
  console.log('JSON Server is running');
});
