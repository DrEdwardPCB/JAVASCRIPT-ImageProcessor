
function sobel() {

    var direction = $("#direction").val()
    if (direction == "b") {
        var kx = generateXSobelKernal()
        var ky = generateYSobelKernal()
    } else if (direction == "x") {
        var kx = generateXSobelKernal()
        var ky = generateXSobelKernal()
    } else if (direction == "y") {
        var kx = generateYSobelKernal()
        var ky = generateYSobelKernal()
    }

    var canvas = document.getElementById("imageCanvas")
    var ctx = canvas.getContext('2d')
    var imageData = $.extend({}, ctx.getImageData(0, 0, canvas.width, canvas.height))
    var tempImageData = new Array(imageData.data.length)
    for (var i = 0; i < tempImageData; i++) {
        tempImageData[i] = imageData.data[i]
    }
    var newimageData = $.extend({}, ctx.getImageData(0, 0, canvas.width, canvas.height))
    //to grey

    for (var i = 0; i < canvas.width; i++) {
        for (var j = 0; j < canvas.height; j++) {
            J = j
            var index = (i + j * canvas.width) * 4
            var r = imageData.data[index + 0]//r
            var g = imageData.data[index + 1]//g
            var b = imageData.data[index + 2]//b

            var luma = r * 0.299 + g * 0.587 + b * 0.114

            imageData.data[index + 0] = luma
            imageData.data[index + 1] = luma
            imageData.data[index + 2] = luma

        }
    }

    //apply sobel
    var maxGR = 0
    var maxGG = 0
    var maxGB = 0
    for (var i = 0; i < canvas.width; i++) {
        for (var j = 0; j < canvas.height; j++) {
            var index = (i + j * canvas.width) * 4
            var Xredchannel = []
            var Xgreenchannel = []
            var Xbluechannel = []
            var Yredchannel = []
            var Ygreenchannel = []
            var Ybluechannel = []
            var participatedXkernal = []
            var participatedYkernal = []
            for (var k = 0; k < 3; k++) {
                loop2:
                for (var l = 0; l < 3; l++) {
                    if (i + (k - (3 - 1) / 2) < 0 || i + (k - (3 - 1) / 2) > canvas.width) {//check if larger than x boundary
                        continue loop2
                    }
                    if (j + (l - (3 - 1) / 2) < 0 || j + (l - (3 - 1) / 2) >= canvas.height) {//check if larger than y boundary
                        continue loop2
                    }
                    participatedXkernal.push(kx[k][l])
                    participatedXkernal.push(ky[k][l])
                }
            }
            for (var k = 0; k < 3; k++) {
                loop2:
                for (var l = 0; l < 3; l++) {
                    if (i + (k - (3 - 1) / 2) < 0 || i + (k - (3 - 1) / 2) > canvas.width) {//check if larger than x boundary
                        continue loop2
                    }
                    if (j + (l - (3 - 1) / 2) < 0 || j + (l - (3 - 1) / 2) >= canvas.height) {//check if larger than y boundary
                        continue loop2
                    }
                    var Xnormalizationfactor = participatedXkernal.reduce((accum, item) => { return accum += item }, 1)
                    var Ynormalizationfactor = participatedYkernal.reduce((accum, item) => { return accum += item }, 1)
                    var fromIndex = ((i + (k - (3 - 1) / 2)) + (j + (l - (3 - 1) / 2)) * canvas.width) * 4
                    Xredchannel.push(imageData.data[fromIndex + 0] * kx[k][l] / Xnormalizationfactor)
                    Xgreenchannel.push(imageData.data[fromIndex + 1] * kx[k][l] / Xnormalizationfactor)
                    Xbluechannel.push(imageData.data[fromIndex + 2] * kx[k][l] / Xnormalizationfactor)
                    Yredchannel.push(imageData.data[fromIndex + 0] * ky[k][l] / Ynormalizationfactor)
                    Ygreenchannel.push(imageData.data[fromIndex + 1] * ky[k][l] / Ynormalizationfactor)
                    Ybluechannel.push(imageData.data[fromIndex + 2] * ky[k][l] / Ynormalizationfactor)
                }
            }

            var currentR = Math.hypot(Xredchannel.reduce((accum, item) => { return accum += item }, 0), Yredchannel.reduce((accum, item) => { return accum += item }, 0))
            var currentG = Math.hypot(Xredchannel.reduce((accum, item) => { return accum += item }, 0), Yredchannel.reduce((accum, item) => { return accum += item }, 0))
            var currentB = Math.hypot(Xredchannel.reduce((accum, item) => { return accum += item }, 0), Yredchannel.reduce((accum, item) => { return accum += item }, 0))
            if (currentR > maxGR) {
                maxGR = currentR
            }
            if (currentG > maxGG) {
                maxGG = currentG
            }
            if (currentB > maxGB) {
                maxGB = currentB
            }
            tempImageData[index + 0] = currentR
            tempImageData[index + 1] = currentG
            tempImageData[index + 2] = currentB
        }
    }
    //normalization
    for (var i = 0; i < canvas.width; i++) {
        for (var j = 0; j < canvas.height; j++) {
            var index = (i + j * canvas.width) * 4
            newimageData.data[index + 0] = tempImageData[index + 0] / maxGR * 255
            newimageData.data[index + 1] = tempImageData[index + 1] / maxGG * 255
            newimageData.data[index + 2] = tempImageData[index + 2] / maxGB * 255
        }
    }
    alert("done")
    ctx.putImageData(new ImageData(new Uint8ClampedArray(newimageData.data), canvas.width, canvas.height), 0, 0)
}
function generateXSobelKernal() {
    var kernal = new Array(3)
    for (var i = 0; i < kernal.length; i++) {
        kernal[i] = new Array(3)
        for (var j = 0; j < kernal[i].length; j++) {
            if (i == 0 && j == 0) {
                kernal[i][j] = -1
            }
            if (i == 1 && j == 0) {
                kernal[i][j] = 0
            }
            if (i == 2 && j == 0) {
                kernal[i][j] = 1
            }
            if (i == 0 && j == 1) {
                kernal[i][j] = -2
            }
            if (i == 1 && j == 1) {
                kernal[i][j] = 0
            }
            if (i == 2 && j == 1) {
                kernal[i][j] = 2
            }
            if (i == 0 && j == 2) {
                kernal[i][j] = -1
            }
            if (i == 1 && j == 2) {
                kernal[i][j] = 0
            }
            if (i == 2 && j == 2) {
                kernal[i][j] = 1
            }
        }
    }
    console.log(kernal)
    return kernal
}
function generateYSobelKernal() {
    var kernal = new Array(3)
    for (var i = 0; i < kernal.length; i++) {
        kernal[i] = new Array(3)
        for (var j = 0; j < kernal[i].length; j++) {
            if (i == 0 && j == 0) {
                kernal[i][j] = 1
            }
            if (i == 1 && j == 0) {
                kernal[i][j] = 2
            }
            if (i == 2 && j == 0) {
                kernal[i][j] = 1
            }
            if (i == 0 && j == 1) {
                kernal[i][j] = 0
            }
            if (i == 1 && j == 1) {
                kernal[i][j] = 0
            }
            if (i == 2 && j == 1) {
                kernal[i][j] = 0
            }
            if (i == 0 && j == 2) {
                kernal[i][j] = -1
            }
            if (i == 1 && j == 2) {
                kernal[i][j] = -2
            }
            if (i == 2 && j == 2) {
                kernal[i][j] = -1
            }
        }
    }
    console.log(kernal)
    return kernal
}
function renderSobel() {
    html = ""
    html += "<form>"
    html += "<div class='form-group'><label for='direction'>Edge direction</label><select class='form-control' id='direction' value='b'><option value='b'>both</option><option value='x'>x only</option><option value='y'>y only</option></select></div>"
    html += "</form>"
    $("#functionSpecificForm").html(html)
}