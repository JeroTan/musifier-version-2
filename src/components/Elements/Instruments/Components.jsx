export function createMode(scalePattern = [], modeName = []){
    const mode = [];

    scalePattern.forEach((step, i)=>{ //Step means the gap between each pattern labeled by number;
        const modeData = {key:i, displayName: modeName[i] !== undefined && modeName[i] ? modeName[i] : i+1 , pattern: [] };

        const copyOriginalScalePattern = [...scalePattern]; //Make a copy so that the original will be remain untouched when we do a sorting on the next line'
        modeData.pattern = reorientPattern(copyOriginalScalePattern, step);

        //After sorting, move the steps in front. Meaning make the starting element as Zero.
        modeData.pattern = offsetPattern(modeData.pattern, step);

        mode[i] =modeData;
    });
    return mode;
}

//Scale
export const Scale = {
    diatonic: {displayName:"Diatonic Scale", pattern: [0, 2, 4, 5, 7, 9, 11], mode:[]}, // A 7 note pattern
    pentatonic: {displayName:"Pentatonic Scale", pattern: [0, 3, 5, 7, 10], mode:[]}, //A 5 note pattern;
};


Scale.diatonic.mode = createMode(Scale.diatonic.pattern, ["Major Scale",  "","","","", "Minor Scale"]);
Scale.pentatonic.mode = createMode(Scale.pentatonic.pattern, ["Minor Pentatonic Scale", "Major Pentatonic Scale"]);

export function makeScale(root, scale = "diatonic", mode = 0){
    return Scale[scale].mode[mode].pattern.map(step=>{
        return (root+step)%12;
    });
}

export function reorientPattern(notes, step){
    return notes.sort((next, curr)=>{
        const padNext = (next+12-step)%12;
        const padCurr = (curr+12-step)%12;
        return padNext - padCurr;
    });
}

export function sortPattern(notes){
    return notes.sort((next, curr)=>{
        return next - curr;
    });
}

export function offsetPattern(notes, step){
    return notes.map(note=>{
        return (note - step + 12)%12;
    })
}

export function gapOfPatterns(notes){
    const gapPattern = [];
    for(let i = 0; i < notes.length; i++){
        if(notes.length-1 == i){
            gapPattern.push(12 - notes[i]);
            break;
        }
        gapPattern.push( notes[i+1] - notes[i] );
    }
    return gapPattern;
}


export function notePattern(rawPattern = [], type="steps"){//@type - steps, tones, numbers, gaps
    const gaps = sortPattern(  offsetPattern(rawPattern, rawPattern[0])  );
    if(gaps.length < 1)
        return [];

    const newPattern = [];
    const gapPattern = gapOfPatterns(gaps);
    switch(type){
        case "steps":{
            gapPattern.forEach(gap=>{
                let steps = "";
                while(0 < gap){
                    if(2 <= gap){
                        steps += "W";
                    }
                    else{
                        steps += "H"
                    }
                    gap -= 2;
                }
                newPattern.push(steps);
            });
            break;
        }
        case "tones":{
            gapPattern.forEach(gap=>{
                let tones = "";
                while(0 < gap){
                    if(2 <= gap){
                        tones += "T";
                    }
                    else{
                        tones += "S"
                    }
                    gap -= 2;
                }
                newPattern.push(tones);
            });
            break;
        }
        case "numbers":{
            gaps.forEach(x=>{
                newPattern.push(x+1);
            })
            break;
        }
        case "gaps":{
            return gapPattern;
            break;
        }
    }
    return newPattern;
}
export const notePatternType = ["steps", "tones", "numbers", "gaps"];


export function convertPatternToNotes( pattern, type = "sharp" ){ //type = "sharp" or "flat" Pattern Accepts only array of note index
    const patternCopy = pattern.map(loc=>{
        return convertToNotes(loc, type);
    })
    return patternCopy;
}

export function convertToNotes(noteIndex, type = "sharp"){
    //-- This will get the note data of either sharps and flat
    const noteName = type == "sharp" ? standardNotes.onlySharp[noteIndex] : standardNotes.onlyFlat[noteIndex];
    //--
    //-- This will check if the data contains sharp or flat
    const parseNoteName = noteName.split("_");
    return parseNoteName[0] + (parseNoteName.length>1? (parseNoteName[1]=="sharp"?sharps[2]:flats[1]) : "")
    //--
}

export const standardNotes = {
    onlySharp:['A', 'A_sharp', 'B', 'C', 'C_sharp', 'D', 'D_sharp', 'E', 'F', 'F_sharp', 'G', 'G_sharp'],
    onlyFlat: ['A', 'B_flat', 'B', 'C', 'D_flat', 'D', 'E_flat', 'E', 'F', 'G_flat', 'G', 'A_flat'],
}


const sharps = ['#','#','♯','sharp','_#','_#','_♯','_sharp'];
const flats = ['b','♭','flat','_b','_♭','_flat'];
