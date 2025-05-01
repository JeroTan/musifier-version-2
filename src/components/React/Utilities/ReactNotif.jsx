import { useContext, useEffect, useRef, useState } from "react"
import Icon from "./Icon"
import { GlobalStateContext } from "./GlobalState"
import { removeDecimal } from "../helpers/Math";


export function NotifComponent(){
    //Global
    const [gState, gCast] = useContext(GlobalStateContext);
    const { notif } = gState;

    //Structure
    const [count, countSet] = useState(5);

    //DOM reference
    const notifContainer = useRef();

    useEffect(()=>{
        const availableSpace = window.innerHeight - notifContainer.current.offsetTop;
        const fitItem = removeDecimal(availableSpace / 120) - 3; //3 is for bottom spacing
        countSet(fitItem < 1? 1: fitItem);
    }, []);

    return <>
        <aside ref={notifContainer} className=" absolute right-0 mr-2 flex flex-col gap-2 items-end" style={{top: "100px"}}>
            { notif.slice(0, count).map(x=>{
                return <NotifItem key={x.id} id={x.id} content={x.content} />
            }) }
            { notif.length > count && <Overflow total={notif.length-count} /> }
        </aside>
    </>
}

export function NotifItem(props){
    //Global
    const [gState, gCast] = useContext(GlobalStateContext);
    const {id, content} = props;


    return <>
        <div>
            <div className=" w-fit py-2 pl-3 pr-2 bg-sky-900 hover:bg-sky-950 rounded flex items-center gap-2">
                <div className="my-subtext-big text-slate-100">
                    {content}
                </div>
                <Icon name="close" inClass="fill-slate-300" outClass="w-5 h-5 cursor-pointer hover:scale-110 shrink-0" onClick={()=>{
                    gCast({notif:"close", id:id});
                }} />
            </div>
        </div>

    </>
}

export function Overflow({total}){
    return <>
        <div>
            <div className=" w-fit py-2 pl-3 pr-2 bg-sky-900/50 rounded flex items-center gap-2">
                <div className="my-subtext-big text-slate-100">
                    {total} <span  className="my-subtext text-slate-200">more...</span>
                </div>
            </div>
        </div>
    </>
}
