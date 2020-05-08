import React, { Fragment, useEffect, useState } from 'react';
import { MyContext } from '../../../../context/MyProvider';
import './UserProfile.css';

const UserPofile = () => {

    const { logUserIntoContext } = React.useContext(MyContext);
    const [users, updateUsers] = useState([])
    let [firstName, setFirstName] = useState('')
    let [lastName, setLastName] = useState('')
    let [username, setUsername] = useState('')
    let [birthdate, setBirthDate] = useState('')
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    // let [repeatedPassword, setRepeatedPassword] = useState('')

    let [posted, setPosted] = useState(false)

const postProfile = e => {
    e.preventDefault()

    fetch('//localhost:5000/user', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ firstName, lastName, username, birthdate, email, password })
    }).then(res => {
        if(res) {
            setPosted(!posted)
            alert("Registered!")
        }
    })

    setFirstName(firstName = "")
    setLastName(lastName = "")
    setUsername(username = "")
    setBirthDate(birthdate = "")
    setEmail(email = "")
    setPassword(password = "")

}

const logUser = (e) => {
    e.preventDefault()
    console.log('username and password', username, password)
    fetch('//localhost:5000/log', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ username, password })
    }).then(res => {
        console.log('response', res)
        if(res.status === 200) {
            // context.logUser(res);
            alert('logged in!')
            console.log('logggggged innnn')
            return res.json()
        }
    }).then(data => logUser(data))
}



const deleteUser = (username) => {

    fetch('//localhost:5000/user', {
        method: 'DELETE',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ username })
    }).then(res => {
        if(res.status === 200) {
            setPosted(!posted)
            alert("Deleted!")
        }
    })
}



// Lets the page rerender every time the database changes (by posting, deleting or putting)

useEffect(() => {
    fetch('http://localhost:5000/user')
        .then(res => res.json())
        .then(data => updateUsers([...data]))
}, [posted])

    return (
    <div>
        <MyContext.Consumer>
            {(context) => (
                <Fragment>
                    {/* <hr />
                    <h1>Mi Perfil</h1>
                    <h6>
                        Nombre:
                        {context.state.name}
                    </h6>
                    <h6>
                        Nombre Usuario:
                        {context.state.username}
                    </h6>
                    <h6>
                        Edad:
                        {context.state.age}
                    </h6>
                    <h6>
                        Puntos:
                        {context.state.points}
                    </h6> */}
                    {/* <button onClick={context.addPoints}><span className ='btn-text-prefil' >Add the points!</span></button> */}


                    {/* <h1>REGISTER</h1>

                    <h3>Register as a user</h3>
                    <form onSubmit={postProfile}>
                        <input
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            name="first_name"
                            placeholder="nombre"
                        />
                        <br />
                        <input
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            name="last_name"
                            placeholder="apellidos"
                        />
                        <br />
                        <input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            name="username"
                            placeholder="username"
                        />
                        <br />
                        <input
                            value={birthdate}
                            onChange={e => setBirthDate(e.target.value)}
                            name="birth_date"
                            placeholder="birth date"
                        />
                        <br />
                        <input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            name="mail"
                            placeholder="e-mail"
                        />
                        <br />
                        <input
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            name="password"
                            placeholder="password"
                        />
                        <br />
                        <button type="submit">Registrarme</button>
                    </form> */}
                    <br />
                    <h1>LOG IN</h1>

                    <h3>Log in with your user</h3>
                    <form onSubmit={logUser}>
                        <input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            name="username"
                            placeholder="usuario"
                        />
                        <br />
                        <input
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            name="password"
                            placeholder="contraseña"
                        />
                        <button type="submit">Log in!</button>
                    </form>

                    <button type="button" onClick={() => context.clearUser()}>Log out</button>

                    <h3>List of registered users</h3>
                        {users.length > 0 &&
                            users.map(({ first_name, last_name, username, birth_date, email, password }) => (
                                <div key={username} >
                                    <p>{first_name}</p>
                                    <p>{last_name}</p>
                                    <p>{username}</p>
                                    <p>{birth_date}</p>
                                    <p>{email}</p>
                                    <p>{password}</p>
                                    <button onClick={() => { deleteUser(username) }}>Delete from database</button>
                                    <hr />
                                </div>
                            ))
                        }

                </Fragment>
            )}
        </MyContext.Consumer>
    </div>
    )
};

export default UserPofile;
