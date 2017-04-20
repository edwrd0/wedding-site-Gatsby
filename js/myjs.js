$('.map-container')
    .click(function () {
        $(this).find('div').toggleClass('clicked')
    })
    .mouseleave(function () {
        $(this).find('div').removeClass('clicked')
    });