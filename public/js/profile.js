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
      // document
      //   .querySelector('.container')
      //   .insertAdjacentHTML(
      //     'beforeend',
      //     `<div class="alert alert-success">Profile update successfully</div>`
      //   );

      // window.setTimeout(() => {
      //   document.querySelector('.alert').remove();
      //   location.assign('/dashboard');
      // }, 5000);
    }
  } catch (error) {
    dangerAlert('Something went wrong!', () => {
      location.assign('/home');
    });
    // document
    //   .querySelector('.container')
    //   .insertAdjacentHTML(
    //     'beforeend',
    //     `<div class="alert alert-danger">Something went wrong!</div>`
    //   );

    // window.setTimeout(() => {
    //   document.querySelector('.alert').remove();
    //   location.assign('/home');
    // }, 5000);
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
      // document
      //   .querySelector('.container')
      //   .insertAdjacentHTML(
      //     'beforeend',
      //     `<div class="alert alert-success">Add Experience successfully</div>`
      //   );

      // window.setTimeout(() => {
      //   document.querySelector('.alert').remove();
      //   location.assign('/dashboard');
      // }, 3000);
    }
  } catch (error) {
    // console.log(error.response);
    error.response.data.errors.forEach((err) => {
      dangerAlert(err.msg);
      //   document
      //     .querySelector('.container')
      //     .insertAdjacentHTML(
      //       'beforeend',
      //       `<div class="alert alert-danger">${err.msg}</div>`
      //     );
      // });

      // window.setTimeout(() => {
      //   document.querySelectorAll('.alert').forEach((a) => {
      //     a.remove();
      //   });
      // }, 3000);
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
      // document
      //   .querySelector('.container')
      //   .insertAdjacentHTML(
      //     'beforeend',
      //     `<div class="alert alert-success">Add Education successfully</div>`
      //   );

      // window.setTimeout(() => {
      //   document.querySelector('.alert').remove();
      //   location.assign('/dashboard');
      // }, 3000);
    }
  } catch (error) {
    // console.log(error.response);
    error.response.data.errors.forEach((err) => {
      dangerAlert(err.msg);
      // document
      //   .querySelector('.container')
      //   .insertAdjacentHTML(
      //     'beforeend',
      //     `<div class="alert alert-danger">${err.msg}</div>`
      //   );
    });

    // window.setTimeout(() => {
    //   document.querySelectorAll('.alert').forEach((a) => {
    //     a.remove();
    //   });
    // }, 3000);
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
      // document
      //   .querySelector('.container')
      //   .insertAdjacentHTML(
      //     'afterbegin',
      //     `<div class="alert alert-success">Delete Experience successfully</div>`
      //   );

      // window.setTimeout(() => {
      //   document.querySelector('.alert').remove();
      // }, 3000);
    }
  } catch (error) {
    console.log(error.response);
    error.response.data.errors.forEach((err) => {
      dangerAlert(err.msg);
      // document
      //   .querySelector('.container')
      //   .insertAdjacentHTML(
      //     'afterbegin',
      //     `<div class="alert alert-danger">${err.msg}</div>`
      //   );
    });

    // window.setTimeout(() => {
    //   document.querySelectorAll('.alert').forEach((a) => {
    //     a.remove();
    //   });
    // }, 3000);
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
      // document
      //   .querySelector('.container')
      //   .insertAdjacentHTML(
      //     'afterbegin',
      //     `<div class="alert alert-success">Delete Education successfully</div>`
      //   );

      // btn.remove();
      // window.setTimeout(() => {
      //   document.querySelector('.alert').remove();
      // }, 3000);
    }
  } catch (error) {
    console.log(error.response);
    error.response.data.errors.forEach((err) => {
      dangerAlert(err.msg);
      // document
      //   .querySelector('.container')
      //   .insertAdjacentHTML(
      //     'afterbegin',
      //     `<div class="alert alert-danger">${err.msg}</div>`
      //   );
    });

    // window.setTimeout(() => {
    //   document.querySelectorAll('.alert').forEach((a) => {
    //     a.remove();
    //   });
    // }, 3000);
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
      // document
      //   .querySelector('.container')
      //   .insertAdjacentHTML(
      //     'afterbegin',
      //     `<div class="alert alert-success">Delete Account successfully</div>`
      //   );

      // window.setTimeout(() => {
      //   document.querySelector('.alert').remove();
      //   window.location.replace('/');
      // }, 3000);
    }
  } catch (error) {
    // console.log(error.response);
    error.response.data.errors.forEach((err) => {
      dangerAlert(err.msg);
      // document
      //   .querySelector('.container')
      //   .insertAdjacentHTML(
      //     'afterbegin',
      //     `<div class="alert alert-danger">${err.msg}</div>`
      //   );
    });

    // window.setTimeout(() => {
    //   document.querySelectorAll('.alert').forEach((a) => {
    //     a.remove();
    //   });
    // }, 3000);
  }
};
