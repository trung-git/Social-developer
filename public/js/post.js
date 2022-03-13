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
      // document.querySelector('.comments').insertAdjacentHTML(
      //   'afterbegin',
      //   `<div class="post bg-white p-1 my-1">
      //     <div>
      //       <a href="profile.html">
      //         <img class="round-img" src="${res.data[0].avatar}" alt="" />
      //         <h4>${res.data[0].name}</h4>
      //       </a>
      //     </div>
      //     <div>
      //       <p class="my-1">${res.data[0].text}</p>
      //       <p class="post-date">
      //         Posted on ${(new Date(res.data[0].date).getMonth() + 1)
      //           .toString()
      //           .padStart(2, '0')}/${new Date(
      //     res.data[0].date
      //   ).getDate()}/${new Date(res.data[0].date).getFullYear()}
      //       </p>
      //       <button
      //         type="button"
      //         data-id="${res.data[0]._id}"
      //         class="btn btn-danger btnDeleteCmt"

      //       >
      //         <i class="fas fa-times"></i>
      //       </button>
      //     </div>
      //   </div>`
      // );

      window.setTimeout(() => {
        document.querySelector('.alert').remove();
        location.reload();
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
      location.reload();
    }, 1500);
  }
};
