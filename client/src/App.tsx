import React, {FC, useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from 'mobx-react-lite';
import {IUser} from "./models/IUser";
import UserService from "./services/UserService";

const App: FC = () => {

    const {store} = useContext(Context)
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if(localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        }
        catch (e) {
            console.log(e)
        }
    }

    if(store.isLoading) {
        return <div>Loading...</div>
    }

    if(!store.isAuth) {
        return (
            <div className="App">
                <header className="App-header">
                    <p>
                        <h1>Log in to your account or register new.</h1>
                        <LoginForm/>
                        <div>
                            <button onClick={getUsers}>Get users</button>
                        </div>
                        <div>
                            {users.map(user =>
                                <div key={user.email}>{user.email}</div>
                            )}
                        </div>
                    </p>
                </header>
            </div>
        );
    }

    console.log(store.user.isActivated)
    let isActive = store.user.isActivated

    return (
    <div className="App">
      <header className="App-header">
        <p>
            <h1>{`User '${store.user.email}' is authorized.`}</h1>
            {/*TODO: catch bug when 'isActive=false' but renders like 'isActive=true' ('Account email is activated.')...*/}
            <h1>{isActive ? "Account email is activated." : "Please activate your account by mail."}</h1>
            <button onClick={() => store.logout()}>Logout</button>
            <div>
                <button onClick={getUsers}>Get users</button>
            </div>
            <div>
                {users.map(user =>
                    <div key={user.email}>{user.email}</div>
                )}
            </div>
        </p>
      </header>
    </div>
    );
}

export default observer(App);
