const urlParams = new URLSearchParams(window.location.search);
const assignmentId = urlParams.get('assignmentId');
const token = urlParams.get('token');
const backend = "https://laas-prod.onrender.com"
// const backend = "http://localhost:9696"


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
        localStorage.setItem("userId", userInfo.id)
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
    document.getElementById("submit_button").style.display = "none";
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
    console.log("Fetching Data From Servers");
    const xhr = new XMLHttpRequest();
    if (!isTokenExpired(token)) {
        const url = `${backend}/api/student/solveassignment/?assignmentId=${assignmentId}`;
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
    } else {
        alert("Session Expired! Please login again")
    }
}


function showToast(type, message) {
    const toast = document.querySelector('.mytoast');
    toast.innerText = message;
    if (type == "error") {
        toast.style.color = "#FF3131";
        toast.style.borderLeft = "1px solid #FF3131";
    }else{
        toast.style.color = "#0ecc0b";
        toast.style.borderLeft = "1px solid #0ecc0b";
    }
    toast.style.visibility = 'visible';
    setTimeout(function () {
        toast.style.visibility = 'hidden';
    }, 3000);
}



function submitAssignment() {
    const jwtToken = token;
    const myassignmentId = assignmentId;
    const code = localStorage.getItem(assignmentId);
    const currentLanguage = localStorage.getItem("currentLanguage");

    if (!isTokenExpired(jwtToken)) {
        const loaderOverlay = document.querySelector(".loader-overlay");
        loaderOverlay.style.display = "flex"; // show the loader overlay

        const xhr = new XMLHttpRequest();
        const url = `${backend}/api/student/submit`;
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("authentication", "bearer "+jwtToken);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                loaderOverlay.style.display = "none"; // hide the loader overlay
                if (xhr.status === 200) {
                    showToast("success", "Assignment Submitted Successfully");
                    console.log("Assignment Submitted Successfully");
                } else if (xhr.status === 404) {
                    showToast("error", "404 API NOT FOUND");
                    console.log("Error:", xhr.statusText);
                } else if(xhr.status === 500){
                    showToast("error", "Oh Crap! Internal Server Error");
                }else{
                    showToast("error", "An Unexpected Error Occured"); 
                }
            } else {
                showToast("error", xhr.responseText ?? "An Unexpected Error Occured"); 
            }
        };
        const data = JSON.stringify({ assignmentId: myassignmentId, code: code , language: currentLanguage});
        xhr.send(data);
    }
}
