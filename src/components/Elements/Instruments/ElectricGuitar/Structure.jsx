import { createContext } from "react";
// import { createMode } from "@/Elements/Instruments/Components.jsx";
import { makeScale, notePatternType } from "../Components";

//InterfaceDefault
export const InterfaceDefault  = {

    tune: [0,0,0,0,0,0],
    notePick: [], //use numbers from 1 to 12 as notes
    currentNote: undefined, //Once Filled it should be an object {color, note, octave}

    //This one is for options only to change/manipulate the data above
    noteFlow: "Ascending", //Descending or Ascending
    scale: "notSelected", //Key Name of the Scale
    mode: "notSelected", //This is a number once used.
    patternIndex: 0, //This one is for index
        pattern: notePatternType[0], //This one is for print for easy access
    interfaceType: "Default", //"Write or Default" default use the interactivity of the page while write will freeze the current state in order for them to receive the click data on screen
        isWritable: false, //By default it is set to false, when this is false then interfaceType will always be "default"

};

//InterfaceDispatcher
export function InterfaceDispatcher(rawState, action){
    const state = {...rawState};

    if(action?.tune){
        const tune = [...state.tune];
        switch(action.tune){
            case "update":
                let sanitizeValue = Number(action.val);
                const index = action.index;

                if(sanitizeValue > 24) sanitizeValue = 24; else if(sanitizeValue < -24) sanitizeValue = -24;
                tune[index] = sanitizeValue ;
            break;
        }
        state.tune = tune;
    }

    if(action?.notePick){
        const notePick = [...state.notePick];

        switch(action.notePick){
            case "click":
                if(state.interfaceType !== "Default")
                    break;

                const noteClicked = action.val; //Check the click note;
                const clickedIndex = notePick.indexOf(noteClicked);

                if(clickedIndex >= 0){
                    notePick.splice(clickedIndex, 1); //Since it is picked, remove it from the notePick;
                    break;
                }

                //if not picked then add it to the list;
                notePick.push(noteClicked);
                //Get the root for sorting
                const rootNote = notePick[0];
                notePick.sort((next, current)=>{
                    //the rootNote must be always first regardless;

                    //we need the root to be at zero since it is first;
                    next = next - rootNote;
                    current = current - rootNote;
                    // if(state.noteFlow !== "Ascending"){//Also Check the noteFlow if descending or ascending
                    //     //We need the root to be at 12(max) so that it will treat still as first when we reverse the sort
                    //     next = next + (12-rootNote);
                    //     current = current + (12-rootNote);
                    // }

                    next =  (((next)%12)+12)%12;
                    current = (((current)%12)+12)%12;
                    // return  state.noteFlow == "Ascending"? next - current : current - next;
                    return next - current;
                });
            break;
        }
        state.notePick = notePick;
    }

    if(action?.currentNote){
        switch(action?.currentNote){
            case "update":
                state.currentNote = action.val;
            break;
        }
    }

    if(action?.noteFlow){
        switch(action.noteFlow){
            case "toggle":
                state.noteFlow = state.noteFlow == "Ascending" ? "Descending" : "Ascending";
            break;
        }
    }


    if(action?.scale){
        switch(action.scale){
            case "update":
                if(state.scale === action.scale)
                    break;
                state.scale = action.val;
                state.mode = state.scale !== "notSelected"?0:"notSelected";

                if(state.notePick.length < 1 || state.scale == "notSelected")
                    break;
                state.notePick =  makeScale(state.notePick[0], state.scale, state.mode);
            break;
        }
    }


    if(action?.mode){
        switch(action.mode){
            case "update":
                if(state.mode === action.val)
                    break;
                state.mode = action.val;

                if(state.notePick.length < 1 || state.mode === "notSelected")
                    break;
                state.notePick =  makeScale(state.notePick[0], state.scale, state.mode);
            break;
        }
    }

    if(action?.pattern){
        switch(action.pattern){
            case "toggle":{
                state.patternIndex = (state.patternIndex+1) % notePatternType.length;
                state.pattern =  notePatternType[state.patternIndex];
                break;
            }
        }
    }


    if(action?.interfaceType){
        switch(action.interfaceType){
            case "writable":
                state.isWritable = true;
            break;
            case "toggle":
                state.interfaceType = state.interfaceType == "Default" ? "Write" : "Default";
            break;
        }
    }

    return state;
}

//Interface Global Data Definition
export const ElectricGuitarInterfaceStateContext = createContext();


//Other definition
export const standardTune = [7, 2, 10, 5, 0, 7]; //Starting from the thinnest string
export const standardRegister = [52, 47, 43, 38, 33, 28]; //Same as above but this is used for overall octave of the string


//Note Color Per Octave
export const noteColor = {
    root: "#EF4444",
    o0: "#938787",
    o1: "#709C74",
    o2: "#4D7C0F",
    o3: "#0F766E",
    o4: "#1D4ED8",
    o5: "#6D28D9",
    o6: "#BE185D",
    o7: "#630000",
    o8: "#3D0808",
    none: "#000000",
}
