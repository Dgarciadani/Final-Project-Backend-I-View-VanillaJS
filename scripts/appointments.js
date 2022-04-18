window.addEventListener("load", () => {
  const patient_space = document.querySelector(".patient-data");
  const dentist_space = document.querySelector(".dentist-data");
  const appointment_space = document.querySelector(".app-data");
  const urlRoot = "http://localhost:8080/";
  const search = document.querySelector(".search");
  const findAllBtn = document.querySelector(".btn-findall");
  const allAppointments_space = document.querySelector(".all-list");
  const newAppointmentBtn = document.querySelector(".btn-add");
  const hours = [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ];
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
  document.querySelector(".btn-dentists").addEventListener("click", () => {
    window.location.href = "dentist.html";
  });

  newAppointmentBtn.addEventListener("click", () => {
    getAllDentists();
    getAllPatients();
    setTimeout(() => {
      renderNewPatientForm();
    }, 100);
  });

  findAllBtn.addEventListener("click", () => {
    getAllAppointments();
  });
  search.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchValue = document.querySelector(".search_input").value;
    if (isValidNumber(Number(searchValue)) && searchValue !== "") {
      getAppointmentById(searchValue);
    } else {
      alert("Please enter a valid number");
    }
  });

  function isValidNumber(value) {
    let regex = new RegExp(/^\d+$/);
    return regex.test(value);
  }
  const renderPatientData = (appointment) => {
    patient_space.innerHTML = `
<h4>Patient Data</h4>
<p><i> Name:</i> ${appointment.patient.name}</p>
<p><i> LastName:</i> ${appointment.patient.lastName}</p>
<p><i>Email:</i> ${appointment.patient.email}</p>
<p><i>Address:</i> ${appointment.patient.address.street} ${appointment.patient.address.door}</p>
`;
  };
  const renderDentisData = (appointment) => {
    dentist_space.innerHTML = `
<h4>Dentis Data</h4>
<p><i> Name:</i> ${appointment.dentist.name}</p>
<p><i> LastName:</i> ${appointment.dentist.lastName}</p>
<p><i>Register:</i> ${appointment.dentist.register}</p>
`;
  };

  const renderAppointmentData = (appointment) => {
    appointment_space.innerHTML = `
    <h4>Appointment data</h4>
    <p><i>Date:</i> ${new Date(appointment.date).toLocaleDateString()}</p>
    <p><i>Time:</i> ${new Date(appointment.date).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })}</p>
    <p><i>Price:</i>$${appointment.price == null ? "0" : appointment.price}</p>
    <div clas="btn-group">
    <button class="btn-edit">Edit</button>
    <button class="btn-delete" id="X">Delete</button>
    </div>
    `;
    const editBtn = document.querySelector(".btn-edit");
    editBtn.addEventListener("click", () => {
      getAllDentists();
      getAllPatients();
      setTimeout(() => {
        renderEditForm();
      }, 100);
    });

    const deleteBtn = document.querySelector(".btn-delete");
    deleteBtn.addEventListener("click", () => {
      confirm("Are you sure you want to delete this appointment?")
        ? deleteAppointment(appointment.appointment_id)
        : alert("Canceled");
    });
  };

  const renderEditForm = () => {
    let apptemp = JSON.parse(sessionStorage.getItem("appointment"));
    console.log();
    console.log(apptemp);
    dentist_space.innerHTML = `
    <h4>Select Dentist</h4>
    <select class="dentist-select">
    ${JSON.parse(sessionStorage.getItem("dentists")).map((dentis) => {
      if (dentis.dentist_id === apptemp.dentist.dentist_id) {
        return `<option value="${dentis.dentist_id}" selected>${dentis.name} ${dentis.lastName}</option>`;
      } else {
        return `<option value="${dentis.dentist_id}" >${dentis.name} ${dentis.lastName}</option>`;
      }
    })}
    </select>
`;

    patient_space.innerHTML = `
    <h4>Patient Data</h4>
    <select class="patient-select">
    ${JSON.parse(sessionStorage.getItem("patients")).map((patient) => {
      if (patient.patient_id === apptemp.patient.patient_id) {
        return `<option value="${patient.patient_id}" selected>${patient.name} ${patient.lastName}</option>`;
      } else {
        return `<option value=${patient.patient_id}>${patient.name} ${patient.lastName}</option>`;
      }
    })}
    </select>`;

    appointment_space.innerHTML = `
    <h4>Appointment data</h4>
    <form class="appointment-form">
    <input type="date" name="date" id="date" required value=${
      new Date(apptemp.date).toISOString().split("T")[0]
    }>
    <input type="time" name="time" id="time" required  list="open-hours" value=${new Date(
      apptemp.date
    ).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })}>

    <datalist id="open-hours">
    ${hours.map((hora) => {
      return `<option value="${hora}">`;
    })}
    
</datalist>
    <input type="number" name="price" id="price" step=".01" required value=${
      apptemp.price
    }>
    <div class="btn-group">
    <button type="submit" class="btn-submit">Save Appointment</button>
<button class="btn-cancel" id="X">X</button>
</div>
`;
    const submitBtn = document.querySelector(".btn-submit");
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      let newAppointment = {
        //SELECT THE INPUT DATE AND TIME TO DO A NEW DATE OBJECT
        date: new Date(
          document.querySelector("#date").value +
            " " +
            document.querySelector("#time").value
        ),
        patient: { patient_id: document.querySelector(".patient-select").value },
        dentist: { dentist_id: document.querySelector(".dentist-select").value },
        price: document.querySelector("#price").value,
      };
      putAppointment(apptemp.appointment_id, newAppointment);
    });

    const cancelBtn = document.querySelector(".btn-cancel");
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      getAppointmentById(apptemp.appointment_id);
    });
  };

  const renderNewPatientForm = () => {
    dentist_space.innerHTML = `
    <h4>Select Dentist</h4>
    <select class="dentist-select">
    ${JSON.parse(sessionStorage.getItem("dentists")).map((dentis) => {
      return `<option value=${dentis.dentist_id}>${dentis.name} ${dentis.lastName}</option>`;
    })}
    </select>
`;

    patient_space.innerHTML = `
    <h4>Patient Data</h4>
    <select class="patient-select">
    ${JSON.parse(sessionStorage.getItem("patients")).map((patient) => {
      return `<option value=${patient.patient_id}>${patient.name} ${patient.lastName}</option>`;
    })}
    </select>`;

    document.querySelector(".dentist-select").addEventListener("change", (e) => {
      console.log(e.target.value);
    });
    document.querySelector(".patient-select").addEventListener("change", (e) => {
      console.log(e.target.value);
    });
    appointment_space.innerHTML = `
        <h4>Appointment data</h4>
        <form class="appointment-form">
        <input type="date" name="date" id="date" required value=${
          new Date().toISOString().split("T")[0]
        }>
        <input type="time" name="time" id="time" required min="10:00" max="18:00" list="open-hours-quarter">
        <input type="number" name="price" id="price" step=".01" required >
        <datalist id="open-hours-quarter">
        ${hours.map((hora) => {
          return `<option value="${hora}">`;
        })}
        
    </datalist>
     
        <div class="btn-group">
        <button type="submit" class="btn-submit">Add Appointment</button>
        <button class="btn-cancel" id="X">X</button>
</div>
`;
    document.querySelector(".appointment-form").addEventListener("submit", (e) => {
      e.preventDefault();
      newAppointment = {
        patient: {
          patient_id: Number(document.querySelector(".patient-select").value),
        },
        dentist: {
          dentist_id: Number(document.querySelector(".dentist-select").value),
        },
        date: new Date(
          document.querySelector("#date").value +
            " " +
            document.querySelector("#time").value
        ),
        price: Number(document.querySelector("#price").value),
      };
      console.log(newAppointment);
      PostNewAppointment(newAppointment);
    });
    const cancelBtn = document.querySelector(".btn-cancel");
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      appointment_space.innerHTML = "";
      dentist_space.innerHTML = "";
      patient_space.innerHTML = "";
    });
  };
  const getAllDentists = () => {
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
        console.log(dentists);
        sessionStorage.setItem("dentists", JSON.stringify(dentists));
      });
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
        console.log(patients);
        sessionStorage.setItem("patients", JSON.stringify(patients));
      });
  };

  const getAppointmentById = (id) => {
    let settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    };
    fetch(urlRoot + "appointment/id=" + id, settings)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((appointment) => {
        sessionStorage.clear();
        sessionStorage.setItem("appointment", JSON.stringify(appointment));

        renderPatientData(appointment);
        renderDentisData(appointment);
        renderAppointmentData(appointment);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const renderAllAppointments = (appointments) => {
    //render table for all appointments
    allAppointments_space.innerHTML = `<table class="appo_table appo_list">
<tr>
<th></th>
<th>Patient</th>
<th>Dentist</th>
<th>Date</th>
<th>Time</th>
<th>Price</th>
<tr>
</table>`;
    appointments.forEach((appointment) => {
      const appo_table = document.querySelector(".appo_table");
      appo_table.innerHTML += `<tr>
<td><button class="patient-btn" id="${appointment.appointment_id}">✔</button></td>
<td>${appointment.patient.name} ${appointment.patient.lastName}</td>
<td>${appointment.dentist.name} ${appointment.dentist.lastName}</td>
<td>${new Date(appointment.date).toLocaleDateString()}</td>
<td>${new Date(appointment.date).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })}</td>
<td>$${appointment.price == null ? "0" : appointment.price}</td>
</tr>`;
    });
    document.querySelectorAll(".patient-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = e.target.id;
        console.log(e);
        getAppointmentById(id);
      });
    });
  };

  const getAllAppointments = () => {
    let settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    };
    fetch(urlRoot + "appointment/all", settings)
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

        console.log(appointments);
        renderAllAppointments(appointments);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const PostNewAppointment = (newAppointment) => {
    let settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(newAppointment),
    };
    fetch(urlRoot + "appointment/add", settings)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((appointment) => {
        sessionStorage.clear();
        sessionStorage.setItem("appointment", JSON.stringify(appointment));
        getAppointmentById(appointment.appointment_id);

        console.log(appointment);
        getAllAppointments();
      });
  };
  const putAppointment = (id, newappointment) => {
    let settings = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(newappointment),
    };
    fetch(urlRoot + "appointment/id=" + id, settings)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((appointment) => {
        sessionStorage.clear();
        sessionStorage.setItem("appointment", JSON.stringify(appointment));
        getAppointmentById(appointment.appointment_id);
        console.log(appointment);
        getAllAppointments();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  deleteAppointment = (id) => {
    let settings = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    };
    fetch(urlRoot + "appointment/id=" + id, settings).then((response) => {
      if (response.ok) {
        dentist_space.innerHTML = "";
        patient_space.innerHTML = "";
        appointment_space.innerHTML = "";
        getAllAppointments();
        alert("Appointment deleted successfully");
      }
      throw new Error(response.statusText);
    });
  };
});
