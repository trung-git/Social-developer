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
const btnDeleteEducation =
  document.getElementsByClassName('btnDeleteEducation');
const btnDeleteAccount = document.getElementById('btnDeleteAccount');
// Import
import { login, register } from './auth.js';
import {
  createComment,
  createPost,
  deleteCmt,
  deletePost,
  likePost,
} from './post.js';
import {
  addEducation,
  addExperience,
  createOrUpdateProfile,
  deleteAccount,
  deleteEducation,
  deleteExperience,
} from './profile.js';
import { successAlert, dangerAlert } from './snackbar.js';

//
if (btnLogin) {
  btnLogin.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    //
    // function removeAlert() {
    //   document.querySelectorAll('.alert').forEach(function (node) {
    //     node.parentNode.removeChild(node);
    //   });
    // }
    // document.getElementById('login-username').onfocus = removeAlert;
    // document.getElementById('login-password').onfocus = removeAlert;

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
      // document
      //   .querySelector('.container')
      //   .insertAdjacentHTML(
      //     'afterbegin',
      //     `<div class="alert alert-danger">Please fill out and try again</div>`
      //   );
      // window.setTimeout(() => {
      //   document.querySelector('.alert').remove();
      // }, 1500);
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
      await likePost(id, btn);
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
      // document
      //   .querySelector('.container')
      //   .insertAdjacentHTML(
      //     'afterbegin',
      //     `<div class="alert alert-danger">Please fill out and try again</div>`
      //   );
      // window.setTimeout(() => {
      //   document.querySelector('.alert').remove();
      // }, 1500);
    } else {
      await createComment(content, id);
    }
  });
}

if (btnDeleteCmt.length > 0) {
  for (let btn of btnDeleteCmt) {
    btn.addEventListener('click', async function (e) {
      e.preventDefault();
      console.log('click');
      if (confirm('Do you want to delete this comment?')) {
        await deleteCmt(
          document.getElementById('btnSubmitCmt').dataset.id,
          btn.dataset.id,
          btn.closest('.post')
        );
      }
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
      // document
      //   .querySelector('.container')
      //   .insertAdjacentHTML(
      //     'afterbegin',
      //     `<div class="alert alert-danger">Passwords are not the same</div>`
      //   );
      // window.setTimeout(() => {
      //   document.querySelector('.alert').remove();
      // }, 5000);
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
        //   document
        //     .querySelector('#status')
        //     .insertAdjacentHTML(
        //       'afterend',
        //       `<div class="alert alert-danger">Please enter your status</div>`
        //     );
        //   window.setTimeout(() => {
        //     document.querySelector('.alert').remove();
        //   }, 5000);
      }
      if (!skills) {
        dangerAlert('Please enter your skills');
        // document
        //   .querySelector('#skills')
        //   .insertAdjacentHTML(
        //     'afterend',
        //     `<div class="alert alert-danger">Please enter your skills</div>`
        //   );
        // window.setTimeout(() => {
        //   document.querySelector('.alert').remove();
        // }, 5000);
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
    console.log(data);
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
      if (confirm('Do you want to delete this Experience ? ') == true) {
        await deleteExperience(
          e.target.dataset.id,
          btn.parentElement.parentElement
        );
      }
    });
  }
}
if (btnDeleteEducation.length > 0) {
  for (let btn of btnDeleteEducation) {
    btn.addEventListener('click', async function (e) {
      e.preventDefault();
      if (confirm('Do you want to delete this Education ?') == true) {
        await deleteEducation(
          e.target.dataset.id,
          btn.parentElement.parentElement
        );
      }
    });
  }
}
if (btnDeleteAccount) {
  btnDeleteAccount.addEventListener('click', async (e) => {
    e.preventDefault();

    if (confirm('Do you want to delete this Account ?') == true) {
      await deleteAccount();
    }
  });
}
