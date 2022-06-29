// DOM
const btnLogin = document.getElementById('btnLogin');
const btnCreatePost = document.getElementById('btnCreatePost');
const btnDelete = document.querySelectorAll('.btnDelete');
const btnLike = document.querySelectorAll('.btnLike');
const btnSubmitCmt = document.getElementById('btnSubmitCmt');
const btnDeleteCmt = document.getElementsByClassName('btnDeleteCmt');
const btnRegister = document.getElementById('btnRegister');
const btnCreateProfile = document.getElementById('btnCreateProfile');
const btnAddExperience = document.getElementById('btnAddExperience');
const btnAddEducation = document.getElementById('btnAddEducation');
const btnDeleteExperience = document.getElementsByClassName(
  'btnDeleteExperience'
);
const logoutBtn = document.querySelector('#logoutBtn');
const btnDeleteEducation =
  document.getElementsByClassName('btnDeleteEducation');
const btnDeleteAccount = document.getElementById('btnDeleteAccount');
const postmodal = document.getElementById('myModal');
const btnModalSave = document.getElementById('btn-modal-save');
const cmtmodal = document.getElementById('myModalcmt');
const btnModalSaveCmt = document.getElementById('btn-modalcmt-save');
const cpwmodal = document.getElementById('myModalcpw');
const btnModalSaveCpw = document.getElementById('btn-modalcpw-save');

// Import
import { login, register, updatePassword } from './auth.js';
import { Confirm } from './comfirmation.js';
import {
  createComment,
  createPost,
  deleteCmt,
  deletePost,
  likePost,
  updatePost,
  updateComment,
} from './post.js';
import {
  addEducation,
  addExperience,
  createOrUpdateProfile,
  deleteAccount,
  deleteEducation,
  deleteExperience,
} from './profile.js';
import { successAlert, dangerAlert, toast } from './snackbar.js';

const origin = window.location.origin;
const socket = io.connect(origin);
// socket.on('connect', function () {
//   const socketID = socket.id; //
//   console.log("Socket id",socketID);
//   console.log("User id", );

// });
//
if (logoutBtn) {
  socket.emit('user-online', logoutBtn.dataset.userid);
}
socket.on('notification-comment', (name, i, isNoti, isUpdate = 1) => {
  if (isUpdate === 1) {
    const span = document.body
      .querySelector('.posts')
      ?.children[i].querySelector('.comment-count');
    if (span) {
      span.textContent = (parseInt(span.textContent) + 1).toString();
    }
  }
  if (isNoti === 1) {
    toast({
      title: 'Notification',
      message: `${name} has already comment your post`,
      type: 'success',
      duration: 5000,
    });
  }
});
socket.on('notification-like', (name, i, isLike, isNoti, isUpdate = 1) => {
  if (isLike === 1) {
    if (isUpdate === 1) {
      const span = document.body
        .querySelector('.posts')
        .children[i].querySelector('span');
      span.textContent = (parseInt(span.textContent) + 1).toString();
    }
    if (isNoti === 1) {
      toast({
        title: 'Notification',
        message: `${name} has already liked your post`,
        type: 'success',
        duration: 5000,
      });
    }
  } else if (isLike === 0) {
    if (isUpdate) {
      const span = document.body
        .querySelector('.posts')
        .children[i].querySelector('span');
      span.textContent = (parseInt(span.textContent) - 1).toString();
    }
    if (isNoti === 1) {
      toast({
        title: 'Notification',
        message: `${name} has already unliked your post`,
        type: 'warning',
        duration: 5000,
      });
    }
  }
});
if (btnLogin) {
  btnLogin.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

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
      // const container = document.querySelector('.container');
      errorMessage.forEach((mes) => {
        // container.insertAdjacentHTML(
        //   'afterbegin',
        //   `<div class="alert alert-danger">${mes}</div>`
        // );
        dangerAlert(mes);
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
      dangerAlert('Please fill out and try again');
    } else {
      await createPost(content);
    }
  });
}
if (btnDelete.length > 0) {
  btnDelete.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      Confirm.open({
        title: `Fodev - ${document.querySelector('#name-of-user').textContent}`,
        message: 'Do you want to delete this post ?',
        onok: async () => {
          await deletePost(btn.dataset.id, btn.closest('.post'));
        },
      });
    });
  });
}
if (btnLike.length > 0) {
  btnLike.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const result = await likePost(id, btn);

      let index = -1;
      const posts = document.getElementsByClassName('posts')[0].children;

      for (let i = 0; i < posts.length; i++) {
        if (posts[i].isEqualNode(btn.closest('.post'))) {
          index = i;
        }
      }
      if (
        result === 1 &&
        btn.dataset.user.toString().trim() !==
          logoutBtn.dataset.userid.toString().trim()
      ) {
        socket.emit(
          'user-like',
          btn.dataset.user,
          logoutBtn.dataset.username,
          index,
          0
        );
      } else if (
        result === 0 &&
        btn.dataset.user.toString().trim() !==
          logoutBtn.dataset.userid.toString().trim()
      ) {
        socket.emit(
          'user-unlike',
          btn.dataset.user,
          logoutBtn.dataset.username,
          index,
          0
        );
      } else if (
        result === 1 &&
        btn.dataset.user.toString().trim() ===
          logoutBtn.dataset.userid.toString().trim()
      ) {
        socket.emit(
          'user-like',
          btn.dataset.user,
          logoutBtn.dataset.username,
          index,
          1
        );
      } else if (
        result === 0 &&
        btn.dataset.user.toString().trim() ===
          logoutBtn.dataset.userid.toString().trim()
      ) {
        socket.emit(
          'user-unlike',
          btn.dataset.user,
          logoutBtn.dataset.username,
          index,
          1
        );
      }
    });
  });
}

