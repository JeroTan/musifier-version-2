import { cloneElement, useEffect, useRef, useState } from "react";
import { ElementResolver, copyChildren } from "@components/React/Utilities/ReactParse";
import { capitalFirst, propsExclude } from "@jsarmyknife/native--parse";
import Icon from "@components/React/Utilities/Icon";

export function HrLine({children}){
    return <>
        <div className=" flex items-center gap-2">
            <div className="bg-gray-500/50 basis-full" style={{height:"1px"}}></div>
            <p className="text-gray-500">{children}</p>
            <div className="bg-gray-500/50 basis-full" style={{height:"1px"}}></div>
        </div>
    </>
}


export function ListingView(props){
    //Global
    const {children} = props;
    const viewType = props.viewType ?? "wide";

    //UseState

    //Clone children to allow self modification
    const newChildren = copyChildren(children, {viewType:viewType});

    return <>
        <main className=" w-full flex flex-wrap gap-2">
            {newChildren}
        </main>
    </>
}


export function ListingEmpty(props){
    const {children} = props;
    return <>
        <div className=" w-full p-2 rounded bg-gray-900/50 hover:bg-gray-700 cursor-pointer">
            <p className=" my-text text-center">{children}</p>
        </div>
    </>
}

export function ListingLoading(props){
    const {viewType} = props;
    return <>
        <div className={` ${viewType=="wide"&&"w-full"} p-2 rounded bg-gray-500 animate-pulse`}>
            <div className="w-96 h-10"></div>
        </div>
    </>
}

//CONTENT VIEW
export function Container(props){
    const { children, noMargin=false, ...attributes } = props;

    return <>
    <div className={`w-full ${!noMargin?"pt-16":""} relative flex justify-center`}>
        <main style={{flexBasis: "70rem"}} {...attributes}>
            {children}
        </main>
    </div>
    </>
}
//<------------

//FORM
export function InputBox(props){
    const {fieldName, error, className, children, onInput, outClass, canSelfSet } = props;//This class is non-attributes
    const displayName = props.displayName ?? capitalFirst(fieldName);//If displayName is not provided then field name will be used instead
    const attributes = propsExclude(["fieldName", "error", "displayName", "id", "className", "children", "onInput", "key", "outClass", "canSelfSet"], props);

    return <>
        <div className={` ${outClass || "flex flex-wrap mb-3"} `}>
            <label htmlFor={fieldName} className=" my-subtext">{displayName}</label>
            <InputBar name={fieldName} id={fieldName} className={className} onInput={onInput} error={error} canSelfSet={canSelfSet} {...attributes} />
            <small className="my-infotext text-red-400">{error}</small>
            {children}
        </div>
    </>
}

export function InputBar(props){
    const { onInput, className = "", error="", canSelfSet=true, set, children, ...attributes } = props;

    //InputState
    const [ inputState, inputSet ] = useState("");

    //When someone set on the parent
    useEffect(()=>{
        if(set === undefined)
            return;
        inputSet(set);
    }, [set]);

    //Function
    function onInputRevise(e){//To insert a callback outside of this inputBox
        if(!onInput)
            return inputSet(e.target.value);

        if(canSelfSet){
            onInput(e);
            return inputSet(e.target.value);
        }

        onInput(e, inputState, inputSet);
    }
    return <>
        <input className={` my-textbox ${className} ${error && "my-errorbox"}`} value={inputState} onInput={onInputRevise} {...attributes} />
    </>
}
export function DropDown(props){
    const { onChange, className = "", error="", canSelfSet=true, set, children,...attributes } = props;

    //InputState
    const [ inputState, inputSet ] = useState("");

    //When someone set on the parent
    useEffect(()=>{
        if(set === undefined)
            return;
        inputSet(set);
    }, [set]);

    //Function
    function onChangeRevise(e){//To insert a callback outside of this inputBox
        if(!onChange)
            return inputSet(e.target.value);

        if(canSelfSet){
            onChange(e);
            return inputSet(e.target.value);
        }

        onChange(e, inputState, inputSet);
    }

    return <>
    <select className={` my-textbox ${className} ${error && "my-errorbox"}`} value={inputState} onChange={onChangeRevise} {...attributes} >
        { children }
    </select>
    </>
}
export function DropDownItem({className, children, ...attributes}){ //Use attribute label instead of children
    return <>
        <option className={` ${className}`} {...attributes}>{children}</option>
    </>
}
//<------------



