let isMouseDown = false;

document.body.onmousedown = (() => isMouseDown = true);
document.body.onmouseup = (() => isMouseDown = false);

/*
-- The draw window --
*/

// Size of the draw window, must be a multiple of pixelHeight
const drawHeight = 1024;
const drawWidth = drawHeight;

// Size of each pixel the user draws
const pixelHeight = 64;
const pixelWidth = pixelHeight;

const gridHeight = drawHeight/pixelHeight;
const gridWidth = gridHeight;

const draw = document.querySelector(".draw");
let numberOfPixels = gridHeight*gridWidth;

function initializeDrawArea() {
    document.documentElement.style.setProperty('--draw-width', drawWidth);
    document.documentElement.style.setProperty('--draw-height', drawHeight);

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
        document.getElementById(i).addEventListener('click', pixelClicked);
        document.getElementById(i).addEventListener('mousemove', pixelDrag);

    }
}

function pixelClicked(e) {
    pixelSelected(e);
}

function pixelDrag(e) {
    if (isMouseDown) {
        pixelSelected(e);
    }
}

// alterting the selected pixel
function pixelSelected(e) {
    if (!e.target.id){return;} // check if e.target.id exsists, prevents passing null through function on quick mouse movements.
    const pixel = document.getElementById(e.target.id);
    pixel.setAttribute('data-selected','true');
    pixel.setAttribute('data-color', currentColor);
    pixel.style.setProperty('background-color', currentColor);
    updatePreview();
}

// changing the color
let currentColor = '#000000';
const colorPicker = document.querySelector("#color-picker");
colorPicker.addEventListener('change',() => {
    currentColor = colorPicker.value
    document.documentElement.style.setProperty('--current-color', currentColor);
});

// Zoom in and out on scroll wheel
let scale = 0.5;

window.addEventListener('wheel', function(e){
    if (e.deltaY < 0) {
        zoom("in");
    } else if (e.deltaY >0) {
        zoom("out");
    }
});

function zoom(direction){
    if (direction == "in") {
        scale = scale + 0.05;    // Using a non-interger value here causes --very-- odd decimals.
    } else if (direction == "out") {
         scale = scale - 0.05;
    }
    scale = Math.round((scale*100))/100; //round to a single decimal point.
    if (scale < 0.1) {
        scale = 0.1;
    }else if (scale > 3) {
        scale = 3;
    }
    scaleDraw();
    console.log(scale);
}

// Change the size of the draw area and its pixels
function scaleDraw() {
    draw.style.gridTemplateColumns = '';
    draw.style.gridTemplateRows = '';

    draw.style.width = drawWidth*scale+"px";
    draw.style.height = drawHeight*scale+"px";

    for (i=0;i<gridWidth;i++){
        draw.style.gridTemplateColumns = draw.style.gridTemplateColumns+" "+pixelWidth*scale+"px";
        draw.style.gridTemplateRows = draw.style.gridTemplateRows+" "+pixelHeight*scale+"px";
    }
}

// Disable scrolling with the mouse wheel
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;  
}
  
  function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    document.addEventListener('wheel', preventDefault, {passive: false}); // Disable scrolling in Chrome
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
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
                const pixelColor = hexColorToRGB(document.getElementById(pixelID).getAttribute('data-color'));
                imgData.data[0] = pixelColor[0];
                imgData.data[1] = pixelColor[1];
                imgData.data[2] = pixelColor[2];
                imgData.data[3] = 255; // Full Alpha
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
let previewScale = 1;
// Listeners of the previewScale buttons
document.getElementById("previewScale1").addEventListener('click', setPreviewScale);
document.getElementById("previewScale2").addEventListener('click', setPreviewScale);
document.getElementById("previewScale4").addEventListener('click', setPreviewScale);

//set the previewScale and make changes css styling to prevent wrecking the page
function setPreviewScale(e) {  

    console.log(e);

    const newpreviewScale = e.target.id;
    if (newpreviewScale === "previewScale4"){
        previewScale = 4;
        canvas.style.scale = previewScale;
        canvas.style.transform = `translateY(${((gridWidth*previewScale)-gridWidth)/(previewScale*2)}px)`;
        viewContainer.style.width = (gridWidth*previewScale)+"px";
        viewContainer.style.height = (gridHeight*previewScale)+"px";
    }else if (newpreviewScale === "previewScale2"){
        previewScale = 2;
        canvas.style.scale = previewScale;
        canvas.style.transform = `translateY(${((gridWidth*previewScale)-gridWidth)/(previewScale*2)}px)`;
        viewContainer.style.width = (gridWidth*previewScale)+"px";
        viewContainer.style.height = (gridHeight*previewScale)+"px";
    }else if (newpreviewScale === "previewScale1") {
        previewScale = 1;
        canvas.style.scale = previewScale;
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

/*
-- JS controlled page styling --
*/

// When the base color is changed, accent and main change in relation.
// Window should maintain similar vibe no matter the base color.
let baseColor = [15,113,115]; // original base is [15,113,115] if your playing with this...
let accentColor = solveAccentColor(baseColor);
let mainColor = solveMainColor(baseColor);

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

initializeDrawArea();
scaleDraw();
disableScroll();