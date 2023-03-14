const urlParams = new URLSearchParams(window.location.search);
const assignmentId = urlParams.get('assignmentId');
const token = urlParams.get('token');


function decodeJwt(token) {
    const parts = token.split('.');
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    return { header, payload };
}


let userInfo = null;
const profilePic = document.getElementById('profile_pic');
profilePic.style.display = "none";

if (token == undefined || token == null) {
    alert("Unauthorized! You do not have valid credentials.");
} else {
    const { header, payload } = decodeJwt(token)
    userInfo = payload;
    if (userInfo != null) {
        profilePic.style.display = 'block';
    } else {
        profilePic.style.display = "none";
    }

}

function setUserInfo() {
    var username = document.getElementById('username');
    var email = document.getElementById('email');
    username.innerHTML = `${userInfo.name}`
    email.innerHTML = `${userInfo.email}`
}

if (assignmentId == undefined) {
    document.getElementById("nav-home-tab").style.display = "none";
    document.getElementById("nav-home").style.display = "none";
}


function isTokenExpired(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const binary = window.atob(base64);
    const decoder = new TextDecoder('utf-8');
    const decodedToken = JSON.parse(decoder.decode(new Uint8Array(Array.from(binary).map(c => c.charCodeAt(0)))));
    const now = Math.round(Date.now() / 1000); // convert to seconds
    return now > decodedToken.exp;
}


if (assignmentId && token) {
    const xhr = new XMLHttpRequest();
    if (!isTokenExpired(token)) {
        const url = `http://localhost:3000/api/student/solveassignment/?assignmentId=${assignmentId}`;
        xhr.open('GET', url);
        xhr.setRequestHeader('authentication', `bearer ${token}`);
        xhr.onload = () => {
            if (xhr.status) {
                const response = JSON.parse(xhr.responseText);
                console.log(response);
                let description = document.getElementById("description");
                let mobile_ps = document.getElementById("myps");
                description.innerHTML = response.data.assignmentData.description ?? "<h1>No Description</h1>"
                mobile_ps.innerHTML = response.data.assignmentData.description ?? "<h1>No Description</h1>"
            }
        };
        xhr.send();
    }else{
        alert("Session Expired! Please login again")
    }
} 
