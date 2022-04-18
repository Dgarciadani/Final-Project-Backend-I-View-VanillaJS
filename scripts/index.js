window.addEventListener("load", () => {
  const body = document.querySelector("body");
  const main = document.querySelector("main");
  const inputs_area = document.querySelector(".inputs");

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
    const Register = document.querySelector("#Register");

    login.addEventListener("click", () => {
      /* const username = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;
 */
     /*  const user = {
        username: username,
        password: password,
      }; */
      /* fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((res) => res.json())
            .then((data) => {
            if (data.message === "User created") {
                alert("User created");
            } else {
                alert("User already exists");
            }
            }); */

      window.location.href = "./patient.html";
    });
  };

  renderLogInInputs();
});
