import React, { createContext, useEffect, useState } from 'react'

export const UserContext = createContext()

export default ({ children }) => {
    
    const currentUser = window.sessionStorage.getItem('user') != 'false' ? window.sessionStorage.getItem('user') : ''
    
    const [user, setUser] = useState(currentUser)

    useEffect(() => {
            console.log(user);
            window.sessionStorage.setItem('user', user);
        },
        [user]
    );
    
    const context = {
        user,
        setUser,
    }

    return (
        <UserContext.Provider value={context}>
            {children}  
        </UserContext.Provider>
    )
    
}