import { dangerAlert, successAlert } from './snackbar.js';

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
      successAlert('Post successfully', () => {
        location.assign('/home');
      });
      // document
      //   .querySelector('.container')
      //   .insertAdjacentHTML(
      //     'afterbegin',
      //     `<div class="alert alert-success">Post successfully</div>`
      //   );

      // window.setTimeout(() => {
      //   document.querySelector('.alert').remove();
      //   location.assign('/home');
      // }, 1500);
    }
  } catch (error) {
    dangerAlert('Something went wrong!', () => {
      location.assign('/home');
    });
    // document
    //   .querySelector('.container')
    //   .insertAdjacentHTML(
    //     'afterbegin',
    //     `<div class="alert alert-danger">Something went wrong!</div>`
    //   );

    // window.setTimeout(() => {
    //   document.querySelector('.alert').remove();
    //   location.assign('/home');
    // }, 1500);
  }
};
export const deletePost = async (id, btn) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/posts/${id}`,
    });

    if (res.status === 200 && res.statusText === 'OK') {
      successAlert('Delete post successfully');
      btn.remove();
    }
  } catch (error) {
    dangerAlert('Delete Fail. Please try again');
    // alert('Delete Fail. Please try again');
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
      btn.closest('.btn').classList.remove('btn-light');
      btn.closest('.btn').classList.add('btn-success');
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
          btn.closest('.btn').classList.add('btn-light');
          btn.closest('.btn').classList.remove('btn-success');
        }
      } catch (err) {
        // console.log(err.response);
        dangerAlert('Unlike Fail. Please try again');

        // alert('Unlike Fail. Please try again');
      }
    } else {
      // alert('Like Fail. Please try again');
      dangerAlert('Like Fail. Please try again');
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
    // console.log(error);

    dangerAlert('Unlike Fail. Please try again');
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
      successAlert('Delete comment successfully');
      btn.remove();
    }
  } catch (error) {
    // console.log(error.response);
    dangerAlert('Delete Fail. Please try again');
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
      successAlert('Comment successfully', () => {
        location.reload();
      });
      // document
      //   .querySelector('.container')
      //   .insertAdjacentHTML(
      //     'afterbegin',
      //     `<div class="alert alert-success">Comment successfully</div>`
      //   );

      // window.setTimeout(() => {
      //   document.querySelector('.alert').remove();
      //   location.reload();
      // }, 1500);
    }
  } catch (error) {
    dangerAlert('Something went wrong!', () => {
      location.reload();
    });
    // document
    //   .querySelector('.container')
    //   .insertAdjacentHTML(
    //     'afterbegin',
    //     `<div class="alert alert-danger">Something went wrong!</div>`
    //   );

    // window.setTimeout(() => {
    //   document.querySelector('.alert').remove();
    //   location.reload();
    // }, 1500);
  }
};
