import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { InputField } from '../ui/InputField';
import { Button } from '../ui/Button';
import { useRegister } from '../services/mutations/useRegister';

export const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const { register, error, isError } = useRegister();

  return (
    <div className='h-96 w-screen flex justify-center items-center'>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={async ({ username, password }) => {
          register({ username, password });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className='w-80 mx-auto'>
              <InputField
                name='username'
                label='Username'
                placeholder='Username'
              />
              <InputField
                name='password'
                label='Password'
                placeholder='Password'
                type='password'
              />
              <div className='mt-5 flex items-start justify-center'>
                <Button type='submit' className='w-full' loading={isSubmitting}>
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
