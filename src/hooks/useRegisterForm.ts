import { z } from 'zod';
import { FormEvent } from 'react';
import { useForm, UseFormReturnType, zodResolver } from '@mantine/form';
import { useSignupMutation } from 'store/api/auth';

import { useNavigate } from 'react-router-dom';

const schema = z.object({
  displayName: z
    .string()
    .min(2, { message: 'Имя пользователя должно быть больше 2-х знаков' }),
  userName: z
    .string()
    .min(2, { message: 'Логин должен быть больше 2-х знаков' }),
  email: z.string().email({ message: 'Неверный формат email адреса' }),
  password: z
    .string()
    .regex(
      /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g,
      'Неверный формат пароля'
    ),
  password2: z
    .string()
    .regex(
      /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g,
      'Пароли должны совпадать '
    ),
});

export const useRegisterForm = (): [
  UseFormReturnType<{
    displayName: string;
    userName: string;
    email: string;
    password: string;
    password2: string;
  }>,
  (event: FormEvent<HTMLFormElement>) => void,
  'Пароли должны совпадать' | null,
  boolean
] => {
  const [register, { isLoading }] = useSignupMutation();

  const navigate = useNavigate();

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      displayName: '',
      userName: '',
      email: '',
      password: '',
      password2: '',
    },

    validate: zodResolver(schema),
  });

  const passwordConfirmError =
    !form.isTouched('password2') ||
    form.getInputProps('password').value ===
      form.getInputProps('password2').value
      ? null
      : 'Пароли должны совпадать';

  const submitFn = form.onSubmit(async (values) => {
    try {
      const payload = await register({
        displayname: values.displayName,
        username: values.userName,
        email: values.email,
        password: values.password,
      }).unwrap();

      navigate('/auth');
    } catch (error) {
      form.setErrors({
        displayName: ' ',
        userName: ' ',
        email: ' ',
        password: ' ',
        password2: ' ',
      });

      setTimeout(() => form.clearErrors(), 650);
    }
  });

  return [form, submitFn, passwordConfirmError, isLoading];
};