if (btnSubmitCmt) {
  btnSubmitCmt.addEventListener('click', async (e) => {
    e.preventDefault();
    const content = document
      .getElementById('txtCmt')
      .value.replace(/\n\r?/g, '<br>');
    const id = btnSubmitCmt.dataset.id;
    if (!content) {
      dangerAlert('Please fill out and try again');
    } else {
      const result = await createComment(content, id);
      console.log(result);
      if (
        result === 1 &&
        btnSubmitCmt.dataset.user.trim() !==
          logoutBtn.dataset.userid.toString().trim()
      ) {
        console.log('Khác người');
        socket.emit(
          'user-comment',
          btnSubmitCmt.dataset.user.trim(),
          logoutBtn.dataset.username,
          btnSubmitCmt.dataset.index,
          0
        );
      } else if (
        result === 1 &&
        btnSubmitCmt.dataset.user.trim() ===
          logoutBtn.dataset.userid.toString().trim()
      ) {
        console.log('Cùng người');
        socket.emit(
          'user-comment',
          btnSubmitCmt.dataset.user.trim(),
          logoutBtn.dataset.username,
          btnSubmitCmt.dataset.index,
          1
        );
      }
    }
  });
}

if (btnDeleteCmt.length > 0) {
  for (let btn of btnDeleteCmt) {
    btn.addEventListener('click', async function (e) {
      e.preventDefault();
      Confirm.open({
        title: `Fodev - ${document.querySelector('#name-of-user').textContent}`,
        message: 'Do you want to delete this comment ?',
        onok: async () => {
          await deleteCmt(
            document.getElementById('btnSubmitCmt').dataset.id,
            btn.dataset.id,
            btn.closest('.post')
          );
        },
      });
    });
  }
}

if (btnRegister) {
  btnRegister.addEventListener('click', async (e) => {
    e.preventDefault();
    // Xu ly Password va ConfirmPassword
    if (
      document.getElementById('inputPassword').value !==
      document.getElementById('inputConfirmPassword').value
    ) {
      dangerAlert('Passwords are not the same');
    } else {
      // Goi API
      await register(
        document.getElementById('inputName').value,
        document.getElementById('inputEmail').value,
        document.getElementById('inputPassword').value
      );
    }
  });
}

