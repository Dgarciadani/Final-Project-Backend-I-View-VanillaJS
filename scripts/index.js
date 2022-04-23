window.addEventListener("load", () => {
  const body = document.querySelector("body");
  const main = document.querySelector("main");
  const inputs_area = document.querySelector(".inputs");
  const urlRoot = "http://localhost:8080/";

  const renderLogInInputs = () => {
    inputs_area.innerHTML = `

        <input type="text" placeholder="Username" id="username" >
        <input type="password" placeholder="Password" id="password">
  
    <div class="buttonsLogIng">
    <div class= "hrefs">
    <a href="#" class="button" id="Register">Register</a>
    <a href="#" class="button" id="signup">Forgot Pass?</a>
    </div>
    <button class="logbton" id="login">Login</button>
    </div>
    `;
    const usernamespace = document.querySelector("#username");
    const login = document.querySelector("#login");
    const signup = document.querySelector("#Register");

    login.addEventListener("click", () => {
      logInPost();
    });

    signup.addEventListener("click", () => {
      renderNewUserForm();
    });
  };
  const renderNewUserForm = () => {
    inputs_area.innerHTML = `
  <input type="email" placeholder="Email" id="email" autocomplete="off"
  >
  <input type="text" placeholder="firstname" id="firstname">
  <input type="text" placeholder="Username" id="username" autocomplete="off"
  >
    <input type="password" placeholder="Password" id="password" autocomplete="off"
    >
    <input type="password" placeholder="Confirm Password" id="confirm_password">
    <div>  
    <button class="logbton" id="login">Log In</button>
    <button class="logbton" id="signup">SignUp</button>

    </div>`;
    const email = document.querySelector("#email");
    const firstname = document.querySelector("#firstname");
    const username = document.querySelector("#username");
    const password = document.querySelector("#password");
    const confirm_password = document.querySelector("#confirm_password");

    const login = document.querySelector("#login");
    const signup = document.querySelector("#signup");

    login.addEventListener("click", () => {
      renderLogInInputs();
    });

    signup.addEventListener("click", (e) => {
      e.preventDefault();

      const ifValid = () => {
        function isEmailValid(email) {
          let regex = new RegExp(
            "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
          );
          regex.test(email) ? true : alert("Invalid Email");
          return regex.test(email);
        }
        function isNameValid(name) {
          let regex = new RegExp("^[a-zA-Z]+$");
          regex.test(name) ? true : alert("Name is not valid");
          return regex.test(name);
        }
        function isSamePassword(password, confirm_password) {
          password === confirm_password ? true : alert("Passwords do not match");
          return password === confirm_password;
        }
        return (
          isEmailValid(email.value) &&
          isSamePassword(password.value, confirm_password.value) &&
          isNameValid(firstname.value)
        );
      };
      if (ifValid()) {
        const newUser = {
          email: email.value,
          name: firstname.value,
          username: username.value,
          password: password.value,
        };
        signUpPost(newUser);
      }
    });
  };

  const signUpPost = (newUser) => {
    let setting = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    };
    fetch(urlRoot + "auth/signup", setting)
      .then((response) => {
        if (response.status === 200) {
          alert("User created successfully");
          return response;
        } else if (response.status === 401) {
          alert("User already exists");
        }
      })
      .then((data) => {
          renderLogInInputs();
      });
  };

  const logInPost = () => {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    var raw = JSON.stringify({
      username: username,
      password: password,
    });

    var requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
    };

    fetch(urlRoot + "auth/authenticate", requestOptions)
      //then the response contain the token jwt
      .then((response) => response.json())
      .then((data) => {
        if (data.jwt) {
          localStorage.setItem("jwt", data.jwt);
          console.log(data.jwt);
          alert("You are logged in");
          window.location.href = "./appointment.html";
        } else {
          alert("Wrong username or password");
        }
      });
  };

  renderLogInInputs();
});
