export const successAlert = (message, func = () => {}) => {
  let el = document.createElement('div');
  el.className = 'snackbar';
  let y = document.getElementById('snackbar-container');
  el.innerHTML = message;
  y.append(el);
  el.className = 'snackbar snackbar-success show';
  setTimeout(function () {
    el.className = el.className.replace(
      'snackbar snackbar-success show',
      'snackbar'
    );
    setTimeout(func, 500);
  }, 3000);
};
export const dangerAlert = (message, func = () => {}) => {
  let el = document.createElement('div');
  el.className = 'snackbar';
  let y = document.getElementById('snackbar-container');
  el.innerHTML = message;
  y.append(el);
  el.className = 'snackbar snackbar-danger show';
  setTimeout(function () {
    el.className = el.className.replace(
      'snackbar snackbar-danger show',
      'snackbar'
    );
    setTimeout(func, 500);
  }, 3000);
};
