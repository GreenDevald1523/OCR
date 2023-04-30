import { z } from 'zod';
import { FormEvent } from 'react';
import { useForm, UseFormReturnType, zodResolver } from '@mantine/form';
import { useLoginMutation } from 'store/api/auth';
import { useNavigate } from 'react-router-dom';
import { useTypedDispatch } from 'store/ReduxHooks';
import { setCredentials } from 'store/slices/authSlice';

const schema = z.object({
  userName: z.string().min(2, { message: 'Введите логин' }),
  password: z.string().min(6, { message: 'Введите пароль' }),
});

export const useLoginForm = (): [
  UseFormReturnType<{
    userName: string;
    password: string;
    rememberMe: boolean;
  }>,
  (event: FormEvent<HTMLFormElement>) => void
] => {
  const dispatch = useTypedDispatch();

  const [login] = useLoginMutation();

  const navigate = useNavigate();

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      userName: '',
      password: '',
      rememberMe: false,
    },

    validate: zodResolver(schema),
  });

  const submitFn = form.onSubmit(async (values) => {
    try {
      await login({
        username: values.userName,
        password: values.password,
        remember_me: values.rememberMe,
      })
        .unwrap()
        .then((res) => {
          dispatch(setCredentials({ refresh_token: res.refresh_token }));
        });
      navigate('/home');
    } catch (error) {
      form.setErrors({
        userName: 'Неверный логин или пароль',
        password: ' ',
      });
    }
  });

  return [form, submitFn];
};
