import { dangerAlert, successAlert } from './snackbar.js';

export const createOrUpdateProfile = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/profiles',
      data,
    });

    if (res.status === 200 && res.statusText === 'OK') {
      successAlert('Profile update successfully', () => {
        location.assign('/dashboard');
      });
    }
  } catch (error) {
    dangerAlert('Something went wrong!', () => {
      location.assign('/home');
    });
  }
};

export const addExperience = async (data) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: '/api/profiles/experience',
      data,
    });

    if (res.status === 200 && res.statusText === 'OK') {
      successAlert('Add Experience successfully', () => {
        location.assign('/dashboard');
      });
    }
  } catch (error) {
    // console.log(error.response);
    error.response.data.errors.forEach((err) => {
      dangerAlert(err.msg);
    });
  }
};

export const addEducation = async (data) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: '/api/profiles/education',
      data,
    });

    if (res.status === 200 && res.statusText === 'OK') {
      successAlert('Add Education successfully', () => {
        location.assign('/dashboard');
      });
    }
  } catch (error) {
    // console.log(error.response);
    error.response.data.errors.forEach((err) => {
      dangerAlert(err.msg);
    });
  }
};

export const deleteExperience = async (id, btn) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/profiles/experience/${id}`,
    });

    if (res.status === 200 && res.statusText === 'OK') {
      successAlert('Delete Experience successfully', () => {
        btn.remove();
      });
    }
  } catch (error) {
    console.log(error.response);
    error.response.data.errors.forEach((err) => {
      dangerAlert(err.msg);
    });
  }
};

export const deleteEducation = async (id, btn) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/profiles/education/${id}`,
    });

    if (res.status === 200 && res.statusText === 'OK') {
      successAlert('Delete Education successfully', () => {
        btn.remove();
      });
    }
  } catch (error) {
    console.log(error.response);
    error.response.data.errors.forEach((err) => {
      dangerAlert(err.msg);
    });
  }
};
export const deleteAccount = async () => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/profiles`,
    });

    if (res.status === 200 && res.statusText === 'OK') {
      successAlert('Delete Account successfully', () => {
        window.location.replace('/');
      });
    }
  } catch (error) {
    // console.log(error.response);
    error.response.data.errors.forEach((err) => {
      dangerAlert(err.msg);
    });
  }
};
