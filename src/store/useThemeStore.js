import {create} from "zustand";

export const useThemeStore=create((set)=>({
    theme:localStorage.getItem("myapp-theme")||"dark",
    setTheme:(theme)=>{
        localStorage.setItem("myapp-theme",theme);
        set({theme});

    }
}))