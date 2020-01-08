var imageLoader 
var image 
var canvas 
var ctx 
$(document).ready(function () {
    imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);
    image = document.getElementById('Image')
    canvas = document.getElementById('imageCanvas');
    ctx = canvas.getContext('2d');
    renderForm()
    $("#execute").on("click", function(){
        if($("#function").val()=="filter"){
            filter()
        }
        if($("#function").val()=="blur"){
            Blur()
        }
        if($("#function").val()=="sobel"){
            sobel()
        }
        if($("#function").val()=="cannyedge"){
            canny()
        }
    })
})
function renderForm(){
    if($("#function").val()=="filter"){
        renderFilter()
    }
    if($("#function").val()=="blur"){
        renderBlur()
    }
    if($("#function").val()=="sobel"){
        renderSobel()
    }
    if($("#function").val()=="cannyedge"){
        renderCanny()
    }
}


function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            image.width = img.width
            image.height = img.height
        }
        img.src = event.target.result;
        image.src = event.target.result

    }
    reader.readAsDataURL(e.target.files[0]);
}
