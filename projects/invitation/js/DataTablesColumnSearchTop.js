/*--------------------------------
      DataTables example-4
--------------------------------*/

// to initialise the DataTables examples



$(document).ready(function () {
    // Setup - add a text input to each footer cell
    $('#example-4 thead tr:eq(1) th').each(function () {
        var title = $(this).text();
        $(this).html('<input type="text" placeholder="Search ' + title + '" class="column_search" />');
    });

    // DataTable
    var table = $('#example-4').DataTable({
        orderCellsTop: true,
        //fixedHeader: true,
        //"ordering": false,
        scrollX: true,
        searching: true,
        paging: false,
        info: false,
        pageLength: false
        //pageLength: 25
    });

    // Apply the search
    $('#example-4 thead').on('keyup', ".column_search", function () {

        table
            .column($(this).parent().index())
            .search(this.value)
            .draw();
    });

});