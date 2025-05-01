import { useCallback, useContext, useEffect, useRef } from "react";
import { GlobalStateContext } from "./GlobalState";
import Icon from "./Icon";


export function PopComponent(){
    //Global
    const [gState, gCast] = useContext(GlobalStateContext);
    const {
        isOpen,
        width,
        icon,
        iconColor,
        iconAnimate,
        title,
        message,
        acceptButton,
        rejectButton,
        acceptButtonText,
        rejectButtonText,
        acceptButtonCallback,
        rejectButtonCallback,
        closeButton,
        closeButtonCallback,
        backdropTrigger,
        backdropTriggerCallback,
        customDialog
    } = gState.pop;

    //Bind the dom of dialog element
    const dialogRef = useRef();

    //Close And Off Modal
    useEffect(()=>{
        if(isOpen)
            dialogRef.current.showModal();
        else
            dialogRef.current.close();
    }, [isOpen]);

    //Functionality
    const closeThisPop = useCallback((e)=>{ //This will always be sent when someone gave their callback i.e. accept click, close, cancel, etc.
        gCast({pop:"close"});
    }, []);
    const dialogClick = useCallback(e=>{ //This will be use to trigger background click or not;
        if(!backdropTrigger)
            return;

        const dialogBound = e.target.getBoundingClientRect();
        if(
            !(dialogBound.left > e.clientX ||
            dialogBound.right < e.clientX ||
            dialogBound.top > e.clientY ||
            dialogBound.bottom < e.clientY)
        ){ //Check if the click is outside the border;
            return;
        }
        // if( !(e.target === dialogRef.current) )
        //     return; //This is the old and it seems not viable most of the time

        if(!backdropTriggerCallback){
            closeThisPop();
            return;
        }
        backdropTriggerCallback(closeThisPop);
    }, [backdropTrigger]);

    return <>
        <dialog ref={dialogRef} className="my-dialog " style={{width: width}} onClick={dialogClick}>
            {closeButton&&<>
                <div className="flex justify-end">
                    <div className="cursor-pointer hover:scale-110 delay-75 fill-zinc-600 hover:fill-zinc-500"
                    onClick={()=>{
                        if(!closeButtonCallback){
                            closeThisPop();
                            return;
                        }
                        closeButtonCallback(closeThisPop);
                    }}>
                        <Icon name="close" outClass="w-5 h-5" />
                    </div>
                </div>
            </>}

            {customDialog && typeof customDialog === "function" ? <>
                {customDialog(closeThisPop)}
            </>:<>

                {icon&&<>
                    <div className="flex w-full justify-center mt-1">
                        <Icon name={icon} inClass={`${iconColor} `} outClass={`w-24 h-24 ${iconAnimate}`} />
                    </div>
                </>}
                {title&&<>
                    <div className="flex w-full justify-center mt-2">
                        <h1 className={`my-title text-center`}>{title}</h1>
                    </div>
                </>}
                {message&&<>
                    <div className="flex w-full justify-center mt-1">
                        <p className={`my-text text-slate-400 text-center`}>{message}</p>
                    </div>
                </>}

                {/** Check if there is an accept button */}
                {(acceptButton || rejectButton)&&<>
                    <div className="flex w-full justify-center gap-5 mt-8 flex-wrap">
                        {acceptButton&&<>
                            <button className="my-btn-blue px-3 py-2" onClick={()=>{
                                if(!acceptButtonCallback){
                                    closeThisPop();
                                    return;
                                }
                                acceptButtonCallback(closeThisPop);
                            }}>
                                {acceptButtonText}
                            </button>
                        </>}
                        {rejectButton&&<>
                            <button className=" my-btn-clear" onClick={()=>{
                                if(!rejectButtonCallback){
                                    closeThisPop();
                                    return;
                                }
                                rejectButtonCallback(closeThisPop);

                            }}>
                                {rejectButtonText}
                            </button>
                        </>}
                    </div>
                </>}

                <div className="py-3"></div>
            </>}

        </dialog>
    </>
}
