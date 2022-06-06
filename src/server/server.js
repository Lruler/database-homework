const BASE = "/api"

function Fetch(url, opt = {}) {
    url = BASE + url
    opt.method = opt.method || 'GET';
    opt.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    if (opt.body) {
        opt.body = JSON.stringify(opt.body)
    }
    opt.body = JSON.stringify(opt.data) || null;
    if (opt.formdata) {
        opt.body = opt.formdata;
    }
    return fetch(url, opt)
        .then(response => {
            if (response.ok) {
                return response.json().then(res => {
                    return res;
                });
            } else {
                return response.json().then(res => {
                    return new Promise((_, reject) => {
                        reject(res);
                    });
                });
            }
        })
        .catch(e => {
            console.log(`服务端错误：${e.message}`)
            throw e;
        })
}


const Login = (name, password) => {
    return Fetch('/loginIn', {
      method: "POST",
      data: {
        name,
        password
      }
    })
}

const addBook = (bookInfo) => {
    return Fetch('/book/add', {
      method: "POST",
      data: bookInfo
    })
}

const deleteBook = (id) => {
  return Fetch(`/book/delete/${id}`, {
    method: "DELETE"
  })
}

const modifyBook = (bookInfo) => {
  return Fetch('/book/modify', {
    method: "POST",
    data: bookInfo
  })
}

const getBookList = () => {
  return Fetch('/book/list')
}

const searchBook = (name) => {
  return Fetch('/book/search', {
    method: 'POST',
    data: {
      name
    }
  })
}

const addHistory = (bookInfo) => {
  return Fetch('/history/add', {
    method: 'POST',
    data: bookInfo
  })
}

const showHistoryByName = (name) => {
  return Fetch(`/history/listbybookname/${name}`)
}

const showHistoryById = (id) => {
  return Fetch(`/history/listbyuserid/${id}`)
}

const addUser = (userInfo) => {
  return Fetch('/user/add', {
    method: 'POST',
    data: userInfo
  })
}

const deleteUser = (id) => {
  return Fetch(`/user/delete/${id}`, {
    method: "DELETE"
  })
}

const getUserList = () => {
  return Fetch(`/user/list`)
}


const modifyUser = (userInfo) => {
  return Fetch('/user/modify', {
    method: 'POST',
    data: userInfo
  })
}

const searchUser = (id) => {
  return Fetch(`/user/search/${id}`)
}


const borrowBook = (book_id, user_id, borrow_date) => {
  return Fetch(`/user/borrow`, {
    method: "POST",
    data: {
      book_id,
      user_id,
      borrow_date
    }
  })
}

const returnBook = (id, book_id, return_date) => {
  return Fetch('/user/return', {
    method:"POST",
    data: {
      id,
      book_id,
      return_date
    }
  })
}

const Server = {}


Server.Login = Login

Server.addBook = addBook
Server.getBookList = getBookList
Server.deleteBook = deleteBook
Server.modifyBook = modifyBook
Server.searchBook = searchBook

Server.addHistory = addHistory
Server.showHistoryById = showHistoryById
Server.showHistoryByName = showHistoryByName

Server.addUser = addUser
Server.deleteUser = deleteUser
Server.getUserList = getUserList
Server.modifyUser = modifyUser
Server.searchUser = searchUser


Server.borrowBook = borrowBook
Server.returnBook = returnBook



export default Server
