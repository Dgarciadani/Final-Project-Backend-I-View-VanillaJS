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
    });

    signup.addEventListener("click", () => {
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
        <button class="logbton" id="login">SignUp</button>
    
        </div>`;
    });
  };
  renderLogInInputs();
});
