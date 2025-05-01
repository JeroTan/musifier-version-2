import { createContext, useReducer } from "react";
import { sideNavDispatch, sideNavState } from "../PagePlate/SideNav";
import { popDispatch, popStructure } from "../helpers/Pop";
import { notifDispatch } from "../helpers/Notif";

//GlobalState
export const GlobalStateContext = createContext();

export function GlobalState(){
    //State Container
    const state = {
        sideNav: sideNavState,
        pop: popStructure,
        notif: [],
    };

    //Dispatcher
    function dispatch(state, action){
        const refState = {...state};

        if(action?.sideNav)
            refState.sideNav = sideNavDispatch(refState.sideNav, action);

        if(action?.pop)
            refState.pop = popDispatch(refState.pop, action);

        if(action?.notif)
            refState.notif = notifDispatch(refState.notif, action);

        return refState;
    }
    //returner
    return useReducer(dispatch, state);
}
