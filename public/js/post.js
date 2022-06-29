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
    }
  } catch (error) {
    dangerAlert('Something went wrong!', () => {
      location.assign('/home');
    });
  }
};
export const updatePost = async (id, text, p, btn) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/posts/${id}`,
      data: {
        text,
      },
    });

    if (res.status === 200 && res.statusText === 'OK') {
      successAlert('Update post successfully');
      p.innerHTML = text;
      btn.setAttribute('data-text', text);
      document.getElementById('myModal').style.display = 'none';
    }
  } catch (error) {
    console.log(error);
    dangerAlert('Something went wrong!', () => {
      document.getElementById('myModal').style.display = 'none';
    });
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
      // Thông báo cho server
      return 1;
    }
  } catch (error) {
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
          return 0;
        }
      } catch (err) {
        dangerAlert('Unlike Fail. Please try again');
      }
    } else {
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

      return 1;
    }
  } catch (error) {
    dangerAlert('Something went wrong!', () => {
      location.reload();
    });
  }
};

export const updateComment = async (id, cmt_id, text, p, btn) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/posts/comment/${id}/${cmt_id}`,
      data: {
        text,
      },
    });

    if (res.status === 200 && res.statusText === 'OK') {
      successAlert('Update post successfully');
      p.innerHTML = text;
      btn.setAttribute('data-text', text);
      document.getElementById('myModalcmt').style.display = 'none';
    }
  } catch (error) {
    console.log(error);
    dangerAlert('Something went wrong!');
  }
};
