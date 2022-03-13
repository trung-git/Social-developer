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
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'afterbegin',
          `<div class="alert alert-success">Login successfully</div>`
        );

      window.setTimeout(() => {
        location.assign('/home');
      }, 1500);
    }
  } catch (error) {
    // console.log(error.response.data);
    error.response.data.errors.forEach((mes) => {
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'afterbegin',
          `<div class="alert alert-danger">${mes.msg}</div>`
        );
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
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'afterbegin',
          `<div class="alert alert-success">Register successfully</div>`
        );

      window.setTimeout(() => {
        location.assign('/home');
      }, 1500);
    }
  } catch (error) {
    console.log(error.response.data);
    error.response.data.errors.forEach((mes) => {
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'afterbegin',
          `<div class="alert alert-danger">${mes.msg}</div>`
        );
    });
    window.setTimeout(() => {
      document.querySelectorAll('.alert').forEach((alert) => {
        alert.remove();
      });
    }, 5000);
  }
};
