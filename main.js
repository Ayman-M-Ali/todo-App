const svgThemeElement = document.querySelector('.theme-converter');
const header = document.getElementsByClassName('app__header-img')[0];

// Toggle light and dark mode && Change SVG image
svgThemeElement.addEventListener('click', () => {
  document.documentElement.classList.toggle('toggle__theme');

  if (document.querySelector('.toggle__theme')) {
    svgThemeElement.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path fill="#FFF" fill-rule="evenodd" d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z"/></svg>`;
  } else {
    svgThemeElement.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path fill="#FFF" fill-rule="evenodd" d="M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c2.996 0 5.7-1.255 7.613-3.268C23.22 22.572 18.51 26 13 26 5.82 26 0 20.18 0 13S5.82 0 13 0z"/></svg>`;
  }

  // Toggle light and dark mode && Change background image
  if (document.querySelector('.toggle__theme') && (window.innerWidth > 375)) {
    header.style.backgroundImage = "url('./images/bg-desktop-dark.jpg')";
  } else if (!document.querySelector('.toggle__theme') && (window.innerWidth > 375)) {
    header.style.backgroundImage = "url('./images/bg-desktop-light.jpg')";
  } else if (document.querySelector('.toggle__theme') && (window.innerWidth < 375)) {
    header.style.backgroundImage = "url('./images/bg-mobile-dark.jpg')";
  } else if (!document.querySelector('.toggle__theme') && (window.innerWidth < 375)) {
    header.style.backgroundImage = "url('./images/bg-mobile-light.jpg')";
  }
});
// ==============================================
// Validate Form && Add task Dynamically
const svgAddTask = document.querySelector('.app__add-svg');
const inputNewTask = document.querySelector('.app__new-input');
const tasksElements = document.querySelector('.tasks');

const unOrderList = document.createElement('ul');
unOrderList.className = 'todo__list';
tasksElements.appendChild(unOrderList);

// Count the Number of Items
function countItem() {
  const todos = unOrderList.children;
  const countItems = todos.length;

  const itemCountSpan = document.querySelector('#itemCountSpan');
  itemCountSpan.innerHTML = countItems;
}
// ==============================================

const addItem = () => {
  const allTasks = [];
  const generateTaskItem = () => `<li class='tasks__item' draggable="true" data-name=${inputNewTask.value}>
      <input id="checkboxBtn" type="checkbox" name="task"/>
      <label for="checkboxBtn">${inputNewTask.value}</label>
      <svg class="btn__delete" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path class="btn__delete-hover" fill="#9394a5" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>
      </li>`;

  allTasks.push(generateTaskItem);

  const skillItemsString = allTasks
    .map(() => generateTaskItem())
    .join('');

  unOrderList.insertAdjacentHTML('beforeend', skillItemsString);

  inputNewTask.value = '';
  inputNewTask.focus();
  countItem();
};

svgAddTask.addEventListener('click', (event) => {
  if (inputNewTask.value.length <= 0) {
    event.preventDefault();
  } else {
    addItem();
  }
});

inputNewTask.addEventListener('keydown', (e) => {
  e.key === 'Enter' && addItem();
});
// ==============================================
// Mark To-dos as Complete
tasksElements.addEventListener('click', (event) => {
  const checkboxBtnTask = event.target.closest('input[type="checkbox"]');
  const svgDeleteTask = event.target.closest('.btn__delete');
  const tasksItem = event.target.closest('.tasks__item');

  if (checkboxBtnTask) {
    checkboxBtnTask.classList.toggle('inputRadioTask');
  }

  // Delete todos from the list
  if (svgDeleteTask) {
    tasksItem.remove();
    countItem();
  }
  inputNewTask.value = '';
  inputNewTask.focus();
});
// ==============================================
// Filter by all/active/complete todos
const filterButtons = document.querySelectorAll('.app__footer-button');

function filterTodo() {
  document.querySelector('.app__footer--isActive').classList.remove('app__footer--isActive');
  this.classList.add('app__footer--isActive');
  unOrderList.className = `todo__list ${this.dataset.type}`;

  const todos = unOrderList.children;
  const completedTasks = Array.from(todos).some((task) => task.querySelector('input[type="checkbox"]').checked);

  for (let i = 0; i < todos.length; i++) {
    const task = todos[i];
    const completedTask = task.querySelector('input[type="checkbox"]').checked;

    switch (this.dataset.type) {
      case 'all':
        task.style.display = 'flex';
        break;
      case 'completed':
        task.style.display = completedTasks && completedTask ? 'flex' : 'none';
        break;
      case 'active':
        task.style.display = completedTask ? 'none' : 'flex';
        break;
      // skip default case;
    }
  }

  // Show all items if no completed tasks and 'completed' filter is selected
  if (this.dataset.type === 'completed' && !completedTasks) {
    const tasksItems = document.querySelectorAll('.tasks__item');
    tasksItems.forEach((item) => {
      item.style.display = 'flex';
    });
  }
}

filterButtons.forEach((button) => {
  button.addEventListener('click', filterTodo);
});
// ==============================================
// Clear all completed todos
const clearCompletedTask = document.querySelector('.app__footer-clear-completed');

clearCompletedTask.addEventListener('click', () => {
  const completedTasks = document.querySelectorAll('.inputRadioTask');

  completedTasks.forEach((task) => {
    const tasksItem = task.closest('.tasks__item');
    tasksItem.remove();
    countItem();
  });
});
// ==============================================
// Bonus: Drag and drop to reorder items on the list
function dragItem() {
  const tasksList = document.querySelector('.todo__list');

  tasksList.addEventListener('dragstart', dragStart);
  tasksList.addEventListener('dragover', dragOver);
  tasksList.addEventListener('dragenter', dragEnter);
  tasksList.addEventListener('dragleave', dragLeave);
  tasksList.addEventListener('drop', dragDrop);
  tasksList.addEventListener('dragend', dragEnd);

  function dragStart(e) {
    if (e.target.classList.contains('tasks__item')) {
      e.dataTransfer.setData('text/plain', e.target.dataset.name);
      e.target.classList.add('dragging');
    }
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
    if (e.target.classList.contains('tasks__item')) {
      e.target.classList.add('dragover');
    }
  }

  function dragLeave(e) {
    if (e.target.classList.contains('tasks__item')) {
      e.target.classList.remove('dragover');
    }
  }

  function dragDrop(e) {
    e.preventDefault();
    const draggedItem = e.dataTransfer.getData('text/plain');
    const targetItem = e.target.dataset.name;

    if (draggedItem !== targetItem) {
      const draggedElement = document.querySelector(`[data-name="${draggedItem}"]`);
      const targetElement = e.target.closest('.tasks__item');

      if (targetElement) {
        const targetRect = targetElement.getBoundingClientRect();
        const targetCenterY = targetRect.top + targetRect.height / 2;

        if (e.clientY < targetCenterY) {
          targetElement.before(draggedElement);
        } else {
          targetElement.after(draggedElement);
        }
      }
    }

    const tasksItems = document.querySelectorAll('.tasks__item');
    tasksItems.forEach((item) => {
      item.classList.remove('dragover');
    });
  }

  function dragEnd(e) {
    if (e.target.classList.contains('tasks__item')) {
      e.target.classList.remove('dragging');
    }
  }
}
dragItem();
