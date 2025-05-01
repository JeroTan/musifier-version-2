import { cloneElement } from "react";

export function copyChildren(children, addProps =false){
    if( !Array.isArray(children) )
        children = [children];

    const newChildren = [];
    children.forEach((child,i)=>{
        const additionalProps = addProps ? addProps : {};
        const props = { ...child.props, key:i, ...additionalProps };
        newChildren[i] = cloneElement(child, props )
    });

    return newChildren;
}



//THis is not working yet
export class ElementResolver{
    constructor(element = []){//Must be array; Insert the element props here
        if(element.length){
            this.element = element;
        }
    }
    //**In House */
    insertKey(element){
        element.forEach(x=>{
            console.log(x.props);
            x.props = {...x.props, key:Date.now().toString()};
        });
        return element;
    }
    //**In House */
    manipProps(callback, index = false){//manipulate props
        if(index){
            this.element[index].props = callback({...this.element[index].props});
        }
        this.element.forEach(x=>{
            x.props = callback({...x.props});
        });
    }
    add(){
        //Soon
    }
    remove(){
        //soon
    }
    show(){
        return this.element;
    }
}
