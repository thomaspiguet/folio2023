/*--------------------------------
      Forms - Advanced Form
--------------------------------*/

$(document).ready(function () {
    /******************
    * select2 multiple *
    *******************/
        var data = [];
        var placeholder = "Multi select to create a groupe in the table";
        $(".mySelect").select2({
            data: data,
            placeholder: placeholder,
            allowClear: false,
            minimumResultsForSearch: 5
        });
    /******************
    * select2 & search *
    *******************/
    $('.js-example-basic-single').select2();
    /******************
    * daterangepicker *
    *******************/
    $('#singledatepicker-1').daterangepicker({
        "singleDatePicker": true,
        "drops": "up"
    }, function (start, end, label) {
        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    });
    $('#singledatepicker-2').daterangepicker({
        "singleDatePicker": true,
        "drops": "up"
    }, function (start, end, label) {
        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    });
    $('#daterange-1').daterangepicker({
        "drops": "up"
    }, function (start, end, label) {
        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    });
    $('#daterange-2').daterangepicker({
        "startDate": "11/24/2018",
        "endDate": "12/30/2018",
        "drops": "up"
    }, function (start, end, label) {
        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    });
    $('#daterange-3').daterangepicker({
        "timePicker": true,
        "drops": "up"
    }, function (start, end, label) {
        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    });

}); // END Forms


