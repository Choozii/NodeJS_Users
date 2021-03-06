import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../_actions/user_action'

function Loginpage(props) {
    const dispatch = useDispatch();
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    
    const onSubmitHandler = (event) => {
        event.preventDefault();
        let body = {
            email:Email,
            password:Password
        }
        
        dispatch(loginUser(body))
        .then(response => {
            console.log(response);
            if(response.payload.loginSuccess){
                props.history.push('/');
            }
        })
    }

    const styles={
        page : {
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            width : '100%',
            height:'100vh'
        },
        forms:{
            display:'flex',
            flexDirection:'column'
        }
    }

    return (
        <div style={styles.page}>
            <form style={styles.forms} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button>Login</button>
            </form>
        </div>
    )
}

export default Loginpage;