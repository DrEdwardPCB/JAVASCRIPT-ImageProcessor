J=0
K=[]
function Blur() {
    var type = $("#blurtype").val()
    var x = parseInt($("#xkernalsize").val())
    var y = parseInt($("#ykernalsize").val())
    var stdev = parseFloat($("#stdev").val())
    var kernal = generateKernal(x, y, type, stdev)
    var canvas = document.getElementById("imageCanvas")
    var ctx = canvas.getContext('2d')
    var imageData = $.extend({}, ctx.getImageData(0, 0, canvas.width, canvas.height))
    var newimageData = $.extend({}, ctx.getImageData(0, 0, canvas.width, canvas.height))
    for (var i = 0; i < canvas.width; i++) {
        for (var j = 0; j < canvas.height; j++) {
            var index = (i + j * canvas.width) * 4
            var redchannel = []
            var greenchannel = []
            var bluechannel = []
            var participatedkernal=[]
            for (var k = 0; k < kernal.length; k++) {
                loop2:
                for (var l = 0; l < kernal[k].length; l++) {
                    if (i + (k - (kernal.length - 1) / 2) < 0 || i + (k - (kernal.length - 1) / 2) > canvas.width) {//check if larger than x boundary
                        continue loop2
                    }
                    /*if(j>canvas.height-3){
                        console.log(j)
                        console.log(canvas.height)
                        console.log(j + (l - (kernal[k].length - 1) / 2))
                        console.log(j + (l - (kernal[k].length - 1) / 2) > canvas.height)
                    }//testing use*/
                    if (j + (l - (kernal[k].length - 1) / 2) < 0 || j + (l - (kernal[k].length - 1) / 2) >= canvas.height) {//check if larger than y boundary
                        continue loop2
                    }
                    participatedkernal.push(kernal[k][l])
                }
            }
            for (var k = 0; k < kernal.length; k++) {
                loop2:
                for (var l = 0; l < kernal[k].length; l++) {
                    if (i + (k - (kernal.length - 1) / 2) < 0 || i + (k - (kernal.length - 1) / 2) > canvas.width) {//check if larger than x boundary
                        continue loop2
                    }
                    if (j + (l - (kernal[k].length - 1) / 2) < 0 || j + (l - (kernal[k].length - 1) / 2) >= canvas.height) {//check if larger than y boundary
                        continue loop2
                    }
                    var normalizationfactor=participatedkernal.reduce((accum,item)=>{return accum+=item},0)
                    var fromIndex = ((i + (k - (kernal.length - 1) / 2))+(j + (l - (kernal[k].length - 1) / 2))*canvas.width)*4
                    redchannel.push(imageData.data[fromIndex+0]*kernal[k][l]/normalizationfactor)
                    greenchannel.push(imageData.data[fromIndex+1]*kernal[k][l]/normalizationfactor)
                    bluechannel.push(imageData.data[fromIndex+2]*kernal[k][l]/normalizationfactor)
                }
            }
            
            if(i==canvas.height-1){
                K.push(participatedkernal)
            }
            

            newimageData.data[index+0]=redchannel.reduce((accum,item)=>{return accum+=item},0)
            newimageData.data[index+1]=greenchannel.reduce((accum,item)=>{return accum+=item},0)
            newimageData.data[index+2]=bluechannel.reduce((accum,item)=>{return accum+=item},0)
        }
    }
    alert("done")
    ctx.putImageData(new ImageData(new Uint8ClampedArray(newimageData.data), canvas.width, canvas.height), 0, 0)
}
function generateKernal(x, y, type, stdev) {
    var kernal = new Array(x)
    for (var i = 0; i < kernal.length; i++) {
        kernal[i] = new Array(y)
        for (var j = 0; j < kernal[i].length; j++) {
            if (type == 'box') {
                kernal[i][j] = 1
            } else if (type == "gau") {
                if (stdev == null) {
                    throw new Error("stdev has not been define yet")
                }
                kernal[i][j] = Math.pow(1 / (2 * Math.PI * stdev * stdev), ((i - (x - 1) / 2) * (i - (x - 1) / 2) + (j - (y - 1) / 2) * (j - (y - 1) / 2)) / (2 * stdev * stdev))
            }
        }
    }
    var total = kernal.reduce((accum, item) => {
        var sum = item.reduce((accum1, element) => {
            return accum1 += element
        }, 0)
        return accum += sum
    }, 0)
    kernal = kernal.map((item) => {
        return item.map((element) => {
            return element / total
        })
    })
    console.log(kernal)
    return kernal
}
function renderBlur() {
    html = ""
    html += "<form>"
    html += "<div class='form-group'><label for='blurtype'>Blur type</label>"
    html += "<select class='form-control' id='blurtype' value='box'>"
    html += "<option value='box'>box</option>"
    html += "<option value='gau'>gaussian</option>"
    html += "</select></div>"
    html += "<div class='form-group'><label for='xkernalsize'>x-kernal size</label>"
    html += "<select class='form-control' id='xkernalsize' value='3'>"
    html += "<option value='3'>3</option>"
    html += "<option value='5'>5</option>"
    html += "<option value='7'>7</option>"
    html += "<option value='9'>9</option>"
    html += "<option value='11'>11</option>"
    html += "<option value='13'>13</option>"
    html += "</select></div>"
    html += "<div class='form-group'><label for='ykernalsize'>y-kernal size</label>"
    html += "<select class='form-control' id='ykernalsize' value='3'>"
    html += "<option value='3'>3</option>"
    html += "<option value='5'>5</option>"
    html += "<option value='7'>7</option>"
    html += "<option value='9'>9</option>"
    html += "<option value='11'>11</option>"
    html += "<option value='13'>13</option>"
    html += "</select></div>"
    html += "<div class='form-group'><label for='stdev'>Stdev</label><input type='text' class='form-control' id='stdev' value='1'/></div>"
    html += "</form>"
    $("#functionSpecificForm").html(html)
}