import { dangerAlert, successAlert } from './snackbar.js';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/auth',
      data: {
        email,
        password,
      },
    });

    if (res.status === 200 && res.statusText === 'OK') {
      successAlert('Login successfully', () => {
        location.assign('/home');
      });
    }
  } catch (error) {
    console.log(error);
    error.response.data.errors.forEach((mes) => {
      dangerAlert(mes.msg);
    });
  }
};

export const register = async (name, email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/users',
      data: {
        name,
        email,
        password,
      },
    });

    if (res.status === 200 && res.statusText === 'OK') {
      successAlert('Register successfully', () => {
        location.assign('/update-profile');
      });
    }
  } catch (error) {
    error.response.data.errors.forEach((mes) => {
      dangerAlert(mes.msg);
    });
  }
};

export const updatePassword = async (password, newPassword) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/auth/update-password',
      data: {
        password,
        newPassword,
      },
    });

    if (res.status === 200 && res.statusText === 'OK') {
      successAlert('Update password successfully');
      // xoa input
      document.querySelector('#currentPassword').value = '';
      document.querySelector('#newPassword').value = '';
      document.querySelector('#confirmPassword').value = '';
      // tat modal
      document.getElementById('myModalcpw').style.display = 'none';
    }
  } catch (error) {
    console.log(error.response.data);
    error.response.data.errors.forEach((mes) => {
      dangerAlert(mes.msg);
    });
  }
};
