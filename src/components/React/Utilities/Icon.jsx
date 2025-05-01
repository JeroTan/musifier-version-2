import { useMemo } from "react";
import { iconListMusifierRemix } from "src/utility/IconListMusifierRemix";
import { propsExclude } from "@jsarmyknife/native--parse";


export default (props)=>{
    const name = props.name;
    const inClass = props.inClass;
    const outClass = props.outClass;
    const attributes = propsExclude(["name", "inClass", "outClass", "children", "className"], props);

    const iconData = useMemo(()=>{
        return iconListMusifierRemix[name];
    }, [name]);
    if(iconData === undefined)
        return ""

    return <>
    <div className={outClass} {...attributes} >
        <svg xmlns={iconData.svg.xmlns} width="100%" height="100%" viewBox={iconData.svg.viewBox} >
            <g className={inClass}>
                {iconData.vectors.map((x, i)=>{
                    switch(x.element){
                        case "path":
                            return <path key={i} { ...propsExclude(["element"], x)} />
                        break;
                    }
                })}
            </g>
        </svg>
    </div>
    </>
}
