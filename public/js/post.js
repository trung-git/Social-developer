export const createPost = async (text) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/posts',
      data: {
        text,
      },
    });

    if (res.status === 200 && res.statusText === 'OK') {
      document.getElementById('txtContentPost').textContent = '';

      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'afterbegin',
          `<div class="alert alert-success">Post successfully</div>`
        );

      window.setTimeout(() => {
        document.querySelector('.alert').remove();
        location.assign('/home');
      }, 1500);
    }
  } catch (error) {
    document
      .querySelector('.container')
      .insertAdjacentHTML(
        'afterbegin',
        `<div class="alert alert-danger">Something went wrong!</div>`
      );

    window.setTimeout(() => {
      document.querySelector('.alert').remove();
      location.assign('/home');
    }, 1500);
  }
};
export const deletePost = async (id, btn) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/posts/${id}`,
    });

    if (res.status === 200 && res.statusText === 'OK') {
      btn.remove();
    }
  } catch (error) {
    alert('Delete Fail. Please try again');
  }
};
export const likePost = async (id, btn) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `/api/posts/like/${id}`,
    });
    if (res.status === 200 && res.statusText === 'OK') {
      document.getElementById(`${id}`).textContent = res.data.length;
    }
  } catch (error) {
    // console.log(error.response);
    if (error.response.status === 400 && error.response.data.statusCode === 0) {
      // Unlike
      try {
        const resUnLike = await axios({
          method: 'PUT',
          url: `/api/posts/unlike/${id}`,
        });
        if (resUnLike.status === 200 && resUnLike.statusText === 'OK') {
          document.getElementById(`${id}`).textContent = resUnLike.data.length;
        }
      } catch (err) {
        // console.log(err.response);
        alert('Unlike Fail. Please try again');
      }
    } else {
      alert('Like Fail. Please try again');
    }
  }
};
export const unlikePost = async (id, btn) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `/api/posts/unlike/${id}`,
    });
    console.log(res);
    if (res.status === 200 && res.statusText === 'OK') {
      btn.classList.remove('btn-light');
      btn.classList.add('btn-danger');
    }
  } catch (error) {
    console.log(error);
    alert('Unlike Fail. Please try again');
  }
};
export const createComment = async (text, id) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/posts/comment/${id}`,
      data: {
        text,
      },
    });

    if (res.status === 200 && res.statusText === 'OK') {
      document.getElementById('txtCmt').value = '';
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'afterbegin',
          `<div class="alert alert-success">Comment successfully</div>`
        );

      window.setTimeout(() => {
        document.querySelector('.alert').remove();
      }, 1500);
    }
  } catch (error) {
    console.log(error);
    document
      .querySelector('.container')
      .insertAdjacentHTML(
        'afterbegin',
        `<div class="alert alert-danger">Something went wrong!</div>`
      );

    window.setTimeout(() => {
      document.querySelector('.alert').remove();
      // location.assign('/home');
    }, 1500);
  }
};
export const deleteCmt = async (idPost, idCmt, btn) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/posts/comment/${idPost.toString().trim()}/${idCmt
        .toString()
        .trim()}`,
    });

    if (res.status === 200 && res.statusText === 'OK') {
      btn.remove();
    }
  } catch (error) {
    console.log(error.response);
    alert('Delete Fail. Please try again');
  }
};
