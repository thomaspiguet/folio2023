/* ------------------------------- 
    Global DataTable JS
------------------------------- */

/*  -----------------------------------------------------------------------------------------
    DataTables Features & Options
    -----------------------------------------------------------------------------------------

    $('#example').dataTable( {
        "drawCallback": function (oSettings) {
            customInitStyleDataTables();
        },
        "paging":   false,
        "ordering": false,
        "info":     false,
        "autoWidt": false,
        "lengthChange": false,
        "lengthMenu": [ 10, 25, 50, 75, 100 ],
        "pageLength": 50,
        "scrollX": true,
        "scrollY": "200px",
        "scrollCollapse": true,
        "searching": false,
        "dom": '<"wrapper"flipt>',
        "order": [[ 0, 'asc' ], [ 1, 'asc' ]],
        "pagingType": "full_numbers",
        "stripeClasses": [],

    } );


"drawCallback":===> Function that is called every time DataTables performs a draw.

"paging": false / true ===> Enable or disable table pagination.


"ordering": false / true ===> Enable or disable ordering of columns - it is as simple as that! DataTables, by default, allows end users to click on the header cell for each column, ordering the table by the data in that column. The ability to order data can be disabled using this option.


"info": false / true ===> When this option is enabled, Datatables will show information about the table including information about filtered data if that action is being performed. This option allows that feature to be enabled or disabled.


"autoWidt": false / true ===> with autoWidth = FALSE is that the width option for columns will not work, so if you want to configure widths for columns, you have to use autoWidth = TRUE


"lengthChange": false / true ===> When pagination is enabled, this option will control the display of an option for the end user to change number of records to be shown per page. The options shown in the list are controlled by the lengthMenu configuration option.


"lengthMenu": false / true ===> This parameter allows you to readily specify the entries in the length drop down select list that DataTables shows when pagination is enabled


"pageLength": false / true ===> Number of rows to display on a single page when using pagination. If lengthChange is feature enabled (it is by default) then the end user will be able to override the value set here to a custom setting using a pop-up menu (see lengthMenu).


"scrollX": false / true ===> false - No horizontal scrolling and true - Enable horizontal scrolling in the table


"scrollY": false / true ===> Enable vertical scrolling. Vertical scrolling will constrain the DataTable to the given height, and enable scrolling for any data which overflows the current viewport.The following options are directly related and may also be useful in your application development.(scrollCollapse / paging)


"scrollCollapse": false / true ===> When vertical (y) scrolling is enabled through the use of the scrollY option, DataTables will force the height of the table's viewport to the given height at all times (useful for layout).


"searching": false / true ===> Feature control search (filtering) abilities.


"dom":  ===> https://datatables.net/reference/option/dom


"order":  ===> Using this parameter you can define which column(s) the order is performed upon, and the ordering direction. The order must be an array of arrays, each inner array comprised of two elements.


"stripeClasses": [],===> remove odd and even (add inline class="table-striped")


"pagingType":  ===> Which buttons are shown in the pagination control are defined by the option given here.
                    numbers - Page number buttons only (1.10.8)
                    simple - 'Previous' and 'Next' buttons only
                    simple_numbers - 'Previous' and 'Next' buttons, plus page numbers
                    full - 'First', 'Previous', 'Next' and 'Last' buttons
                    full_numbers - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
                    first_last_numbers - 'First' and 'Last' buttons, plus page numbers


 There are times when you might find it useful to display only a sub-set of the information that was available in the original table

        "columnDefs": [
            {
                "targets": [ 2 ],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [ 3 ],
                "visible": false
            }
        ]

------------------------------- */


// custom style DataTables
function customInitStyleDataTables() {
    // ----- th ------------------------------------//
    // ----- th - init ------------------------------------//
    // $('tr').css('text-align', 'center');
    $('th.sorting').css('background-image', 'none');
    $('th.sorting_desc').css('background-image', 'none');
    $('th.sorting_asc').css('background-image', 'none');

    $('tbody .select-checkbox').click(function () {
        //$('tr.custom-selected').removeClass('custom-selected');
        //$(this).parent().addClass('custom-selected');
        if ($(this).parent().hasClass('selected')) {
            $(this).html('');
        } else {
            $(this).html('<i class="fa fa-check"></i>');
        }
        // $(this).append('<i class="fa fa-check"><i>');
    });
}


$(document).ready(function () {
    // ...
}); 