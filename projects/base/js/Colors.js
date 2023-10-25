/* ------------------------------------------
    Get the BGColor of element in HEX
--------------------------------------------- */

$(document).ready(function () {
    $('.color-palette-item').each(function () {
        var color = '';
        var currentElement = $(this);
        var currentElementId = $(this).attr("id");

        var x = currentElement.css('backgroundColor');
        function hexc(colorval) {
            var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            delete (parts[0]);
            for (var i = 1; i <= 3; ++i) {
                parts[i] = parseInt(parts[i]).toString(16);
                if (parts[i].length == 1) parts[i] = '0' + parts[i];
            }
            color = '#' + parts.join('');
        }
        hexc(x);
        // currentElement.append('<span class="color-code">hex:&nbsp;' + color + '</span>');
        $('#' + currentElementId + ' ' + 'span.color-class').append(color);
    })
}); 