//FILTERERS
export function FilterHeader(props){
    const {children} = props;
    if( !(children?.length == 2) ){
        throw new Error("FilterHeader needs only two element");
    }
    const [left, right] = children;

    return <>
        {/**Header Filter */}
        <form className=" w-full flex flex-wrap justify-between gap-2" aria-label="Filtering Components" onSubmit={e=>e.preventDefault()}>
            {/**Left Side */}
            <div className="flex">
                {left}
            </div>
            {/**Right Side */}
            <div className=" flex gap-2 flex-wrap">
                {right}
            </div>
        </form>
    </>
}
export function Search(props){
    const { setSearch, doSearch } = props;

    return <>
        <div className=" flex gap-2">
            <InputBar name="search" onInput={setSearch} />
            <button className=" my-btn px-3" onClick={doSearch}>
                <Icon name="search" inClass=" fill-gray-800" outClass=" w-4 h-4" />
            </button>
        </div>
    </>
}

export function ChangeView(props){
    const { setView } = props;
    const defaultView = props.defaultView ?? "wide";

    const [state, setState] = useState("wideView");
    useEffect(()=>{
        setState(defaultView+"View");
    }, []);

    //Function
    function changeView(){
        const newView = state=="wideView"?"compactView":"wideView";
        setView(newView == "wideView");
        setState(newView);
    }

    return <>
        <button className=" my-btn px-3 py-2" onClick={changeView}>
            <Icon name={state} inClass=" fill-gray-800" outClass=" w-4 h-4" />
        </button>
    </>
}

export function Sorter(props){
    const sortData = props.sortData; //{keyName:DisplayName, ... }
    const sortOrdered = props.sortOrdered;

    const [sortItem, sortItemSet] = useState([]);

    useEffect(()=>{//Initialize One Time
        const newSortItem = Object.keys(sortData).map((key, i)=>{
            return {id:Date.now()+i, key:key, display:sortData[key], type:"ASC"};
        })
        sortItemSet(newSortItem);
    }, []);

    //Functionality
    function sortTrigger(triggeredData){
        const {key, type} = triggeredData;

        const indexToAdvance = sortItem.findIndex(x=>x.key === key);
        const newOrder = [ sortItem[indexToAdvance], ...sortItem.filter((x,i)=>i!==indexToAdvance) ];
        newOrder[0].type = type;
        sortOrdered(newOrder);
        sortItemSet(newOrder);
    }

    return <>
    <form className="w-full flex flex-wrap gap-2" onSubmit={e=>e.preventDefault()}>
        {sortItem.map((x)=>{
            return <SortItem key={x.id} displayName={x.display} keyName={x.key} trigger={sortTrigger}  />
        })}
    </form>
    </>
}

export function SortItem(props){
    const displayName = props.displayName;
    const keyName = props.keyName;
    const trigger = props.trigger ?? (()=>true);

    //useState
    const [state, stateSet] = useState("up");

    function toggleState(){
        trigger({
            key:keyName,
            type:state!="up"?"ASC":"DESC"
        });
        stateSet(prev=>{
            const newState = prev=="up"?"down":"up";
            return newState;
        });
    }

    return <>
        <button type="button" className="flex items-center gap-1 hover:scale-105 hover:brightness-90 " onClick={toggleState}>
            <span className=" my-subtext ">{displayName}</span>
            <Icon name={state} inClass=" fill-slate-300" outClass=" w-4 h-4" />
        </button>
    </>
}
//<------------
