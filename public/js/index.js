// DOM
const btnLogin = document.getElementById('btnLogin');
const btnCreatePost = document.getElementById('btnCreatePost');
const btnDelete = document.querySelectorAll('.btnDelete');
const btnLike = document.querySelectorAll('.btnLike');
const btnSubmitCmt = document.getElementById('btnSubmitCmt');
const btnDeleteCmt = document.querySelectorAll('.btnDeleteCmt');
// Import
import { login } from './auth.js';
import {
  createComment,
  createPost,
  deleteCmt,
  deletePost,
  likePost,
  unlikePost,
} from './post.js';

//
if (btnLogin) {
  btnLogin.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    //
    function removeAlert() {
      document.querySelectorAll('.alert').forEach(function (node) {
        node.parentNode.removeChild(node);
      });
    }
    document.getElementById('login-username').onfocus = removeAlert;
    document.getElementById('login-password').onfocus = removeAlert;

    // Validate Input
    const errorMessage = [];
    const apos = email.indexOf('@');
    const dotpos = email.lastIndexOf('.');
    if (apos < 1 || dotpos - apos < 2) {
      errorMessage.unshift('Please enter a valid email');
    }
    if (password.length < 6) {
      errorMessage.unshift('Please enter a valid password');
    }
    if (errorMessage.length > 0) {
      const container = document.querySelector('.container');
      errorMessage.forEach((mes) => {
        container.insertAdjacentHTML(
          'afterbegin',
          `<div class="alert alert-danger">${mes}</div>`
        );
      });
    } else {
      // Login execute
      await login(email, password);
    }
  });
}

if (btnCreatePost) {
  btnCreatePost.addEventListener('click', async (e) => {
    e.preventDefault();
    const content = document
      .getElementById('txtContentPost')
      .value.replace(/\n\r?/g, '<br>');
    if (!content) {
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'afterbegin',
          `<div class="alert alert-danger">Please fill out and try again</div>`
        );
      window.setTimeout(() => {
        document.querySelector('.alert').remove();
      }, 1500);
    } else {
      await createPost(content);
    }
  });
}
if (btnDelete.length > 0) {
  btnDelete.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (confirm('Do you want to delete this post?')) {
        await deletePost(btn.dataset.id, btn.closest('.post'));
      }
    });
  });
}
if (btnLike.length > 0) {
  btnLike.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      // Check this post is like ?
      // If False -> Like
      await likePost(id, btn);
      // If True -> Unlike
    });
  });
}

if (btnSubmitCmt) {
  btnSubmitCmt.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log('Click');

    const content = document
      .getElementById('txtCmt')
      .value.replace(/\n\r?/g, '<br>');
    const id = btnSubmitCmt.dataset.id;
    if (!content) {
      document
        .querySelector('.container')
        .insertAdjacentHTML(
          'afterbegin',
          `<div class="alert alert-danger">Please fill out and try again</div>`
        );
      window.setTimeout(() => {
        document.querySelector('.alert').remove();
      }, 1500);
    } else {
      await createComment(content, id);
    }
  });
}

if (btnDeleteCmt.length > 0) {
  btnDeleteCmt.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();

      if (confirm('Do you want to delete this comment?')) {
        await deleteCmt(
          document.getElementById('btnSubmitCmt').dataset.id,
          btn.dataset.id,
          btn.closest('.post')
        );
      }
    });
  });
}
