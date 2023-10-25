/*--------------------------------
      Accordion
--------------------------------*/
$(document).ready(function () {

    // only one collapsed item at the same time
    $(".accordion-only-one .accordion-set > a").on("click", function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $(this)
                .siblings(".accordion-content")
                .slideUp(200);
            $(".accordion-set > a i")
                .removeClass("fa-minus")
                .addClass("fa-plus");
        } else {
            $(".accordion-set > a i")
                .removeClass("fa-minus")
                .addClass("fa-plus");
            $(this)
                .find("i")
                .removeClass("fa-plus")
                .addClass("fa-minus");
            $(".accordion-set > a").removeClass("active");
            $(this).addClass("active");
            $(".accordion-content").slideUp(200);
            $(this)
                .siblings(".accordion-content")
                .slideDown(200);
        }
    });

    // multiple items presentation
    $(".accordion-multiple .accordion-set > a").on("click", function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $(this)
                .siblings(".accordion-content")
                .slideUp(200);
            $(this)
                .find("i")
                .removeClass("fa-minus")
                .addClass("fa-plus");
        } else {
            $(this)
                .find("i")
                .removeClass("fa-plus")
                .addClass("fa-minus");
            $(this).addClass("active");
            $(this)
                .siblings(".accordion-content")
                .slideDown(200);
        }
    });

    // multi-levels
    $(".accordion-multilevels .accordion-set > a").on("click", function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $(this)
                .siblings(".accordion-content")
                .slideUp(200);
            $(this)
                .find("i")
                .removeClass("fa-minus")
                .addClass("fa-plus");
        } else {
            $(this)
                .find("i")
                .removeClass("fa-plus")
                .addClass("fa-minus");
            $(this).addClass("active");
            $(this)
                .siblings(".accordion-content")
                .slideDown(200);
        }
    });


    $("#accordian a").click(function () {
        var link = $(this);
        var closest_ul = link.closest("ul");
        var parallel_active_links = closest_ul.find(".active")
        var closest_li = link.closest("li");
        var link_status = closest_li.hasClass("active");
        var count = 0;

        closest_ul.find("ul").slideUp(function () {
            if (++count == closest_ul.find("ul").length)
                parallel_active_links.removeClass("active");
        });

        if (!link_status) {
            closest_li.children("ul").slideDown();
            closest_li.addClass("active");
        }
    });

});