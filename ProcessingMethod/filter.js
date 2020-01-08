J=0
function filter() {
    var type = $("#filtertype").val()
    var canvas = document.getElementById("imageCanvas")
    var ctx = canvas.getContext('2d')
    var imageData = $.extend({},ctx.getImageData(0, 0, canvas.width, canvas.height))
    for (var i = 0; i < canvas.width; i++) {
        for (var j = 0; j < canvas.height; j++) {
            J=j
            var index = (i + j * canvas.width) * 4
            var r = imageData.data[index + 0]//r
            var g = imageData.data[index + 1]//g
            var b = imageData.data[index + 2]//b
            var a = imageData.data[index + 3]//a
            if (type == 'bw') {
                var luma = r * 0.299 + g * 0.587 + b * 0.114

                imageData.data[index + 0] = luma
                imageData.data[index + 1] = luma
                imageData.data[index + 2] = luma
            } else if (type == 's') {
                var tr = (r * 0.393) + (g * 0.769) + (b * 0.189);
                var tg = (r * 0.349) + (g * 0.686) + (b * 0.168);
                var tb = (r * 0.272) + (g * 0.534) + (b * 0.131);
                imageData.data[index + 0] = tr
                imageData.data[index + 1] = tg
                imageData.data[index + 2] = tb
            } else if (type == 'i') {
                imageData.data[index + 0] = 255-r
                imageData.data[index + 1] = 255-g
                imageData.data[index + 2] = 255-b
            }
        }
    }
    ctx.putImageData(new ImageData(new Uint8ClampedArray(imageData.data),canvas.width,canvas.height), 0, 0)
}
function renderFilter() {
    html = ""
    html += "<form>"
    html += "<div class='form-group'><label for='filtertype'>Filter type</label><select class='form-control' id='filtertype' value='bw'><option value='bw'>black and white</option><option value='s'>Sepia</option><option value='i'>invert</option></select></div>"
    html += "</form>"
    $("#functionSpecificForm").html(html)
}