$(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        // $('#sidebarCollapse').html('<i class="fas fa-chevron-left fa-lg"</i>');
    });

});

//INDEX
itemList=[];

//expand item list
$('.item-container').click(function() {
    $('.button-container').not($(this).next()).hide(200);
    $(this).next('.button-container').toggle(400);
});

var item='';
var amount='';

//add to item list
$('#submit-info').on('click', function(event){
    event.preventDefault();
    // console.log(this);

    //grab values
    item=$('#text').val().trim();
    amount=$('#number').val().trim();
    // console.log(item,amount);
    
    itemList.push(item, amount);
    console.log(itemList);
});