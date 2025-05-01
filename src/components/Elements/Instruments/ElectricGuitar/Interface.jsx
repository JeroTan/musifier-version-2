import { useEffect, useReducer } from "react";
import { ElectricGuitarInterfaceStateContext, InterfaceDefault, InterfaceDispatcher } from "./Structure";
import { Fretboard } from "./Fretboard";
import { Interactable } from "./Interactable";
import { SideOptions, TopOptions } from "./HeaderOption";

//This will be the main export with lazy loading
export function ElectricGuitarInterface(props){
    //Parent Config
    const { isWritable, getCurrentNoteData } = props; //@ isWritable == Boolean, getCurrentNoteData == currentNote

    //Reduced the Structure Data
    const [interfaceState, interfaceCast] = useReducer(InterfaceDispatcher, InterfaceDefault);

    //UseEffect
    useEffect(()=>{
        if(isWritable === true)
        interfaceCast({interfaceType:"writable"});
    }, []);
    if(getCurrentNoteData !== undefined && typeof getCurrentNoteData === "function"){
        useEffect(()=>{
            getCurrentNoteData(interfaceState.currentNote);
        }, [interfaceState.currentNote]);
    }


    return <>
    <ElectricGuitarInterfaceStateContext.Provider value={[interfaceState, interfaceCast]}>
        <main className="xl:[110rem] lg:w-[100rem] md:w-[80rem] w-[70rem]">
            {/** Other Options goes to the header */}
            <TopOptions />

            {/**Fretboard with along with its side option for tuning */}
            <section className=" w-full flex">
                <SideOptions />
                <Fretboard>
                    <Interactable />
                </Fretboard>
            </section>

        </main>
    </ElectricGuitarInterfaceStateContext.Provider>
    </>
}
