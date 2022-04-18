window.addEventListener("load", () => {
  const profile_space = document.querySelector(".profile_data");
  const appointment_space = document.querySelector(".appointments_data");
  const urlRoot = "http://localhost:8080/";
  const search = document.querySelector(".search");
  const findAllBtn = document.querySelector(".btn-findall");
  const allDentist_space = document.querySelector(".all-list");
  const newDentistBtn = document.querySelector(".btn-add");

  const actualLocation = () => {
    if (window.location.pathname === "/patient.html") {
      document.querySelector(".btn-patients").classList.add("active");
    } else if (window.location.pathname === "/dentist.html") {
      document.querySelector(".btn-dentists").classList.add("active");
    } else if (window.location.pathname === "/appointment.html") {
      document.querySelector(".btn-appointments").classList.add("active");
    }
  };
  actualLocation();

  document.querySelector(".btn-patients").addEventListener("click", () => {
    window.location.href = "patient.html";
  });
  document.querySelector(".btn-appointments").addEventListener("click", () => {
    window.location.href = "appointment.html";
  });

  findAllBtn.addEventListener("click", () => {
    allDentist_space.innerHTML = "";
    getAllDentist();
  });

  search.addEventListener("submit", (e) => {
    e.preventDefault();
    const search_value = document.querySelector(".search_value").value;

    if (isValidNumber(search_value) && search_value !== "") {
      getUserData(search_value);
    } else {
      alert("Invalid search");
    }
  });
  function isValidNumber(value) {
    let regex = new RegExp(/^\d+$/);
    return regex.test(value);
  }

  newDentistBtn.addEventListener("click", () => {
    renderNewDentistForm();
    // Get the patient data
  });
  const renderNewDentistForm = () => {
    profile_space.innerHTML = `
    <img src="./src/dentist.png" alt="dentist">
    <div class="user">
    <h3> <input type="text" name="name" placeholder="name"> <input type="text" name="lastName" placeholder="lastName"></h3>
    <h3> <input type="text" name="register" placeholder="register number"></h3>
    <div class="editButtons">
    <button class="save_new">Save New</button>
    <button class="save_cancel" id="X"> X </button>
    </div>
    </div>`;
    appointment_space.innerHTML = `
    <h3>Appointments</h3>`;
    document.querySelector(".save_new").addEventListener("click", () => {
      let newUser = {
        name: document.querySelector("input[name=name]").value,
        lastName: document.querySelector("input[name=lastName]").value,
        register: document.querySelector("input[name=register]").value,
      };
      console.log(newUser);
      postNewDentist(newUser);
    });
    document.querySelector(".save_cancel").addEventListener("click", () => {
      getUserData(JSON.parse(sessionStorage.getItem("user")).dentist_id);
    });
  };
  const renderUserData = (user) => {
    profile_space.innerHTML = `
    <img src="./src/dentist.png" alt="dentist" class="img-dentist">
    <div class="user">
    <h3> ${user.name} ${user.lastName} </h3>
    <p> <i>register: </i>${user.register} </p>
    <div class="dentis_buttons">
    <button class="edit_profile">Edit Profile</button>
    <button class="delete_dentist" id="X">Delete</button>
    </div>
    </div>`;

    const edit_profile = document.querySelector(".edit_profile");
    edit_profile.addEventListener("click", () => {
      renderEditUser();
    });

    const delete_dentist = document.querySelector(".delete_dentist");
    delete_dentist.addEventListener("click", () => {
      detectAppointment(user.dentist_id);
    });
  };
  const renderEditUser = () => {
    let usertemp = JSON.parse(sessionStorage.getItem("user"));
    profile_space.innerHTML = `
    <img src="./src/dentist.png" alt="dentist" class="img-dentist">
    <div class="user">
    <h3> <input type="text" name="name" value=${usertemp.name}> <input type="text" name="lastName" value=${usertemp.lastName}></h3>
    <h3> <input type="text" name="register" value=${usertemp.register}></h3>
    <div class="editButtons">
    <button class="save_profile">Save Changes</button>
    <button class="save_cancel" id="X"> X </button>
    </div>
    </div>`;

    document.querySelector("button.save_profile").addEventListener("click", () => {
      let newData = {
        name: document.querySelector("[name=name]").value,
        lastName: document.querySelector("[name=lastName]").value,
        register: document.querySelector("[name=register]").value,
      };
      console.log(newData);
      allDentist_space.innerHTML = "";
      updateUser(usertemp.dentist_id, newData);
    });
    document.querySelector("button.save_cancel").addEventListener("click", () => {
      getUserData(usertemp.dentist_id);
    });
  };

  /* const renderAppointments = (appointments) => {
    appointment_space.innerHTML = `
  <h3>Appointments</h3>
  <lu class= "appo_list"> </lu>`;

    appointments.forEach((appointment) => {
      const appo_list = document.querySelector(".appo_list");
      appo_list.innerHTML += `
    <li> ${new Date(appointment.date).toLocaleDateString()} - ${
        new Date(appointment.date).getHours() +
        ":" +
        new Date(appointment.date).getMinutes()
      } Dentist: ${appointment.dentist.name}
    </li>`;
    });
  }; */
  /*   const renderAllPatients = (patients) => {
    patients.forEach((patient) => {
      allDentist_space.innerHTML += `
    <li><button class="patient-btn" id=${patient.patient_id}>${patient.name} ${patient.lastName} -- DNI: ${patient.dni}</button></li>`;
    });
    document.querySelectorAll(".patient-btn").forEach((patient) => {
      patient.addEventListener("click", (e) => {
        getUserData(e.target.id);
      });
    });
  }; */

  const getUserData = (id) => {
    let settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    };
    fetch(urlRoot + "dentist/id=" + id, settings)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((user) => {
        sessionStorage.clear();
        sessionStorage.setItem("user", JSON.stringify(user));
        console.log(user);
        renderUserData(JSON.parse(sessionStorage.getItem("user")));
        getAppointment(id);
        console.log(sessionStorage.getItem("user"));
      });
  };
  //get users by email
  /* const getPatientByEmail = (email) => {
    let settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    };
    fetch(urlRoot + "patient/email=" + email, settings)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((user) => {
        sessionStorage.clear();
        sessionStorage.setItem("user", JSON.stringify(user));
        console.log(user);
        renderUserData(JSON.parse(sessionStorage.getItem("user")));
        renderAddressData(JSON.parse(sessionStorage.getItem("user")));
        getAppointment(user.patient_id);
        console.log(sessionStorage.getItem("user"));
      });
  }; */

  const getAppointment = (id) => {
    let settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    };
    fetch(urlRoot + "appointment/dentist=" + id, settings)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((appointments) => {
        sessionStorage.removeItem("appointment");
        sessionStorage.setItem("appointments", JSON.stringify(appointments));
        console.log(appointments);
        renderAppointmentsTable(appointments);
      });
  };

  const getAllDentist = () => {
    let settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    };
    fetch(urlRoot + "dentist/all", settings)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((dentists) => {
        dentists.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        console.log(dentists);
        renderTableAllDentist(dentists);
      });
  };

  const updateUser = (id, newData) => {
    let settings = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(newData),
    };
    fetch(urlRoot + "dentist/id=" + id, settings)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((user) => {
        sessionStorage.removeItem("user");
        sessionStorage.setItem("user", JSON.stringify(user));
        console.log(user);
        renderUserData(JSON.parse(sessionStorage.getItem("user")));
        getAppointment(user.dentist_id);
        console.log(sessionStorage.getItem("user"));
      });
  };
  const postNewDentist = (newData) => {
    let settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(newData),
    };
    fetch(urlRoot + "dentist/add", settings)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((user) => {
        sessionStorage.removeItem("user");
        sessionStorage.setItem("user", JSON.stringify(user));
        console.log(user);
        renderUserData(JSON.parse(sessionStorage.getItem("user")));
        getAppointment(user.dentist_id);
        console.log(sessionStorage.getItem("user"));
        getAllDentist();
      });
  };

  //render Appointments Table

  const renderAppointmentsTable = (apps) => {
    appointment_space.innerHTML = `
  <h3>Appointments</h3>
  <table class="appo_table appo_list">
  <tr>
    <th>Date</th> 
     <th>Hour</th>
    <th>Patient</th>
    <th>Price</th>
  
  </tr>
  </table>`;

    apps.forEach((appointment) => {
      const appo_table = document.querySelector(".appo_table");
      appo_table.innerHTML += `
    <tr>
    <td>${new Date(appointment.date).toLocaleDateString()}</td>
    <td>${new Date(appointment.date).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })}</td>
    <td>${appointment.patient.name}</td>
    <td>$${appointment.price == null ? "0" : appointment.price}</td>
   
    </tr>`;
    });
  };

  //render Table All dentist
  const renderTableAllDentist = (dentists) => {
    allDentist_space.innerHTML = `
  <table class="allPatients_table">
  <tr>
  <th></th>
    <th>Name</th> 
    <th>Last Name</th>
    <th>Register</th>
  </tr>
  </table>`;
    dentists.forEach((dentist) => {
      const allPatients_table = document.querySelector(".allPatients_table");
      allPatients_table.innerHTML += `
    <tr> 
   <td class="btn-td"> <button id=${dentist.dentist_id} class="patient-btn">✔</button></td>
    <td>${dentist.name}</td>
    <td>${dentist.lastName}</td>
    <td>${dentist.register}</td>
    </tr>`;
    });
    document.querySelectorAll(".patient-btn").forEach((dentist) => {
      dentist.addEventListener("click", (e) => {
        getUserData(e.target.id);
      });
    });
  };

  detectAppointment = (id) => {
    if (JSON.parse(sessionStorage.getItem("appointments")).length > 0) {
      confirm("This dentist has an appointment, do you want to delete it?")
        ? deleteAppointments(id)
        : console.log("Non deleted");
    } else {
      confirm("Delete dentist?") ? deleteDentist(id) : console.log("Non deleted");
    }
  };

  deleteDentist = (id) => {
    let settings = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    };
    fetch(urlRoot + "dentist/id=" + id, settings).then((response) => {
      if (response.ok) {
        alert("Dentist deleted");
        profile_space.innerHTML = "";
        appointment_space.innerHTML = "";
        getAllDentist();
      }
      throw new Error(response.statusText);
    });
  };
  const deleteAppointments = (id) => {
    let settings = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    };
    fetch(urlRoot + "appointment/dentist=" + id, settings).then((response) => {
      if (response.ok) {
        alert("Appointments deleted");
        sessionStorage.removeItem("appointments");
        deleteDentist(id);
      }
      throw new Error(response.statusText);
    });
  };
});
