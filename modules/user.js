const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const dataPath = './data/user.json';
const emptyData = [];
const secret = 'thisisaverysecretkey';

const getUserList = function () {
  return new Promise((resolve) => {
    fs.readFile(dataPath, (err, data) => {
      if (err) {
        console.log(err);
        writeUserList([]);
        resolve(emptyData);
      } else {
        let textData = data.toString();
        if (textData == '') {
          resolve(emptyData);
        } else {
          let userJson = JSON.parse(textData);
          resolve(userJson);
        }
      }
    });
  });
}

const writeUserList = function (data) {
  return new Promise((resolve) => {
    fs.writeFile(dataPath, JSON.stringify(data), function (err) {
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
  signUp: async function (username, password) {
    let list = await getUserList();
    let user = list.find(u => u.username == username);
    if (user) {
      return null;
    } else {
      let user = {
        id: uuidv4(),
        username: username,
        password: password
      };
      list.push(user);
      let result = await writeUserList(list);
      if (result) {
        return user;
      } else {
        return null;
      }
    }
  },
  signIn: async function (username, password) {
    let list = await getUserList();
    let user = list.find(u => u.username == username && u.password == password);
    return user;
  },
  generateToken: async function (user) {
    let token = jwt.sign({
      data: user
    }, secret, { expiresIn: '30d' });
    return token;
  },
  getUser: function (token) {
    let decoded = jwt.verify(token, secret);
    let user = null;
    if (decoded) {
      user = decoded.data;
    }
    return user
  }
}

