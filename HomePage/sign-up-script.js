//handle sign up
document.querySelector("#sign_up_form").addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();
  const name = event.target.elements["name"].value;
  const email = event.target.elements["email"].value;
  const password = event.target.elements["password"].value;
  const signUpInfo = {username: name, email: email, password: password};
  fetch('https://city-snapshot.herokuapp.com/user/signup', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpInfo)
  })
  .then(response => response.json())
  .then(data => {
    alert('Account Created!')
    console.log('Success:', data)
    document.location.href = 'signin.html';
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}


