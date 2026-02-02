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
let isAuthorized = false;

// Yêu cầu quyền thông báo khi mở trang
if ("Notification" in window) { Notification.requestPermission(); }

database.ref('tasks').on('value', (snapshot) => {
    const data = snapshot.val();
    let uiList = document.getElementById("taskList");
    uiList.innerHTML = ""; 
    if (data) {
        Object.keys(data).forEach((key) => {
            let item = data[key];
            let isDoing = item.status === "doing";
            let li = document.createElement("li");
            if(isDoing) li.className = "task-doing";
            li.innerHTML = `
                <div>
                    <strong>📌 ${item.name}</strong> ${isDoing ? '<span style="color:#3498db">[ĐANG LÀM]</span>' : ''}<br>
                    <small style="color: #bdc3c7;">⏰ ${item.time.replace("T", " ")}</small>
                </div>
                <div>
                    <button onclick="markDoing('${key}')" class="btn-doing">${isDoing ? 'Đang chạy...' : 'Đang làm'}</button>
                    <button onclick="deleteTask('${key}')" class="btn-delete">Xóa</button>
                </div>`;
            uiList.appendChild(li);
        });
    }
});

function addTask() {
    let name = document.getElementById("taskInput").value;
    let time = document.getElementById("timeInput").value;
    if (!name || !time) return alert("Vui lòng nhập đủ thông tin!");
    database.ref('tasks').push({ name, time, status: "pending" });
    document.getElementById("taskInput").value = "";
    document.getElementById("timeInput").value = "";
}

function markDoing(key) { database.ref('tasks/' + key).update({ status: "doing" }); }

function deleteTask(key) {
    if (!isAuthorized) {
        let password = prompt("Nhập Mật mã chỉ huy:");
        if (password === "HongBang2026") { isAuthorized = true; database.ref('tasks/' + key).remove(); }
        else { alert("Sai mật mã!"); }
    } else {
        if (confirm("Xác nhận xóa nhiệm vụ?")) { database.ref('tasks/' + key).remove(); }
    }
}

// Kiểm tra deadline mỗi phút, bỏ qua nhiệm vụ "Đang làm"
setInterval(() => {
    database.ref('tasks').once('value', (snapshot) => {
        const data = snapshot.val();
        const now = new Date().getTime();
        if (data) {
            Object.keys(data).forEach((key) => {
                const task = data[key];
                const taskTime = new Date(task.time).getTime();
                if (task.status !== "doing" && taskTime > now && taskTime - now < 300000) {
                    new Notification("QUÂN SỰ HỒNG BÀNG", { body: "Nhiệm vụ: " + task.name + " sắp đến hạn!", icon: "logo.png" });
                }
            });
        }
    });
}, 60000);