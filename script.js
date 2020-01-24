/*
-- JS controlled page styling --
*/

// When the base color is changed, accent and main change in relation.
// Window should maintain similar vibe no matter the base color.
let baseColor = [15,113,115]; // original base is [15,113,115] if your playing with this...
let accentColor = solveAccentColor(baseColor);
let mainColor = solveMainColor(baseColor);

const colorPicker = document.querySelector("#color-picker");
colorPicker.addEventListener('change', setBaseColor);
colorPicker.addEventListener('change', applyColors);

function setBaseColor() {
    baseColor = hexColorToRGB(this.value);
    accentColor = solveAccentColor(baseColor)
    mainColor = solveMainColor(baseColor);
}

function hexColorToRGB(hex) { //takes hex color (i.e. #efefef) and converts to rgb
    hex = hex.slice(1,hex.length);
    const rgb = [parseInt(Number("0x"+hex.slice(0,2)),10), parseInt(Number("0x"+hex.slice(02,4)),10), parseInt(Number("0x"+hex.slice(4,6)),10)];
    return rgb;
}

function solveAccentColor(base){
    let rgb = [base[0]+15,base[1]+123,base[2]+246]; // original [base[0]+223,base[1]+217,base[2]+246]
    for (i=0;i<rgb.length;i++){
        if (rgb[i] > 255){
            rgb[i] = rgb[i]-255;
        }
    }
    return rgb;
}

function solveMainColor(base){
    let rgb = [base[0]+123,base[1]+224,base[2]+15]; // original [base[0]+224,base[1]+18,base[2]+224]
    for (i=0;i<rgb.length;i++){
        if (rgb[i] > 255){
            rgb[i] = rgb[i]-255;
        }
    }
    return rgb;
}

// Push color changes to css
function applyColors() {
    document.documentElement.style.setProperty('--base-color', "rgb("+baseColor[0]+","+baseColor[1]+","+baseColor[2]+")");
    document.documentElement.style.setProperty('--accent-color', "rgb("+accentColor[0]+","+accentColor[1]+","+accentColor[2]+")");
    document.documentElement.style.setProperty('--main-color', "rgb("+mainColor[0]+","+mainColor[1]+","+mainColor[2]+")");
}

/*
-- The draw window --
*/

// Size of the draw window, must be a multiple of pixelHeight
const drawHeight = 512;
const drawWidth = drawHeight;

// Size of each pixel the user draws
const pixelHeight = 32;
const pixelWidth = pixelHeight;

const gridHeight = drawHeight/pixelHeight;
const gridWidth = gridHeight;

const draw = document.querySelector(".draw");
let numberOfPixels = gridHeight*gridWidth;

initialize();

function initialize() {
    draw.style.width = drawWidth+"px";
    draw.style.height = drawHeight+"px";

    // setup grid
    for (i=0;i<gridWidth;i++){
        draw.style.gridTemplateColumns = draw.style.gridTemplateColumns+" "+pixelWidth+"px";
        draw.style.gridTemplateRows = draw.style.gridTemplateRows+" "+pixelHeight+"px";
    }

    // fill grid with pixels
    for (i=0;i<numberOfPixels;i++){
        const blankPixel = document.createElement("div");
        blankPixel.classList.add("draw-pixel");
        blankPixel.setAttribute("id",i)
        draw.appendChild(blankPixel);
        document.getElementById(i).addEventListener('mouseover', pixelSelected);

    }
}

function pixelSelected(e) {
    if (!e.target.id){ // check if e.target.id exsists, prevents passing null through function on quick mouse movements.
        return;
    }
    const pixel = document.getElementById(e.target.id);
    pixel.setAttribute('data-selected','true');
    pixel.classList.add("black");
    updatePreview();
}

/*
-- Preview window on the right --
*/

const canvas = document.getElementById("preview");
const ctx = canvas.getContext("2d");
const viewContainer = document.getElementById("view-container");

canvas.width = gridWidth;   // preview size is the grid converted to actual pixels
canvas.height = gridHeight;
viewContainer.style.width = gridWidth+"px";
viewContainer.style.height = gridHeight+"px";

function updatePreview() {
    let pixelID = 0;

    let imgData = ctx.createImageData(1, 1);

    for (i=0;i<gridHeight;i++) {
        for (o=0;o<gridWidth;o++) {
            if (document.getElementById(pixelID).getAttribute("data-selected")){
                imgData.data[0] = 0;
                imgData.data[1] = 0;
                imgData.data[2] = 0;
                imgData.data[3] = 255; //black
            }else{
                imgData.data[0] = 0;
                imgData.data[1] = 0;
                imgData.data[2] = 0;
                imgData.data[3] = 0; //transparent
            }

            ctx.putImageData(imgData,o,i);            

            pixelID++;
        }
    }
}

/* -- Preview window scale-- */
let scale = 1;
// Listeners of the scale buttons
document.getElementById("scale1").addEventListener('click', setPreviewScale);
document.getElementById("scale2").addEventListener('click', setPreviewScale);
document.getElementById("scale4").addEventListener('click', setPreviewScale);

//set the scale and make changes css styling to prevent wrecking the page
function setPreviewScale(e) {  
    const newScale = e.target.id;
    if (newScale === "scale4"){
        scale = 4;
        canvas.style.scale = scale;
        canvas.style.transform = `translateY(${((gridWidth*scale)-gridWidth)/(scale*2)}px)`;
        viewContainer.style.width = (gridWidth*scale)+"px";
        viewContainer.style.height = (gridHeight*scale)+"px";
    }else if (newScale === "scale2"){
        scale = 2;
        canvas.style.scale = scale;
        canvas.style.transform = `translateY(${((gridWidth*scale)-gridWidth)/(scale*2)}px)`;
        viewContainer.style.width = (gridWidth*scale)+"px";
        viewContainer.style.height = (gridHeight*scale)+"px";
    }else if (newScale === "scale1") {
        scale = 1;
        canvas.style.scale = scale;
        canvas.style.transform = "translateY(0)"
        viewContainer.style.width = gridWidth+"px";
        viewContainer.style.height = gridHeight+"px";
    }
}


/*
-- Save link on the right --
*/

const saveButton = document.getElementById("save");
saveButton.addEventListener('click',prepareImage);

function prepareImage() {
    image = canvas.toDataURL("image/svg");
    saveButton.setAttribute("href",image);
    click.saveButton;
}