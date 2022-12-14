const apiPath = 'http://localhost:3000';
const input = document.querySelector('.input input');
const btn_add = document.querySelector('.btn_add');
const list = document.querySelector('.list');
const list_footer = document.querySelector('.list_footer');
const tab = document.querySelector('.tab');
let currentTab = '全部';
let todoDataList = [];
let stateData = [];
btn_add.addEventListener('click', (e) => {
  e.preventDefault();
  enterItem();
});
function enterItem() {
  const val = input.value;
  input.value = '';
  addItem(val);
}
input.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    enterItem();
  }
});

list.addEventListener('click', (e) => {
  // 刪除項目
  if (e.target.classList.contains('delete')) {
    e.preventDefault();
    removeItem(e.target.dataset.id);
  }

  // 改變狀態
  if (e.target.nodeName === 'INPUT') {
    updateItem(e.target.id, e.target.checked);
  }
});
tab.addEventListener('click', (e) => {
  const tabText = e.target.textContent;
  let stateText = '待完成';
  switch (tabText) {
    case '待完成':
      currentTab = '待完成';
      stateData = filterData();
      break;
    case '已完成':
      stateText = '已完成';
      currentTab = '已完成';
      stateData = filterData();
      break;
    default:
      currentTab = '全部';
      stateData = filterData();
      break;
  }
  renderTabItem(currentTab);
  renderFooter(stateData.length, stateText);
  renderTodo(stateData);
});

// tab 狀態
const tabListData = [
  {
    name: '全部',
    isActive: true,
  },
  {
    name: '待完成',
    isActive: false,
  },
  {
    name: '已完成',
    isActive: false,
  },
];
function renderTabItem(currentTab) {
  let str = '';
  tabListData.forEach((item) => {
    str += `
    <li class="${currentTab === item.name ? 'active' : null}">${item.name}</li>
    `;
  });
  tab.innerHTML = str;
}

function getDataList() {
  axios
    .get(`${apiPath}/todos`)
    .then((res) => {
      todoDataList = res.data;
      // 使用篩選過的資料，確保 tab 在各個狀態下，更改todo狀態，不會跳回 '全部' 內容
      renderTodo(filterData());
      renderFooter(filterData().length);
    })
    .catch((err) => {
      console.log(err);
    });
}

// 篩選完成/已完成狀態
function filterData(data) {
  return todoDataList.filter((item) => {
    if (currentTab === '已完成') {
      return item.isCompleted === true;
    } else if (currentTab === '待完成') {
      return item.isCompleted === false;
    } else if (currentTab == '全部') {
      return item;
    }
  });
}
function renderFooter(data, state = '待完成') {
  let str = `
    <p>${data} 個${state}項目</p>
    <a href="#" class="clear-btn">清除已完成項目</a>
  `;
  list_footer.innerHTML = str;
  const clearBtn = document.querySelector('.clear-btn');

  // 清除已完成項目
  clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const comfirmDialog = confirm('確認全部清除?');
    if (comfirmDialog) {
      filterData().forEach((item) => {
        removeItem(item.id);
      });
    }
  });
}
// 顯示todo
function renderTodo(data) {
  console.log('renderTodo', data.length);
  let str = '';
  data.forEach((item) => {
    str += `
     <li>
      <label class="checkbox" for="${item.id}" data-id="${item.id}">
        <input type="checkbox" id="${item.id}" ${
      item.isCompleted ? 'checked' : ''
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
