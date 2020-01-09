
function canny() {

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
    var kernal = generateKernal(7, 7, "gau", 3)
    var canvas = document.getElementById("imageCanvas")
    var ctx = canvas.getContext('2d')
    var imageData = $.extend({}, ctx.getImageData(0, 0, canvas.width, canvas.height))
    var tempImageData = new Array(imageData.data.length)
    var gradientImageData = new Array(imageData.data.length)
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
    //blur
    for (var i = 0; i < canvas.width; i++) {
        for (var j = 0; j < canvas.height; j++) {
            var index = (i + j * canvas.width) * 4
            var redchannel = []
            var greenchannel = []
            var bluechannel = []
            var participatedkernal = []
            for (var k = 0; k < kernal.length; k++) {
                loop2:
                for (var l = 0; l < kernal[k].length; l++) {
                    if (i + (k - (kernal.length - 1) / 2) < 0 || i + (k - (kernal.length - 1) / 2) > canvas.width) {//check if larger than x boundary
                        continue loop2
                    }
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
                    var normalizationfactor = participatedkernal.reduce((accum, item) => { return accum += item }, 0)
                    var fromIndex = ((i + (k - (kernal.length - 1) / 2)) + (j + (l - (kernal[k].length - 1) / 2)) * canvas.width) * 4
                    redchannel.push(imageData.data[fromIndex + 0] * kernal[k][l] / normalizationfactor)
                    greenchannel.push(imageData.data[fromIndex + 1] * kernal[k][l] / normalizationfactor)
                    bluechannel.push(imageData.data[fromIndex + 2] * kernal[k][l] / normalizationfactor)
                }
            }

            if (i == canvas.height - 1) {
                K.push(participatedkernal)
            }


            tempImageData[index + 0] = redchannel.reduce((accum, item) => { return accum += item }, 0)
            tempImageData[index + 1] = greenchannel.reduce((accum, item) => { return accum += item }, 0)
            tempImageData[index + 2] = bluechannel.reduce((accum, item) => { return accum += item }, 0)
        }
    }
    imageData.data = $.extend([], tempImageData)
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
            var currentG = Math.hypot(Xgreenchannel.reduce((accum, item) => { return accum += item }, 0), Ygreenchannel.reduce((accum, item) => { return accum += item }, 0))
            var currentB = Math.hypot(Xbluechannel.reduce((accum, item) => { return accum += item }, 0), Ybluechannel.reduce((accum, item) => { return accum += item }, 0))
            var currentGradient = Math.atan2(
                0.299 * Yredchannel.reduce((accum, item) => { return accum += item }, 0) + 0.587 * Ygreenchannel.reduce((accum, item) => { return accum += item }, 0) + 0.114 * Ybluechannel.reduce((accum, item) => { return accum += item }, 0),
                0.299 * Xredchannel.reduce((accum, item) => { return accum += item }, 0) + 0.587 * Xgreenchannel.reduce((accum, item) => { return accum += item }, 0) + 0.114 * Xbluechannel.reduce((accum, item) => { return accum += item }, 0)
            ) * 180 / Math.PI
            if(currentGradient<0){
                currentGradient+=180
            }
            gradientImageData[index] = currentGradient
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
            tempImageData[index + 0] = tempImageData[index + 0] / maxGR * 255
            tempImageData[index + 1] = tempImageData[index + 1] / maxGG * 255
            tempImageData[index + 2] = tempImageData[index + 2] / maxGB * 255
        }
    }
    //supress non max
    var tempImageDataNonMaxHold = new Array(imageData.data.length)
    for (var i = 0; i < canvas.width; i++) {
        for (var j = 0; j < canvas.height; j++) {
            var index = (i + j * canvas.width) * 4
            //kernal
            try {
                var edge1 = 255
                var edge2 = 255

                var indextl = ((i - 1) + (j - 1) * canvas.width) * 4
                var indextt = ((i) + (j - 1) * canvas.width) * 4
                var indextr = ((i + 1) + (j - 1) * canvas.width) * 4
                var indexml = ((i - 1) + (j) * canvas.width) * 4
                var indexmr = ((i + 1) + (j) * canvas.width) * 4
                var indexbl = ((i - 1) + (j + 1) * canvas.width) * 4
                var indexbb = ((i) + (j + 1) * canvas.width) * 4
                var indexbr = ((i + 1) + (j + 1) * canvas.width) * 4
                if (gradientImageData[index] >= 0 && gradientImageData[index] < 22.5 || gradientImageData[index] >= 157.5 && gradientImageData[index] <= 180) {
                    edge1 = tempImageData[indexml] * 0.299 + tempImageData[indexml + 1] * 0.587 + tempImageData[indexml + 2] * 0.114
                    edge2 = tempImageData[indexmr] * 0.299 + tempImageData[indexmr + 1] * 0.587 + tempImageData[indexmr + 2] * 0.114
                }
                else if (gradientImageData[index] >= 22.5 && gradientImageData[index] < 67.5) {
                    edge1 = tempImageData[indexbl] * 0.299 + tempImageData[indexbl + 1] * 0.587 + tempImageData[indexbl + 2] * 0.114
                    edge2 = tempImageData[indextr] * 0.299 + tempImageData[indextr + 1] * 0.587 + tempImageData[indextr + 2] * 0.114
                }
                else if (gradientImageData[index] >= 67.5 && gradientImageData[index] < 112.5) {
                    edge1 = tempImageData[indextt] * 0.299 + tempImageData[indextt + 1] * 0.587 + tempImageData[indextt + 2] * 0.114
                    edge2 = tempImageData[indexbb] * 0.299 + tempImageData[indexbb + 1] * 0.587 + tempImageData[indexbb + 2] * 0.114
                }
                else if (gradientImageData[index] >= 112.5 && gradientImageData[index] < 157.5) {
                    edge1 = tempImageData[indexbr] * 0.299 + tempImageData[indexbr + 1] * 0.587 + tempImageData[indexbr + 2] * 0.114
                    edge2 = tempImageData[indextl] * 0.299 + tempImageData[indextl + 1] * 0.587 + tempImageData[indextl + 2] * 0.114
                }else{
                    console.log("unexpected")
                    console.log(gradientImageData[index])
                }
                if (tempImageData[index] > edge1 && tempImageData[index] > edge2) {
                    tempImageDataNonMaxHold[index] = tempImageData[index] * 0.299 + tempImageData[index + 1] * 0.587 + tempImageData[index + 2] * 0.114
                    tempImageDataNonMaxHold[index + 1] = tempImageData[index] * 0.299 + tempImageData[index + 1] * 0.587 + tempImageData[index + 2] * 0.114
                    tempImageDataNonMaxHold[index + 2] = tempImageData[index] * 0.299 + tempImageData[index + 1] * 0.587 + tempImageData[index + 2] * 0.114
                    tempImageDataNonMaxHold[index + 3] = 255
                } else {
                    tempImageDataNonMaxHold[index] = 0
                    tempImageDataNonMaxHold[index + 1] = 0
                    tempImageDataNonMaxHold[index + 2] = 0
                    tempImageDataNonMaxHold[index + 3] = 255
                }
            } catch (err) {
                console.log(err)
            }
        }
    }
    //double threshold
    var upperthresholdratio = 0.09
    var lowerthresholdratio = 0.05
    var maxIntensity = 0
    var tempImageDataStrong = new Array(imageData.data.length)
    var tempImageDataWeak = new Array(imageData.data.length)
    for (var i = 0; i < canvas.width; i++) {
        for (var j = 0; j < canvas.height; j++) {
            var index = (i + j * canvas.width) * 4
            var currentGrey = tempImageDataNonMaxHold[index] * 0.299 + tempImageDataNonMaxHold[index + 1] * 0.587 + tempImageDataNonMaxHold[index + 2] * 0.114
            if (currentGrey > maxIntensity) {
                maxIntensity = currentGrey
            }
        }
    }
    var highthreshold = maxIntensity * upperthresholdratio
    var lowthreshold = highthreshold * lowerthresholdratio
    for (var i = 0; i < canvas.width; i++) {
        for (var j = 0; j < canvas.height; j++) {
            var index = (i + j * canvas.width) * 4
            var currentGrey = tempImageDataNonMaxHold[index] * 0.299 + tempImageDataNonMaxHold[index + 1] * 0.587 + tempImageDataNonMaxHold[index + 2] * 0.114
            if (currentGrey > highthreshold) {
                tempImageDataStrong[index] = 255
                tempImageDataStrong[index + 1] = 255
                tempImageDataStrong[index + 2] = 255
                tempImageDataStrong[index + 3] = 255
                tempImageDataWeak[index] = 0
                tempImageDataWeak[index + 1] = 0
                tempImageDataWeak[index + 2] = 0
                tempImageDataWeak[index + 3] = 255
            } else if (currentGrey > lowthreshold) {
                tempImageDataStrong[index] = 0
                tempImageDataStrong[index + 1] = 0
                tempImageDataStrong[index + 2] = 0
                tempImageDataStrong[index + 3] = 255
                tempImageDataWeak[index] = 255
                tempImageDataWeak[index + 1] = 255
                tempImageDataWeak[index + 2] = 255
                tempImageDataWeak[index + 3] = 255
            } else {
                tempImageDataStrong[index] = 0
                tempImageDataStrong[index + 1] = 0
                tempImageDataStrong[index + 2] = 0
                tempImageDataStrong[index + 3] = 255
                tempImageDataWeak[index] = 0
                tempImageDataWeak[index + 1] = 0
                tempImageDataWeak[index + 2] = 0
                tempImageDataWeak[index + 3] = 255
            }
        }
    }
    console.log(tempImageDataStrong)
    console.log(tempImageDataWeak)
    console.log("double threshold done")
    //Hysteresis
    for (var i = 0; i < canvas.width; i++) {
        for (var j = 0; j < canvas.height; j++) {
            var index = (i + j * canvas.width) * 4
            var hasStrong = false
            if (tempImageDataStrong[index] == 255) {
                newimageData.data[index] = 255
                newimageData.data[index + 1] = 255
                newimageData.data[index + 2] = 255
                newimageData.data[index + 3] = 255
            } else if (tempImageDataWeak[index] == 255) {
                //check for strong pixel nearbyu
                if (i + 1 <= canvas.width) {
                    if (j + 1 <= canvas.height) {
                        if (tempImageDataStrong[(((i + 1) + (j + 1) * canvas.width) * 4) + 0] == 255) {
                            hasStrong = true
                        }
                    }
                    if (j - 1 >= 0) {
                        if (tempImageDataStrong[(((i + 1) + (j - 1) * canvas.width) * 4) + 0] == 255) {
                            hasStrong = true
                        }
                    }
                    if (tempImageDataStrong[(((i + 1) + (j) * canvas.width) * 4) + 0] == 255) {
                        hasStrong = true
                    }
                }
                if (i - 1 >= 0) {
                    if (j + 1 <= canvas.height) {
                        if (tempImageDataStrong[(((i - 1) + (j + 1) * canvas.width) * 4) + 0] == 255) {
                            hasStrong = true
                        }
                    }
                    if (j - 1 >= 0) {
                        if (tempImageDataStrong[(((i - 1) + (j - 1) * canvas.width) * 4) + 0] == 255) {
                            hasStrong = true
                        }
                    }
                    if (tempImageDataStrong[(((i - 1) + (j) * canvas.width) * 4) + 0] == 255) {
                        hasStrong = true
                    }
                }
                if (j + 1 <= canvas.height) {
                    if (tempImageDataStrong[(((i) + (j + 1) * canvas.width) * 4) + 0] == 255) {
                        hasStrong = true
                    }
                }
                if (j - 1 >= 0) {
                    if (tempImageDataStrong[(((i) + (j - 1) * canvas.width) * 4) + 0] == 255) {
                        hasStrong = true
                    }
                }
                //if strong pixel nearby recognize as strong
                if (hasStrong) {
                    newimageData.data[index] = 255
                    newimageData.data[index + 1] = 255
                    newimageData.data[index + 2] = 255
                    newimageData.data[index + 3] = 255
                    tempImageDataStrong[index] = 255
                    tempImageDataStrong[index + 1] = 255
                    tempImageDataStrong[index + 2] = 255
                    tempImageDataStrong[index + 3] = 255
                } else {
                    newimageData.data[index] = 0
                    newimageData.data[index + 1] = 0
                    newimageData.data[index + 2] = 0
                    newimageData.data[index + 3] = 255
                }
            } else {
                newimageData.data[index] = 0
                newimageData.data[index + 1] = 0
                newimageData.data[index + 2] = 0
                newimageData.data[index + 3] = 255
            }
        }
    }
    console.log("hysteresis done")
    console.log(newimageData.data)
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
function renderCanny() {
    html = ""
    html += "<form>"
    html += "<div class='form-group'><label for='direction'>Edge direction</label><select class='form-control' id='direction' value='b'><option value='b'>both</option><option value='x'>x only</option><option value='y'>y only</option></select></div>"
    html += "</form>"
    $("#functionSpecificForm").html(html)
}