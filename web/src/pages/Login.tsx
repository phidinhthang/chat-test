import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { Button } from '../ui/Button';
import { InputField } from '../ui/InputField';
import { useLogin } from '../services/mutations/useLogin';
import { Link } from '../ui/Link';

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { mutate, isError, error } = useLogin();

  return (
    <div className='h-96 w-screen flex justify-center items-center'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async ({ username, password }, {}) => {
          mutate({ username, password });
        }}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <div className='w-80 mx-auto'>
              <InputField
                label='Username'
                name='username'
                placeholder='Username'
                errorMsg={errors.username}
              />
              <InputField
                label='Password'
                name='password'
                type='password'
                placeholder='password'
                errorMsg={errors.password}
              />
              <div>
                <Link href='/register'>register</Link>
              </div>
              <div className='mt-5 flex items-start justify-center'>
                <Button loading={isSubmitting} type='submit' className='w-full'>
                  Submit
                </Button>
              </div>
              <pre>{isError ? JSON.stringify(error, null, 2) : null}</pre>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