if (btnCreateProfile) {
  btnCreateProfile.addEventListener('click', async (e) => {
    e.preventDefault();
    const status = document.getElementById('status').value;
    const company = document.getElementById('company').value;
    const website = document.getElementById('website').value;
    const location = document.getElementById('location').value;
    const skills = document.getElementById('skills').value;
    const githubusername = document.getElementById('githubusername').value;
    const bio = document.getElementById('bio').value;
    const twitter = document.getElementById('twitter').value;
    const facebook = document.getElementById('facebook').value;
    const youtube = document.getElementById('youtube').value;
    const linkedin = document.getElementById('linkedin').value;
    const instagram = document.getElementById('instagram').value;
    if (status == 0 || !skills) {
      if (status == 0) {
        dangerAlert('Please enter your status');
      }
      if (!skills) {
        dangerAlert('Please enter your skills');
      }
    } else {
      await createOrUpdateProfile({
        status,
        company,
        website,
        location,
        skills,
        githubusername,
        bio,
        twitter,
        facebook,
        linkedin,
        youtube,
        instagram,
      });
    }
  });
}

if (btnAddExperience) {
  btnAddExperience.addEventListener('click', async (e) => {
    e.preventDefault();
    const title = document.getElementById('jobTitle').value;
    const company = document.getElementById('company').value;
    const location = document.getElementById('location').value;
    const from = document.getElementById('experienceStart').value;
    const to = document.getElementById('experienceEnd').value;
    const isCurrentJob = document.getElementById('isCurrentJob');
    const description = document.getElementById('jobDescription').value;
    const data = {
      title,
      company,
      location,
      from,
      to,
      description,
      current: isCurrentJob.checked,
    };
    await addExperience(data);
  });
}

if (btnAddEducation) {
  btnAddEducation.addEventListener('click', async (e) => {
    e.preventDefault();
    const data = {
      school: document.getElementById('school').value,
      degree: document.getElementById('degree').value,
      fieldofstudy: document.getElementById('fieldofstudy').value,
      from: document.getElementById('educationStart').value,
      to: document.getElementById('educationEnd').value,
      current: document.getElementById('isCurrentEducation').checked,
      description: document.getElementById('description').value,
    };
    // console.log(data);
    await addEducation(data);
  });
}

if (btnDeleteExperience.length > 0) {
  for (let btn of btnDeleteExperience) {
    btn.addEventListener('click', async function (e) {
      e.preventDefault();
      Confirm.open({
        title: `Fodev - ${document.querySelector('#name-of-user').textContent}`,
        message: 'Do you want to delete this Experience ?',
        onok: async () => {
          await deleteExperience(
            e.target.dataset.id,
            btn.parentElement.parentElement
          );
        },
      });
    });
  }
}
if (btnDeleteEducation.length > 0) {
  for (let btn of btnDeleteEducation) {
    btn.addEventListener('click', async function (e) {
      e.preventDefault();
      Confirm.open({
        title: `Fodev - ${document.querySelector('#name-of-user').textContent}`,
        message: 'Do you want to delete this Education ?',
        onok: async () => {
          await deleteEducation(
            e.target.dataset.id,
            btn.parentElement.parentElement
          );
        },
      });
    });
  }
}
if (btnDeleteAccount) {
  btnDeleteAccount.addEventListener('click', async (e) => {
    e.preventDefault();
    Confirm.open({
      title: `Fodev - ${document.querySelector('#name-of-user').textContent}`,
      message: 'Do you want to delete this Account ?',
      onok: async () => {
        await deleteAccount();
      },
    });
  });
}

// Modal
// Get the modal
let currentContentPostP = undefined;
let currentContentPostBtn = undefined;
if (postmodal) {
  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName('close')[0];
  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    postmodal.style.display = 'none';
  };
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == postmodal) {
      postmodal.style.display = 'none';
    }
  };
  const btn = document.querySelectorAll('.open-modal');

  Array.prototype.forEach.call(btn, function (element) {
    element.addEventListener('click', function (e) {
      e.preventDefault();

      document.getElementById(
        'modal-name'
      ).value = `- ${e.currentTarget.dataset.name}`;
      document.getElementById('modal-text').value =
        e.currentTarget.dataset.text.replace(/<br\s*[\/]?>/gi, '\n');

      document
        .getElementById('btn-modal-save')
        .setAttribute('data-id', e.currentTarget.dataset.id);

      postmodal.style.display = 'block';
      // postmodal.setAttribute("") làm sao để lấy đc id post
      const parentofSelected = element.parentNode; // gives the parent DIV
      const children = parentofSelected.children;
      let p = undefined;
      for (let child of children) {
        if (child.classList.contains('my-1')) {
          p = child;
          break;
        }
      }
      currentContentPostP = p;
      currentContentPostBtn = element;
    });
  });
}

