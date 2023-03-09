const urlParams = new URLSearchParams(window.location.search);
const assignmentId = urlParams.get('assignmentId');
const token = urlParams.get('token');

if (assignmentId && token) {
    const xhr = new XMLHttpRequest();
    const url = `http://localhost:3000/api/student/solveassignment/?assignmentId=${assignmentId}`;
    xhr.open('GET', url);
    xhr.setRequestHeader('authentication', `bearer ${token}`);
    xhr.onload = () => {
        if (xhr.status) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            let description = document.getElementById("description");
            description.innerHTML = response.data.assignmentData.description ?? "<h1>No Description</h1>"
        }
    };
    xhr.send();

} else {
    alert("Access Denied");
}
