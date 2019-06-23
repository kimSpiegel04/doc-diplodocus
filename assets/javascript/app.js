$('.item-container').click(function() {
    $('.button-container').not($(this).next()).hide(200);
    $(this).next('.button-container').toggle(400);
});   