window.addEventListener("load", () => {
  const profile_space = document.querySelector(".profile_data");
  const address_space = document.querySelector(".address_data");
  const appointment_space = document.querySelector(".appointments_data");
  const urlRoot = "http://localhost:8080/";
  const search = document.querySelector(".search");
  const findAllBtn = document.querySelector(".btn-findall");
  const allPatients_space = document.querySelector(".all-list");
  const newPatientBtn = document.querySelector(".btn-add");

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

  document.querySelector(".btn-dentists").addEventListener("click", () => {
    window.location.href = "dentist.html";
  });
  document.querySelector(".btn-appointments").addEventListener("click", () => {
    window.location.href = "appointment.html";
  });

  findAllBtn.addEventListener("click", () => {
    allPatients_space.innerHTML = "";
    getAllPatients();
  });

  search.addEventListener("submit", (e) => {
    e.preventDefault();
    const search_value = document.querySelector(".search_value").value;

    if (isEmailValid(search_value) && search_value !== "") {
      getPatientByEmail(search_value);
    } else if (isValidNumber(search_value) && search_value !== "") {
      getUserData(search_value);
    } else {
      alert("Invalid search");
    }
  });
  function isValidNumber(value) {
    let regex = new RegExp(/^\d+$/);
    return regex.test(value);
  }
  function isEmailValid(email) {
    let regex = new RegExp(
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
    );
    return regex.test(email);
  }

  newPatientBtn.addEventListener("click", () => {
    renderNewPatientForm();
    // Get the patient data
  });
  const renderNewPatientForm = () => {
    profile_space.innerHTML = `
    <img src="./src/perri.jpeg" alt="patient">
    <div class="user">
    <h3> <input type="text" name="name" placeholder="name"> <input type="text" name="lastName" placeholder="lastName"></h3>
    <h3> <input type="email" name="email" placeholder="email"></h3>
    <p> <input type="text" name="dni" placeholder="dni" ></p>
    <div class="editButtons">
    <button class="save_new">Save New</button>
    <button class="save_cancel" id="X"> X </button>
    </div>
    </div>`;
    address_space.innerHTML = `
    <h3>Address:</h3>
    <p><i>Street: </i><input type="text" name="street" placeholder="street" </p>
    <p><i>Number: </i><input type="text" name="door" placeholder="Number" </p>
    <p><i>City: </i><input type="text" name="city" placeholder="city" </p>
    <p><i>State: </i><input type="text" name="state" placeholder= "state"</p>`;
    appointment_space.innerHTML = `
    <h3>Appointments</h3>`;
    document.querySelector(".save_new").addEventListener("click", () => {
      let newUser = {
        name: document.querySelector("input[name=name]").value,
        lastName: document.querySelector("input[name=lastName]").value,
        email: document.querySelector("input[name=email]").value,
        dni: Number(document.querySelector("input[name=dni]").value),
        address: {
          street: document.querySelector("input[name=street]").value,
          door: Number(document.querySelector("input[name=door]").value),
          city: document.querySelector("input[name=city]").value,
          state: document.querySelector("input[name=state]").value,
        },
        dateInit: new Date(),
      };
      console.log(newUser);
      postNewPatient(newUser);
    });
    document.querySelector(".save_cancel").addEventListener("click", () => {
      getUserData(JSON.parse(sessionStorage.getItem("user")).patient_id);
    });
  };
  const renderUserData = (user) => {
    profile_space.innerHTML = `
    <img src="./src/perri.jpeg" alt="patient">
    <div class="user">
    <h3> ${user.name} ${user.lastName} </h3>
    <p> ${user.email} </p>
    <p> ${user.dni}</p>
    <div class="user-buttons">
    <button class="edit_profile">Edit Profile</button>
    <button class="delete_profile" id="X">Delete</button>
    </div>
    </div>`;

    const edit_profile = document.querySelector(".edit_profile");
    edit_profile.addEventListener("click", () => {
      renderEditUser();
    });

    const delete_profile = document.querySelector(".delete_profile");
    delete_profile.addEventListener("click", () => {
      detectAppointment(user.patient_id);
    });
  };
  const renderEditUser = () => {
    let usertemp = JSON.parse(sessionStorage.getItem("user"));
    profile_space.innerHTML = `
    <img src="./src/perri.jpeg" alt="patient">
    <div class="user">
    <h3> <input type="text" name="name" value=${usertemp.name}> <input type="text" name="lastName" value=${usertemp.lastName}></h3>
    <h3> <input type="email" name="email" value=${usertemp.email}></h3>
    <p> <input type="text" name="dni" value=${usertemp.dni} ></p>
    <div class="editButtons">
    <button class="save_profile">Save Changes</button>
    <button class="save_cancel" id="X"> X </button>
    </div>
    </div>`;
    address_space.innerHTML = `
    <h3>Address:</h3>
  <p><i>Street: </i><input type="text" name="street" value=${usertemp.address.street} </p>
    <p><i>Number: </i><input type="text" name="door" value=${usertemp.address.door} </p>
  <p><i>City: </i><input type="text" name="city" value=${usertemp.address.city} </p>
  <p><i>State: </i><input type="text" name="state" value=${usertemp.address.state} </p>`;

    document.querySelector("button.save_profile").addEventListener("click", () => {
      let newData = {
        patient_id: usertemp.patient_id,
        name: document.querySelector("[name=name]").value,
        lastName: document.querySelector("[name=lastName]").value,
        email: document.querySelector("[name=email]").value,
        dni: Number(document.querySelector("[name=dni]").value),
        address: {
          street: document.querySelector("[name=street]").value,
          door: Number(document.querySelector("[name=door]").value),
          city: document.querySelector("[name=city]").value,
          state: document.querySelector("[name=state]").value,
        },
        dateInit: usertemp.dateInit,
      };
      console.log(newData);
      allPatients_space.innerHTML = "";
      updateUser(usertemp.patient_id, newData);
    });
    document.querySelector("button.save_cancel").addEventListener("click", () => {
      getUserData(usertemp.patient_id);
    });
  };
  const renderAddressData = (user) => {
    address_space.innerHTML = `
    <h3>Address:</h3>
  <p><i>Street: </i>${user.address.street}</p>
    <p><i>Number: </i>${user.address.door}</p>
  <p><i>City: </i>${user.address.city}</p>
  <p><i>State: </i>${user.address.state}</p>`;
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
      allPatients_space.innerHTML += `
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
    fetch(urlRoot + "patient/id=" + id, settings)
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
        getAppointment(id);
        console.log(sessionStorage.getItem("user"));
      });
  };
  //get users by email
  const getPatientByEmail = (email) => {
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
  };

  const getAppointment = (id) => {
    let settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    };
    fetch(urlRoot + "appointment/patient=" + id, settings)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((appointments) => {
        appointments.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });
        sessionStorage.removeItem("appointments");
        console.log(appointments);
        console.log(appointments.length);
        sessionStorage.setItem("appointments", JSON.stringify(appointments));
        console.log(JSON.parse(sessionStorage.getItem("appointments")).length);
        renderAppointmentsTable(appointments);
      });
    //return the appointments
  };

  const getAllPatients = () => {
    let settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    };
    fetch(urlRoot + "patient/all", settings)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((patients) => {
        patients.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        console.log(patients);
        console.log(patients);
        renderTableAllPatients(patients);
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
    fetch(urlRoot + "patient/id=" + id, settings)
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
        renderAddressData(JSON.parse(sessionStorage.getItem("user")));
        getAppointment(user.patient_id);
        console.log(sessionStorage.getItem("user"));
      });
  };
  const postNewPatient = (newData) => {
    let settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(newData),
    };
    fetch(urlRoot + "patient/add", settings)
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
        renderAddressData(JSON.parse(sessionStorage.getItem("user")));
        getAppointment(user.patient_id);
        console.log(sessionStorage.getItem("user"));
        getAllPatients();
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
    <th>Dentist</th>
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
    <td>${appointment.dentist.name}</td>
    <td>$${appointment.price == null ? "0" : appointment.price}</td>
   
    </tr>`;
    });
  };

  const detectAppointment = (id) => {
    if (JSON.parse(sessionStorage.getItem("appointments")).length > 0) {
      if(confirm("This patient has appointments, are you sure you want to delete?")){
        deleteAppointments(id)
      }
    } else {
      confirm("Are you sure you want to delete?") && deletePatient(id);
        
    }
  };

  const deleteUser = (id) => {
    let settings = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    };
    fetch(urlRoot + "patient/id=" + id, settings).then((response) => {
      if (response.ok) {
        alert("User deleted");
        sessionStorage.removeItem("user");
        profile_space.innerHTML = "";
        address_space.innerHTML = "";
        appointment_space.innerHTML = "";
        getAllPatients();
      }
      throw new Error(response.statusText);
    });
  };

  //render Table All patients
  const renderTableAllPatients = (patients) => {
    allPatients_space.innerHTML = `
  <table class="allPatients_table">
  <tr>
  <th></th>
    <th>Name</th> 
    <th>Last Name</th>
    <th>DNI</th>
    <th>Email</th>
    <th>Address</th>
    <th>Date Init</th>
  </tr>
  </table>`;
    patients.forEach((patient) => {
      const allPatients_table = document.querySelector(".allPatients_table");
      allPatients_table.innerHTML += `
    <tr> 
   <td class="btn-td"> <button id=${
     patient.patient_id
   } class="patient-btn">✔</button></td>
    <td>${patient.name}</td>
    <td>${patient.lastName}</td>
    <td>${patient.dni}</td>
    <td>${patient.email}</td>
    <td>${patient.address.street} ${patient.address.door}</td>
    <td>${new Date(patient.dateInit).toLocaleDateString()}</td>
    </tr>`;
    });
    document.querySelectorAll(".patient-btn").forEach((patient) => {
      patient.addEventListener("click", (e) => {
        getUserData(e.target.id);
      });
    });
  };


  const deleteAppointments=(id)=>{
    let settings = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    };
    fetch(urlRoot + "appointment/patient=" + id, settings)
    .then((response) => {
      if (response.ok) {
        alert("Appointments deleted");
        sessionStorage.removeItem("appointments");
        deleteUser(id);
      }
      throw new Error(response.statusText);
    });
  }
});
