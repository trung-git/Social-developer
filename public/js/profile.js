export const createOrUpdateProfile = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/profiles',
      data,
    });

    if (res.status === 200 && res.statusText === 'OK') {
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'beforeend',
          `<div class="alert alert-success">Profile update successfully</div>`
        );

      window.setTimeout(() => {
        document.querySelector('.alert').remove();
        location.assign('/dashboard');
      }, 5000);
    }
  } catch (error) {
    document
      .querySelector('.container')
      .insertAdjacentHTML(
        'beforeend',
        `<div class="alert alert-danger">Something went wrong!</div>`
      );

    window.setTimeout(() => {
      document.querySelector('.alert').remove();
      location.assign('/home');
    }, 5000);
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
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'beforeend',
          `<div class="alert alert-success">Add Experience successfully</div>`
        );

      window.setTimeout(() => {
        document.querySelector('.alert').remove();
        location.assign('/dashboard');
      }, 3000);
    }
  } catch (error) {
    console.log(error.response);
    error.response.data.errors.forEach((err) => {
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'beforeend',
          `<div class="alert alert-danger">${err.msg}</div>`
        );
    });

    window.setTimeout(() => {
      document.querySelectorAll('.alert').forEach((a) => {
        a.remove();
      });
    }, 3000);
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
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'beforeend',
          `<div class="alert alert-success">Add Education successfully</div>`
        );

      window.setTimeout(() => {
        document.querySelector('.alert').remove();
        location.assign('/dashboard');
      }, 3000);
    }
  } catch (error) {
    console.log(error.response);
    error.response.data.errors.forEach((err) => {
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'beforeend',
          `<div class="alert alert-danger">${err.msg}</div>`
        );
    });

    window.setTimeout(() => {
      document.querySelectorAll('.alert').forEach((a) => {
        a.remove();
      });
    }, 3000);
  }
};

export const deleteExperience = async (id, btn) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/profiles/experience/${id}`,
    });

    if (res.status === 200 && res.statusText === 'OK') {
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'afterbegin',
          `<div class="alert alert-success">Delete Experience successfully</div>`
        );

      btn.remove();
      window.setTimeout(() => {
        document.querySelector('.alert').remove();
      }, 3000);
    }
  } catch (error) {
    console.log(error.response);
    error.response.data.errors.forEach((err) => {
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'afterbegin',
          `<div class="alert alert-danger">${err.msg}</div>`
        );
    });

    window.setTimeout(() => {
      document.querySelectorAll('.alert').forEach((a) => {
        a.remove();
      });
    }, 3000);
  }
};

export const deleteEducation = async (id, btn) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/profiles/education/${id}`,
    });

    if (res.status === 200 && res.statusText === 'OK') {
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'afterbegin',
          `<div class="alert alert-success">Delete Education successfully</div>`
        );

      btn.remove();
      window.setTimeout(() => {
        document.querySelector('.alert').remove();
      }, 3000);
    }
  } catch (error) {
    console.log(error.response);
    error.response.data.errors.forEach((err) => {
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'afterbegin',
          `<div class="alert alert-danger">${err.msg}</div>`
        );
    });

    window.setTimeout(() => {
      document.querySelectorAll('.alert').forEach((a) => {
        a.remove();
      });
    }, 3000);
  }
};
export const deleteAccount = async () => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/profiles`,
    });

    if (res.status === 200 && res.statusText === 'OK') {
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'afterbegin',
          `<div class="alert alert-success">Delete Account successfully</div>`
        );

      window.setTimeout(() => {
        document.querySelector('.alert').remove();
        window.location.replace('/');
      }, 3000);
    }
  } catch (error) {
    console.log(error.response);
    error.response.data.errors.forEach((err) => {
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'afterbegin',
          `<div class="alert alert-danger">${err.msg}</div>`
        );
    });

    window.setTimeout(() => {
      document.querySelectorAll('.alert').forEach((a) => {
        a.remove();
      });
    }, 3000);
  }
};
