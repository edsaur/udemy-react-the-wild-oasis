import { createContext, useContext, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const LightModeContext = createContext();

function DarkModeProvider({children}){
    const [isDarkMode, setIsDarkMode] = useLocalStorageState(window.matchMedia('prefers-color-scheme: dark').matches, 'isDarkMode');

    useEffect(function(){
        if(isDarkMode){
            document.documentElement.classList.add("dark-mode");
            document.documentElement.classList.remove("light-mode");
        } else {
            document.documentElement.classList.add("light-mode");
            document.documentElement.classList.remove("dark-mode");
        }
    }, [isDarkMode])

    function toggleDarkMode(){
        setIsDarkMode((isDark) => !isDark);
    }

    return <LightModeContext.Provider value={{isDarkMode, toggleDarkMode}}>{children}</LightModeContext.Provider>
} 

function useDarkMode() {
    const context = useContext(LightModeContext);
    if(context === undefined) {
        throw new Error("Dark Mode Context was used outside of DarkModeProvider");
    }
    return context;
}

export {DarkModeProvider, useDarkMode};