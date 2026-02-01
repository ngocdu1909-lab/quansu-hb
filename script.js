const firebaseConfig = {
    apiKey: "AIzaSyDnt5qvBITU0uHQYHKJ0RRKFuIXTgerC5s",
    authDomain: "quanlydonvi-e4cb8.firebaseapp.com",
    databaseURL: "https://quanlydonvi-e4cb8-default-rtdb.firebaseio.com",
    projectId: "quanlydonvi-e4cb8",
    storageBucket: "quanlydonvi-e4cb8.appspot.com",
    messagingSenderId: "798769648836",
    appId: "1:798769648836:web:fe374f19aa0c768869e591"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

database.ref('tasks').on('value', (snapshot) => {
    const data = snapshot.val();
    let uiList = document.getElementById("taskList");
    uiList.innerHTML = ""; 
    if (data) {
        Object.keys(data).forEach((key) => {
            let item = data[key];
            let li = document.createElement("li");
            li.innerHTML = `
                <div>
                    <strong>📌 ${item.name}</strong><br>
                    <small style="color: #bdc3c7;">⏰ ${item.time.replace("T", " ")}</small>
                </div>
                <button onclick="deleteTask('${key}')" class="btn-delete">Xóa</button>
            `;
            uiList.appendChild(li);
        });
    }
});

function addTask() {
    let name = document.getElementById("taskInput").value;
    let time = document.getElementById("timeInput").value;
    if (!name || !time) return alert("Báo cáo Công chúa, vui lòng nhập đầy đủ nội dung!");
    database.ref('tasks').push({ name, time });
    document.getElementById("taskInput").value = "";
    document.getElementById("timeInput").value = "";
}

function deleteTask(key) {
    let password = prompt("Nhập Mật mã chỉ huy để xóa nhiệm vụ:");
    if (password === "HongBang2026") {
        database.ref('tasks/' + key).remove();
    } else {
        alert("Mật mã không đúng! Quyền xóa bị từ chối.");
    }
}