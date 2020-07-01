const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const dataPath = './data/todo/';
const emptyData = [];

const getTodoList = function (userId) {
  return new Promise((resolve) => {
    fs.readFile(dataPath + userId + '.json', (err, data) => {
      if (err) {
        console.log(err);
        writeTodoList(userId, []);
        resolve(emptyData);
      } else {
        let textData = data.toString();
        if (textData == '') {
          resolve(emptyData);
        } else {
          let todoJson = JSON.parse(textData);
          resolve(todoJson);
        }
      }
    });
  });
}

const writeTodoList = function (userId, data) {
  return new Promise((resolve) => {
    fs.writeFile(dataPath + userId + '.json', JSON.stringify(data), function (err) {
      if (err) {
        console.log(err);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}



module.exports = {
  create: async function (userId, content) {
    let list = await getTodoList(userId);
    list.push({
      id: uuidv4(),
      content: content,
      completed: false
    });
    let result = await writeTodoList(userId, list);
    return result;
  },
  todoList: async function (userId) {
    let list = await getTodoList(userId);
    return list;
  },
  changeCompleted: async function (userId, todoId) {
    let list = await getTodoList(userId);
    list.forEach(t => {
      if (t.id == todoId) {
        t.completed = !t.completed;
      }
    });
    let result = await writeTodoList(userId, list);
    return result;
  },
  editTodo: async function (userId, todoId, content) {
    let list = await getTodoList(userId);
    list.forEach(t => {
      if (t.id == todoId) {
        t.content = content;
      }
    });
    let result = await writeTodoList(userId, list);
    return result;
  },
  deleteTodo: async function (userId, todoId) {
    let list = await getTodoList(userId);
    list = list.filter((t) => {
      return t.id != todoId;
    });
    let result = await writeTodoList(userId, list);
    return result;
  }
}

