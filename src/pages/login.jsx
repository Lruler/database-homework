import { useState } from 'react'
import Server from '../server/server'
import './login.less'


function App() {

  const [name, setName] = useState('');
  const [pwd, setPwd] = useState('');

  const handleLogin = () => {
    Server.getUserList().then((d) => {
      console.log(d)
    })
    console.log(name, pwd)
    Server.Login(name, pwd).then((d) => {
      console.log(d)
    })
  }








  return (
    <div className='login-page'>
      <h1>登陆页面</h1>
      <div className='login-form'>
        <div className='login-name'>
          账户: <input type="text" onChange={(e) => { setName(e.target.value) }} />
        </div>
        <div className='login-pwd'>
          密码: <input type="password" onChange={(e) => { setPwd(e.target.value) }} />
        </div>
      </div>
      <button onClick={handleLogin}>登陆</button>
    </div>
  )
}

export default App