if (btnModalSave) {
  btnModalSave.addEventListener('click', async (e) => {
    e.preventDefault();
    const text = document
      .getElementById('modal-text')
      .value.replace(/\n\r?/g, '<br>');
    if (text.trim().length === 0) {
      dangerAlert('Can not update post with empty content !');
    } else {
      try {
        await updatePost(
          e.currentTarget.dataset.id,
          text,
          currentContentPostP,
          currentContentPostBtn
        );
      } catch (error) {
        console.log(error);
        dangerAlert('Some thing went wrong, Please try again !');
      }
    }
  });
}

let currentContentCmtP = undefined;
let currentContentCmtBtn = undefined;
let currentPostId = undefined;
if (cmtmodal) {
  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName('closecmt')[0];
  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    cmtmodal.style.display = 'none';
  };
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == cmtmodal) {
      cmtmodal.style.display = 'none';
    }
  };
  const btn = document.querySelectorAll('.open-cmtmodal');

  Array.prototype.forEach.call(btn, function (element) {
    element.addEventListener('click', function (e) {
      e.preventDefault();

      document.getElementById(
        'modalcmt-name'
      ).value = `- ${e.currentTarget.dataset.name}`;
      document.getElementById('modalcmt-text').value =
        e.currentTarget.dataset.text.replace(/<br\s*[\/]?>/gi, '\n');

      document
        .getElementById('btn-modalcmt-save')
        .setAttribute('data-id', e.currentTarget.dataset.id);

      cmtmodal.style.display = 'block';

      const parentofSelected = element.parentNode; // gives the parent DIV
      const children = parentofSelected.children;
      let p = undefined;
      for (let child of children) {
        if (child.classList.contains('my-1')) {
          p = child;
          break;
        }
      }
      currentContentCmtP = p;
      currentContentCmtBtn = element;
      currentPostId = e.currentTarget.dataset.cmtid;
    });
  });
}

if (btnModalSaveCmt) {
  btnModalSaveCmt.addEventListener('click', async (e) => {
    e.preventDefault();
    const text = document
      .getElementById('modalcmt-text')
      .value.replace(/\n\r?/g, '<br>');
    if (text.trim().length === 0) {
      dangerAlert('Can not update comment with empty content !');
    } else {
      try {
        await updateComment(
          currentPostId,
          e.currentTarget.dataset.id,
          text,
          currentContentCmtP,
          currentContentCmtBtn
        );
      } catch (error) {
        console.log(error);
        dangerAlert('Some thing went wrong, Please try again !');
      }
    }
  });
}

if (cpwmodal) {
  // Get the <span> element that closes the modal
  const span = document.querySelector('.closecpw');
  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    cpwmodal.style.display = 'none';
  };
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == cpwmodal) {
      cpwmodal.style.display = 'none';
    }
  };
  const btn = document.querySelector('#btnChangePassword');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      cpwmodal.style.display = 'block';
    });
  }
}
if (btnModalSaveCpw) {
  btnModalSaveCpw.addEventListener('click', async (e) => {
    const crtPass = document.querySelector('#currentPassword').value;
    const newPass = document.querySelector('#newPassword').value;
    const cfmPass = document.querySelector('#confirmPassword').value;
    if (newPass !== cfmPass) {
      console.log('khach');
      dangerAlert('Confirm Password is not match with new password');
    } else {
      try {
        // Goi api update password
        await updatePassword(crtPass, cfmPass);
      } catch (error) {
        console.log(error);
        dangerAlert('Some thing went wrong, Please try again !');
      }
    }
  });
}

if (document.getElementById('errorBtn')) {
  document.getElementById('errorBtn').addEventListener('click', () => {
    window.location = '/home';
  });
}
