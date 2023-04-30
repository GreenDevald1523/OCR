export const NetworkErrorsMap: {
  [endpoint: string]: { status: number; message: string }[];
} = {
  login: [{ status: 401, message: 'Неверный логин или пароль' }],
  signup: [
    {
      status: 422,
      message:
        'Введены некорректные данные, или пользователь с указанными данными уже существует',
    },
  ],
  default: [{ status: 422, message: 'Введены неверные данные' }],
};

export const getErrorMessageFromErrorsMap = (
  endpoint: string,
  status: number,
  fallback = 'Что-то пошло не так'
) => {
  const errorObject = NetworkErrorsMap[endpoint]
    ? NetworkErrorsMap[endpoint].find((error) => status === error.status)
    : NetworkErrorsMap.default.find((error) => status === error.status);

  return errorObject?.message ?? fallback;
};
