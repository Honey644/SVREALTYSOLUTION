// helpers for auth
function getToken(){ return localStorage.getItem('token'); }
function getUser(){ try{return JSON.parse(localStorage.getItem('user'));}catch(e){return null;} }
function requireAuth(redirect='login.html'){ if(!getToken()){ window.location.href=redirect; } }
async function api(path, options={}){
  const opts = Object.assign({headers:{}}, options);
  if(!opts.headers['Content-Type'] && !(opts.body instanceof FormData)) opts.headers['Content-Type']='application/json';
  const token = getToken();
  if(token) opts.headers['Authorization']='Bearer '+token;
  const res = await fetch(path, opts);
  if(res.status===401){ localStorage.clear(); window.location.href='login.html'; return; }
  const data = await res.json().catch(()=>({}));
  return {res, data};
}
