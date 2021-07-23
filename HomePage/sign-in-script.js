// handle sign in
document.querySelector("#sign_in_form").addEventListener("submit", signInHandler);
function signInHandler(event) {
    event.preventDefault();
    const name = event.target.elements["name"].value;
    const email = event.target.elements["email"].value;
    const password = event.target.elements["password"].value;
    const signInInfo = {username: name, email: email, password: password};
    fetch('https://city-snapshot.herokuapp.com/user/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signInInfo)
    })
    .then(response => response.json())
    .then(data => {
        alert('Login Successful');
        localStorage.setItem("token", data.token)
        document.location.href = 'index.html'
    })
    .catch((error) => {
        console.error('Error:', error);
    })
}