$('.tooltip').tooltipster({
    theme: 'tooltipster',
    'maxWidth': 450,
    contentAsHTML: true,
    trigger: 'custom',
    multiple: true,
    contentCloning: 10,
    state: 'appearing',
    content: $('<div class="tooltipster-box-content"><ul class=""><li><div class="badge-round-small bg-sub-brand-light-blue" data-icon="supervisor_account"></div></li><li><div class="badge-round-small bg-sub-brand-light-blue" data-icon="account_box"></div></li><li><div class="badge-round-small bg-sub-brand-light-blue" data-icon="airline_seat_flat"></div></li><li><div class="badge-round-small bg-sub-brand-light-blue" data-icon="local_drink"></div></li></ul></div>'),
    triggerOpen: {
        click: true,
        tap: true,
        mouseenter: true
    },
    triggerClose: {
        click: true,
        scroll: false,
        tap: true
    }
});