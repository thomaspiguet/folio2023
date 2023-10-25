/* ~ Start: User Dropdown */
$("#user-cta").on("click", function (e) {
    e.preventDefault();

    if ($(this).hasClass("open")) {
        $(this).removeClass("open");
        // $(this).children("ul").slideUp(250);
    } else {
        $(this).addClass("open");
        // $(this).children("ul").slideDown(250);
    }
});
/* ~ End: User Dropdown */
/*
 * SideBar - Collapse
 */

//$(".sidebar-menu li .sidebar-item").click(function () {
//    var current_li = $(this).parent();
//    $(".sidebar-menu li .sidebar-item-view").each(function (i, el) {
//        if ($(el).parent().is(current_li)) {
//            // $(el).prev().toggleClass("sidebar-item-expanded");
//            $(el).slideToggle();
//        }
//        //else {
//        //    $(el).prev().removeClass("sidebar-item-expanded");
//        //    $(el).slideUp();
//        //}
//    });
//});

// $('.sidebar-menu li > .sidebar-item-view').hide();


/* ~ END: SideBar - Collapse */

$(".sidebar-menu li .sidebar-item").click(function () {
    var link = $(this);
    var closest_ul = link.closest("ul");
    var parallel_active_links = closest_ul.find(".active")
    var closest_li = link.closest("li");
    var link_status = closest_li.hasClass("active");
    var count = 0;

    closest_ul.find("ul").slideUp(250, function () {
        if (++count == closest_ul.find("ul").length)
            parallel_active_links.removeClass("active");
    });

    if (!link_status) {
        closest_li.children("ul").slideDown(250);
        closest_li.addClass("active");
    }
});


window.onload = function () {

    // Behavior ConnexHub (appSwitcher + overlay)
    settingConnexHub();

    // Behavior for Main Sidebar (Strom)
    mainSidebarToggleClass();

    settingScrollBar();

};



/*----------------------------
 counterUp js active
------------------------------ */
$('.counter').counterUp({
    delay: 10,
    time: 1000
});
/*----------------------------
 wowJs active
------------------------------ */
new WOW().init();