const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('token')) {
  const token = urlParams.get('token');
  console.log(`token: ${token}`);
} else {
  console.log('token parameter not found');
  alert("Unauthorized, Please Login or else your code will not get submitted")
}