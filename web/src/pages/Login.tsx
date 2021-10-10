import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';
import { client } from '../services/client';
import { setAccessToken } from '../lib/accessToken';
import { LoginInput } from '../types/input/LoginInput';
import { UserResponse } from '../types/response/User';
import { Button } from '../ui/Button';
import { InputField } from '../ui/InputField';

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const queryClient = useQueryClient();
  const { mutate, isError, error } = useMutation(
    ({ username, password }: LoginInput) =>
      client.post<LoginInput, UserResponse>('/login', { username, password })
  );

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={async ({ username, password }, {}) => {
        mutate(
          { username, password },
          {
            onSuccess: (data) => {
              queryClient.setQueryData('me', () => ({ user: data.user }));
              setAccessToken(data.token);
              history.push('/');
            },
          }
        );
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className='w-80 mx-auto'>
            <div>
              <InputField
                label='Username'
                name='username'
                placeholder='Username'
              />
            </div>
            <div>
              <InputField
                label='Password'
                name='password'
                type='password'
                placeholder='password'
              />
            </div>
            <div className='mt-5 flex items-start justify-center'>
              <Button loading={isSubmitting} type='submit'>
                Submit
              </Button>
            </div>
            <pre>{isError ? JSON.stringify(error, null, 2) : null}</pre>
          </div>
        </Form>
      )}
    </Formik>
  );
};
