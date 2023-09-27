import { createContext , useState } from "react";

const UserType = createContext();

const UserContext = ({children}) =>{
    // const localhost = "192.168.8.72:8000";
    const localhost = "192.168.43.4:8000";
   
    const [userId,setUserId] = useState('')
    return(
        <UserType.Provider value={{localhost,userId,setUserId}}>
            {children}
        </UserType.Provider>
    )
}

export { UserType , UserContext }