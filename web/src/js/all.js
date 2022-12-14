const apiPath = "http://localhost:3000";
const input = document.querySelector(".input input");
const btn_add = document.querySelector(".btn_add");
const list = document.querySelector(".list");
const list_footer = document.querySelector(".list_footer");
const tab = document.querySelector(".tab");

let todoDataList = [];
btn_add.addEventListener("click", (e) => {
  e.preventDefault();
  enterItem();
});
function enterItem() {
  const val = input.value;
  input.value = "";
  addItem(val);
}
input.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    enterItem();
  }
});
list.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("delete")) {
    removeItem(e.target.dataset.id);
  }
  if (e.target.nodeName === "INPUT") {
    updateItem(e.target.id, e.target.checked);
  }
});
tab.addEventListener("click", (e) => {
  let stateData = [];
  const tabText = e.target.textContent;
  // console.log(e.target.classList.add("active"));
  let stateText = "待完成";
  switch (tabText) {
    case "全部":
      stateData = todoDataList;
      e.target.classList.add("active");
      break;
    case "待完成":
      stateData = filterDataState(false);
      break;
    case "已完成":
      stateData = filterDataState(true);
      stateText = "已完成";
      break;
  }
  renderTodo(stateData);
  renderFooter(stateData.length, stateText);
});
function getDataList() {
  axios
    .get(`${apiPath}/todos`)
    .then((res) => {
      todoDataList = res.data;
      renderTodo(todoDataList);
      filterDataState();
      renderFooter(filterDataState().length);
    })
    .catch((err) => {
      console.log(err);
    });
}

// 篩選完成/已完成狀態
function filterDataState(isCompleted = false) {
  return todoDataList.filter((item) => {
    return item.isCompleted === isCompleted;
  });
}
function renderFooter(data, state = "待完成") {
  let str = `
    <p>${data} 個${state}項目</p>
    <a href="#" class="clear-btn">清除已完成項目</a>
  `;
  list_footer.innerHTML = str;
  const clearBtn = document.querySelector(".clear-btn");

  // 清除已完成項目
  clearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    filterDataState(true).forEach((item) => {
      removeItem(item.id);
    });
  });
}
// 顯示todo
function renderTodo(data) {
  let str = "";
  data.forEach((item) => {
    str += `
     <li>
      <label class="checkbox" for="${item.id}" data-id="${item.id}">
        <input type="checkbox" id="${item.id}" ${
      item.isCompleted ? "checked" : ""
    }/>
        <span>${item.content}</span>
      </label>
      <a href="#" class="delete" data-id="${item.id}"></a>
    </li>
    `;
  });
  list.innerHTML = str;
}
function addItem(content) {
  axios
    .post(`${apiPath}/todos`, {
      content,
      isCompleted: false,
    })
    .then((res) => {
      console.log(res);
      getDataList();
    })
    .catch((err) => {
      console.log(err);
    });
}
function updateItem(id, state) {
  console.log(id, state);
  axios
    .patch(`${apiPath}/todos/${id}`, {
      isCompleted: state,
    })
    .then((res) => {
      console.log(res);
      getDataList();
    })
    .catch((err) => {
      console.log(err);
    });
}
function removeItem(id) {
  axios
    .delete(`${apiPath}/todos/${id}`)
    .then((res) => {
      console.log(res);
      getDataList();
    })
    .catch((err) => {
      console.log(err);
    });
}
function init() {
  getDataList();
}
init();
// ;
