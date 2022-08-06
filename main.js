let gorevListesi = [];

if(localStorage.getItem("gorevListesi") !== null) {
  gorevListesi = JSON.parse(localStorage.getItem("gorevListesi"));
}

let editId;
let isEditTask = false;

const taskInput = document.querySelector("#txtTaskName"); //Kullanıcının ekleyeceği yeni task
const btnRemoveTask = document.querySelector("#btnRemoveTask");
const filters = document.querySelectorAll(".filters span");

displayTasks(document.querySelector("span.active").id);

function displayTasks(filter) {
  let ul = document.getElementById("task-list");
  ul.innerHTML = "";
  
  for(let gorev of gorevListesi) {
    let completed = gorev.durum == "completed" ? "checked" : " ";
    
    if(filter == gorev.durum || filter == "all") {
    
       //Ekrana ekleyeceğimiz li template'i
       let li = ` 
          <li class="task list-group-item">
            <div class="form-check">
              <input type="checkbox" onclick="updateStatus(this)" class='form-check-input' ${completed} id='${gorev.id}'>
              <label for="${gorev.id}" class='form-check-label ${completed}'>${gorev.gorevAdi}</label>
            </div>
            <div class="dropdown">
              <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown">
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><a onclick="deleteTask(${gorev.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash-can"></i>Sil</a></li>
                <li><a onclick='editTask(${gorev.id}, "${gorev.gorevAdi}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i>Düzenle</a></li>
              </ul>
            </div>
          </li>`;
      
          ul.insertAdjacentHTML("beforeEnd", li); //Ul'nin içinde en sona li değişkenini ekle
      }
  }  
};

let btnEkle = document.querySelector("#btnAddNewTask");
let btnTemizle = document.querySelector("#btnRemoveTask");

btnEkle.addEventListener("click", newTask);
taskInput.addEventListener("keypress", function(event) {
  if(event.key == "Enter") {
    btnEkle.click();
  }
})
btnTemizle.addEventListener("click", deleteTask);

for(let span of filters){
  span.addEventListener("click", function() {
    document.querySelector("span.active").classList.remove("active");
    span.classList.add("active");
    displayTasks(span.id);
  })
}

// Yeni task ekleme fonksiyonu
function newTask(event) {
  if(taskInput.value.length == 0) {
    console.log("Boş bırakamazsınız.")
  } else {
    if (!isEditTask) {
      // ekleme
      gorevListesi.push({"id": gorevListesi.length + 1, "gorevAdi": taskInput.value, "durum": "pending"});      
    } else {
      // güncelleme
      for(let gorev of gorevListesi) {
        if(gorev.id == editId) {
          gorev.gorevAdi = taskInput.value;
        }
        isEditTask = false;
      }
    }
    taskInput.value = "";
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
  }
  event.preventDefault();
}

// Task silme fonksiyonu
function deleteTask(id) {
  let deletedId;
  for(let index in gorevListesi) {
    if(gorevListesi[index].id == id) {
      deletedId = index;
    }
  }
  
  gorevListesi.splice(deletedId, 1);
  displayTasks(document.querySelector("span.active").id);
  localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
}

// Task güncelleme fonksiyonu
function editTask(taskId, taskName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = taskName;
  taskInput.focus();
  taskInput.classList.add("active");
}

btnRemoveTask.addEventListener("click", function() {
  gorevListesi.splice(0, gorevListesi.length);
  localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
  displayTasks();
});

function updateStatus(selectedTask) {
  let label = selectedTask.nextElementSibling;
  let durum;
  
  if(selectedTask.checked){
    label.classList.add("checked");
    durum = "completed";
  } else {
    label.classList.remove("checked");
    durum = "pending";
  }
  for(gorev of gorevListesi) {
    if(gorev.id == selectedTask.id) {
      gorev.durum = durum;
    }
  }
  
  displayTasks(document.querySelector("span.active").id);
  localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
}