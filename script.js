const easHeight = 512;
const easWidth = easHeight;

const pixelHeight = 8;
const pixelWidth = pixelHeight;

const gridHeight = easHeight/pixelHeight;
const gridWidth = gridHeight;

const eas = document.querySelector(".eas");
let numberOfPixels = gridHeight*gridWidth;

initialize();

function initialize() {
    eas.style.width = easWidth+"px";
    eas.style.height = easHeight+"px";

    // setup grid
    for (i=0;i<gridWidth;i++){
        eas.style.gridTemplateColumns = eas.style.gridTemplateColumns+" "+pixelWidth+"px";
        eas.style.gridTemplateRows = eas.style.gridTemplateRows+" "+pixelHeight+"px";
    }

    // fill grid with pixels
    for (i=0;i<numberOfPixels;i++){
        const blankPixel = document.createElement("div");
        blankPixel.classList.add("eas-pixel");
        blankPixel.setAttribute("id",i)
        eas.appendChild(blankPixel);
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
    updateView();
}

const canvas = document.getElementById("view");
const ctx = canvas.getContext("2d");
canvas.width = gridWidth;   // viewport size is the grid converted to pixels
canvas.height = gridHeight;

function updateView() {
    let pixelID = 0;

    let imgData = ctx.createImageData(1, 1);

    for (i=0;i<gridHeight;i++) {
        for (o=0;o<gridWidth;o++) {
            if (document.getElementById(pixelID).getAttribute("data-selected")){
                imgData.data[0] = 0;
                imgData.data[1] = 0;
                imgData.data[2] = 0;
                imgData.data[3] = 225;
            }else{
                imgData.data[0] = 0;
                imgData.data[1] = 0;
                imgData.data[2] = 0;
                imgData.data[3] = 0;
            }

            ctx.putImageData(imgData,o,i);            

            pixelID++;
        }
    }
}

const saveButton = document.getElementById("save");
saveButton.addEventListener('click',prepareImage);

function prepareImage() {
    image = canvas.toDataURL("image/png");
    saveButton.setAttribute("href",image);
    click.saveButton;
}