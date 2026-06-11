document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const site   = params.get('site') || 'this site';
  document.getElementById('siteName').textContent = site;

  document.getElementById('backBtn').addEventListener('click', () => history.back());
  document.getElementById('closeBtn').addEventListener('click', () => window.close());
});