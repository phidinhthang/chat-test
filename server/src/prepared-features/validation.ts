import { User } from '../entities/User';

interface Error {
  field: string;
  message: string;
}

export const validateLogin = (user: Partial<User>): Error[] => {
  const errors: Error[] = [];

  if (!user.username) {
    errors.push({
      field: 'username',
      message: 'Tên tài khoản không được bỏ trống.',
    });
  } else if (user.username.length < 3) {
    errors.push({
      field: 'username',
      message: 'Tên tài khoản phải chứa ít nhất 3 kí tự.',
    });
  }

  if (!user.password) {
    errors.push({
      field: 'password',
      message: 'Mật khẩu không được bỏ trống.',
    });
  }

  return errors;
};

export const validateRegister = (user: Partial<User>): Error[] => {
  const errors: Error[] = [];
  if (!user.username) {
    errors.push({
      field: 'username',
      message: 'Tên tài khoản không được bỏ trống.',
    });
  } else if (user.username.length < 4) {
    errors.push({
      field: 'username',
      message: 'Tên tài khoản phải chứa ít nhất 4 kí tự.',
    });
  }

  if (!user.password) {
    errors.push({
      field: 'password',
      message: 'Mật khẩu không được bỏ trống.',
    });
  } else if (user.password.length < 4) {
    errors.push({
      field: 'password',
      message: 'Mật khẩu phải chứa ít nhất 4 kí tự.',
    });
  }

  return errors;
};
