import { createContext, useState } from "react";

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
    const [section, setSection] = useState(null);

    return (
        <AppContext.Provider
            value={{
                section, setSection
            }}
        >
            {children}
        </AppContext.Provider>
    );
};