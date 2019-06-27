$(document).ready(function () {
    // document.querySelector('#sidebar').classList.remove('active');
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

// //API
var API_KEY = "jkXB5uHC"
var API_SECRET = "dAhKeTbZOiAxnss9ajV868m20it0HFaX"
var herokuProxy = "https://cors-anywhere.herokuapp.com/"

queryURL = herokuProxy + "https://www.iamdata.co/v1/categories?product_identifier=014100044208&page=1&per_page=10&full_resp=false&client_id=" + API_KEY + "&client_secret=" + API_SECRET

// console.log(queryURL);
50, 55, 75, 86, 95
axios.get(queryURL).then((response) => {
    console.log(response);
    var parentId=response.data.result.parent_id;
    for(var i=0; i<response.data.result.lenght; i++){
        if(parentId==50||parentId==55||parentId==75||parentId==86||parentId==95){
            console.log(response.data.result);
        }
    }
    // document.write(JSON.stringify(response.data.result[0]) )

}).catch((err) => {
    console.log(err);

});