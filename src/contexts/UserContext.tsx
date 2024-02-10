'use client';

import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import Cookies from 'js-cookie';

interface UserContextType {
    selectedUser: string | null;
    setSelectedUser: (username: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({children}: { children: ReactNode }) => {
    const [selectedUser, setSelectedUserState] = useState<string | null>(null);

    useEffect(() => {
        const storedSelectedUser = Cookies.get('selectedUser');
        if (storedSelectedUser) {
            setSelectedUserState(storedSelectedUser);
        }
    }, []);

    const setSelectedUser = (username: string | null) => {
        setSelectedUserState(username);
        Cookies.set('selectedUser', username || '', {expires: 7});
    };

    return (
        <UserContext.Provider value={{selectedUser, setSelectedUser}}>
            {children}
        </UserContext.Provider>
    );
};
