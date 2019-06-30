$(document).ready(function () {

    // document.querySelector('#sidebar').classList.remove('active');
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        // $('#sidebarCollapse').html('<i class="fas fa-chevron-left fa-lg"</i>');
    });

    // Initialize Firebase
    var firebaseConfig = {
        apiKey: "AIzaSyAK7kgYfuhaLVCbPFILgUj9VMTQ9uPGiDg",
        authDomain: "beet-waste.firebaseapp.com",
        databaseURL: "https://beet-waste.firebaseio.com",
        projectId: "beet-waste",
        storageBucket: "beet-waste.appspot.com",
        messagingSenderId: "525194791524",
        appId: "1:525194791524:web:516a562b13f9fa3a"
    };

    firebase.initializeApp(firebaseConfig);

    //Global Vars
    var database=firebase.database();

    var bought=0;
    var used=0;
    var donated=0;
    var composted=0;
    var pitched=0;

    $('.user-bought').text(bought);
    $('.user-used').html(used);
    $('.user-donated').html(donated);
    $('.user-composted').html(composted);
    $('.user-pitched').html(pitched);

    // //Js vars
    // var expiresDate;
    // var difference;

    //functions
    function getExpDate(input){
        expiresDate = moment(input).add(14, 'd');
        return expiresDate;
    }

    function getDifference(a,b){
        difference = b.diff(a, 'd');
        return parseInt(difference);
    }

    function countdown(i,diff){
        //colors
        if(diff>=10){
            document.getElementById(i).style.color='green';
        } else if(diff <=9 && diff >= 4){
            document.getElementById(i).style.color='yellow';
        } else if(diff <= 3){
            document.getElementById(i).style.color='red';
        }
    }
    

    $('#submit-info').on('click', function(event){
        event.preventDefault();

        //grab values
        var item=$('#text').val().trim();
        var amount=$('#number').val().trim();
        var num=parseInt(amount);

        // temp object for data
        var newFood={
            item: item,
            amount: num,
            inputDate: firebase.database.ServerValue.TIMESTAMP
        }

        database.ref().push(newFood);

        $('#text').val('');
        $('#number').val('');
    });

// database.ref().on("value", function(snapshot) {
// });
    database.ref().on('child_added', function(ss){
        // console.log(ss.val());
        var key = ss.key;
        var item = ss.val().item;
        var amount = ss.val().amount;
        var inputDate = ss.val().inputDate;
        now = new Date().getTime();

        console.log('key: '+key);
        console.log('item: '+item);
        console.log('amount: '+amount);
        console.log('input date: '+inputDate);
        console.log('current time '+now);

        //calculate expiration date
        expiresDate = getExpDate(inputDate);
        console.log('food will expire on '+expiresDate);

        //calculate how many days food expires
        difference = getDifference(now,expiresDate);
        console.log('food will expire in '+difference+' days');

        $('.list').append(
            `<div class='item-container row' data-name=${item} data-key=${key}>
                <div class='item-listing col-6'>${item}</div>
                <div class='lbs-listing col-3'>${amount} lbs.</div>
                <div class='exp-listing col-3' id=${item}>${difference} days</div>
            </div>
                <div class="button-container" data-name=${item} data-key=${key}>
                <a href="#"><i class="fas fa-drumstick-bite" title="Used Item" value=${amount}></i></a>
                <a href="#" title='Preserved' class='preserved'><i class="fas fa-box-open" value=${amount}></i></a>
                <a href="#" title='Donate' class='donate'><i class="fas fa-heart" value=${amount}></i></a>
                <a href="#" title='Compost' class='compost'><i class="fas fa-seedling" value=${amount}></i></a>
                <a href="#" title='Thrown Out' class='pitched'><i class="fas fa-trash-alt" value=${amount}></i></i></a>
            </div>`         
        );
        countdown(item,difference);
        $('.item-container').click(function() {
            $('.button-container').hide();
            var foodItem = $(this).attr('data-name');
            $('.button-container[data-name=' + foodItem + ']').show();
            return false;
        });

    }, function(errorObject){
        console.log('The read failed: '+errorObject.code);
    });

    function counter(){
        $('.list').empty();

        database.ref().on('child_added', function(ss){
            var key = ss.key;
            var item = ss.val().item;
            var amount = ss.val().amount;
            var inputDate = ss.val().inputDate;
            now = new Date().getTime();

            //calculate expiration date
            expiresDate = getExpDate(inputDate);
            console.log('food will expire on '+expiresDate);

            //calculate how many days food expires
            difference = getDifference(now,expiresDate);
            console.log('food will expire in '+difference+' days');

            $('.list').append(
                `<div class='item-container row' data-name=${item} data-key=${key}>
                    <div class='item-listing col-6'>${item}</div>
                    <div class='lbs-listing col-3'>${amount} lbs.</div>
                    <div class='exp-listing col-3'>${difference} days</div>
                </div>
                </div>
                    <div class="button-container" data-name=${item} data-key=${key}>
                    <a href="#"><i class="fas fa-drumstick-bite" title="Used Item" value=${amount}></i></a>
                    <a href="#" title='Preserved' class='preserved'><i class="fas fa-box-open" value=${amount}></i></a>
                    <a href="#" title='Donate' class='donate'><i class="fas fa-heart" value=${amount}></i></a>
                    <a href="#" title='Compost' class='compost'><i class="fas fa-seedling" value=${amount}></i></a>
                    <a href="#" title='Thrown Out' class='pitched'><i class="fas fa-trash-alt" value=${amount}></i></i></a>
                </div>`        
            );

            $('.item-container').click(function() {
                // $('.button-container').hide();
                var foodItem = $(this).attr('data-name');
                $('.button-container[data-name=' + foodItem + ']').show();
                // return false;
            });

            $("body").on('click', '.fa-drumstick-bite',function() {
                // keyref = $(this).attr("data-key");
                bought = bought + Number($(this).val());
                console.log(bought);
                $('.user-used').text(bought);  
                // database.ref().child(keyref).remove();
                // window.location.reload();
            });
        })
    };
    setInterval(counter, 86400000);

});




// //API
// var API_KEY = "jkXB5uHC"
// var API_SECRET = "dAhKeTbZOiAxnss9ajV868m20it0HFaX"
// var herokuProxy = "https://cors-anywhere.herokuapp.com/"

// queryURL = herokuProxy + "https://www.iamdata.co/v1/categories?&client_id=" + API_KEY + "&client_secret=" + API_SECRET

// // console.log(queryURL);
// // 50, 55, 75, 86, 95
// axios.get(queryURL).then((response) => {
//     // console.log(response);

//     // var res = response.data.result;
//     // console.log(res);

//     // for (var i = 0; i < res.length; i++) {
//     //     if (res[i].parent_id === 50 || res[i].parent_id === 55 || res[i].parent_id === 75 ){
//     //     console.log(res[i])   
//     //     }     
//     // }
// }).catch((err) => {
//     console.log(err);

// });