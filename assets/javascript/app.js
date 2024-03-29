$(document).ready(function () {
    //sidebar menu
    var chevron=$('.chevron');
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        chevron.toggleClass('fa-chevron-right fa-chevron-left');
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

    var bought = 0;
    var used = 0;
    var donated = 0;
    var composted=0;
    var pitched=0;

    //functions
    function getExpDate(input){
        var expiresDate = moment(input).add(14, 'd');
        return expiresDate;
    }

    function getPreserveDate(input){
        var expiresDate = moment(input).add(180, 'd');
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
        var item = $('#text').val().trim();
        var amount = $('#number').val().trim();
        var num = parseInt(amount);

        //add bought lbs
        var newAmount = bought + num;

        // temp object for data
        var newFood={
            item: item,
            amount: num,
            inputDate: firebase.database.ServerValue.TIMESTAMP
        }

        database.ref('child/food').push(newFood);
        database.ref('child/bought').set({
            lbsBought: newAmount
        });

        $('#text').val('');
        $('#number').val('');
    });

    database.ref('child/bought').on("value", function(snapshot) {
        console.log(snapshot.val());
        bought = snapshot.val().lbsBought;
        $('.user-bought').text(bought);

    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    database.ref('child/food').on('child_added', function(ss){
        var key = ss.key;
        var item = ss.val().item;
        var amount = ss.val().amount;
        var inputDate = ss.val().inputDate;
        now = new Date().getTime();

        //calculate expiration date
        expiresDate = getExpDate(inputDate);

        //calculate how many days food expires
        difference = getDifference(now,expiresDate);

        $('.list').append(
            `<div class='item-container row' data-name=${item} data-key=${key}>
                <div class='item-listing col-6'>${item}</div>
                <div class='lbs-listing col-3'>${amount} lbs.</div>
                <div class='exp-listing col-3' id=${item}>${difference} days</div>
            </div>
                <div class="button-container" data-name=${item} data-key=${key}>

                <button value=${amount} data-key=${key} title="Used Item" class='used-btn btn' data-name=${item}><i class="fas fa-drumstick-bite"></i></button>

                <button title='Preserved' class='pres-btn btn' value=${amount} data-key=${key} data-name=${item}><i class="fas fa-box-open"></i></button>

                <button title='Donate' class='donate-btn btn' value=${amount} data-key=${key} data-name=${item}><i class="fas fa-heart"></i></button>

                <button title='Compost' class='compost-btn btn'value=${amount} data-key=${key} data-name=${item}><i class="fas fa-seedling"></i></button>

                <button title='Thrown Out' class='pitched-btn btn' value=${amount} data-key=${key} data-name=${item}><i class="fas fa-trash-alt"></i></button>
            </div>`         
        );
        countdown(item,difference);

        $('.item-container').off("click").on("click",function() {
            $('.button-container').not($(this).next()).hide(200);
            $(this).next('.button-container').toggle(400);

            //used button
            $('.used-btn').off("click").on("click",function(){
                var foodItem = $(this).attr('data-name');
                console.log(foodItem);
                var valOfBtn = $('.used-btn[data-name='+foodItem+']').val();
                var num = parseInt(valOfBtn);
                var newAmount=used+num;
                database.ref('child/used').set({
                    lbsUsed: newAmount
                });
                keyref = $(this).attr("data-key");
                database.ref('child/food').child(keyref).remove();
                window.location.reload();
                return false;
            });

            // preserve button
            $('.pres-btn').off("click").on("click",function(){
                var foodItem = $(this).attr('data-name');
                console.log(foodItem);
                var keyref = $(this).attr("data-key");
                var item = $(this).attr('data-name');
                var amount = $(this).attr('value');
                
                var freezerItem = {
                    item : item,
                    amount : amount,
                    inputDate : firebase.database.ServerValue.TIMESTAMP
                }

                database.ref('child/freezer').push(freezerItem);
                database.ref('child/food').child(keyref).remove();
                window.location.reload();
                return false;
            });

            //donate button
            $('.donate-btn').off("click").on("click",function(){
                var foodItem = $(this).attr('data-name');
                var valOfBtn = $('.donate-btn[data-name='+foodItem+']').val();
                var num = parseInt(valOfBtn);
                var newAmount=donated+num;
                database.ref('child/donated').set({
                    lbsDonated: newAmount
                });
                keyref = $(this).attr("data-key");
                database.ref('child/food').child(keyref).remove();
                window.location.reload();
                return false;
            });

            //compost button
            $('.compost-btn').off("click").on("click",function(){
                var foodItem = $(this).attr('data-name');
                var valOfBtn = $('.compost-btn[data-name='+foodItem+']').val();
                var num = parseInt(valOfBtn);
                var newAmount=composted+num;
                database.ref('child/compost').set({
                    lbsComposted: newAmount
                });
                keyref = $(this).attr("data-key");
                database.ref('child/food').child(keyref).remove();
                window.location.reload();
                return false;
            });

            //thrown out button
            $('.pitched-btn').off("click").on("click",function(){
                var foodItem = $(this).attr('data-name');
                var valOfBtn = $('.pitched-btn[data-name='+foodItem+']').val();
                var num = parseInt(valOfBtn);
                var newAmount=pitched+num;
                database.ref('child/pitched').set({
                    lbsPitched: newAmount
                });
                keyref = $(this).attr("data-key");
                database.ref('child/food').child(keyref).remove();
                window.location.reload();
                return false;
            });

        });
    }, function(errorObject){
        console.log('The read failed: '+errorObject.code);
    });

    database.ref('child/used').on("value", function(snapshot) {        
        console.log(snapshot.val());
        used = snapshot.val().lbsUsed;
        $('.user-used').text(used);
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    database.ref('child/donated').on("value", function(snapshot) {  
        console.log(snapshot.val());
        donated = snapshot.val().lbsDonated;
        $('.user-donated').text(donated);
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    database.ref('child/compost').on("value", function(snapshot) {  
        console.log(snapshot.val());
        composted = snapshot.val().lbsComposted;
        $('.user-composted').text(composted);
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    database.ref('child/pitched').on("value", function(snapshot) {  
        console.log(snapshot.val());
        pitched = snapshot.val().lbsPitched;
        $('.user-pitched').text(pitched);
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    // function counter(){
    //     $('.list').empty();

    //     database.ref('child/food').on('child_added', function(ss){
    //         var key = ss.key;
    //         var item = ss.val().item;
    //         var amount = ss.val().amount;
    //         var inputDate = ss.val().inputDate;
    //         now = new Date().getTime();
    
    //         //calculate expiration date
    //         expiresDate = getExpDate(inputDate);
    
    //         //calculate how many days food expires
    //         difference = getDifference(now,expiresDate);
            
    //         $('.list').append(
    //             `<div class='item-container row' data-name=${item} data-key=${key}>
    //                 <div class='item-listing col-6'>${item}</div>
    //                 <div class='lbs-listing col-3'>${amount} lbs.</div>
    //                 <div class='exp-listing col-3' id=${item}>${difference} days</div>
    //             </div>
    //                 <div class="button-container" data-name=${item} data-key=${key}>
    
    //                 <button value=${amount} data-key=${key} title="Used Item" class='used-btn btn' data-name=${item}><i class="fas fa-drumstick-bite"></i></button>
    
    //                 <button title='Preserved' class='pres-btn btn' value=${amount} data-key=${key} data-name=${item}><i class="fas fa-box-open"></i></button>
    
    //                 <button title='Donate' class='donate-btn btn' value=${amount} data-key=${key} data-name=${item}><i class="fas fa-heart"></i></button>
    
    //                 <button title='Compost' class='compost-btn btn'value=${amount} data-key=${key} data-name=${item}><i class="fas fa-seedling"></i></button>
    
    //                 <button title='Thrown Out' class='pitched-btn btn' value=${amount} data-key=${key} data-name=${item}><i class="fas fa-trash-alt"></i></button>
    //             </div>`         
    //         );
    //         countdown(item,difference);
    
    //         $('.item-container').off("click").on("click",function() {
    //             $('.button-container').not($(this).next()).hide(200);
    //             $(this).next('.button-container').toggle(400);
    
    //             //used button
    //             $('.used-btn').off("click").on("click",function(){
    //                 var foodItem = $(this).attr('data-name');
    //                 console.log(foodItem);
    //                 var valOfBtn = $('.used-btn[data-name='+foodItem+']').val();
    //                 var num = parseInt(valOfBtn);
    //                 var newAmount=used+num;
    //                 database.ref('child/used').set({
    //                     lbsUsed: newAmount
    //                 });
    //                 keyref = $(this).attr("data-key");
    //                 database.ref('child/food').child(keyref).remove();
    //                 window.location.reload();
    //                 return false;
    //             });
    
    //             // preserve button
    //             $('.pres-btn').off("click").on("click",function(){
    //                 var foodItem = $(this).attr('data-name');
    //                 console.log(foodItem);
    //                 var keyref = $(this).attr("data-key");
    //                 var item = $(this).attr('data-name');
    //                 var amount = $(this).attr('value');
                    
    //                 var freezerItem = {
    //                     item : item,
    //                     amount : amount,
    //                     inputDate : firebase.database.ServerValue.TIMESTAMP
    //                 }
    
    //                 database.ref('child/freezer').push(freezerItem);
    //                 database.ref('child/food').child(keyref).remove();
    //                 window.location.reload();
    //                 return false;
    //             });
    
    //             //donate button
    //             $('.donate-btn').off("click").on("click",function(){
    //                 var foodItem = $(this).attr('data-name');
    //                 var valOfBtn = $('.donate-btn[data-name='+foodItem+']').val();
    //                 var num = parseInt(valOfBtn);
    //                 var newAmount=donated+num;
    //                 database.ref('child/donated').set({
    //                     lbsDonated: newAmount
    //                 });
    //                 keyref = $(this).attr("data-key");
    //                 database.ref('child/food').child(keyref).remove();
    //                 window.location.reload();
    //                 return false;
    //             });
    
    //             //compost button
    //             $('.compost-btn').off("click").on("click",function(){
    //                 var foodItem = $(this).attr('data-name');
    //                 var valOfBtn = $('.compost-btn[data-name='+foodItem+']').val();
    //                 var num = parseInt(valOfBtn);
    //                 var newAmount=composted+num;
    //                 database.ref('child/compost').set({
    //                     lbsComposted: newAmount
    //                 });
    //                 keyref = $(this).attr("data-key");
    //                 database.ref('child/food').child(keyref).remove();
    //                 window.location.reload();
    //                 return false;
    //             });
    
    //             //thrown out button
    //             $('.pitched-btn').off("click").on("click",function(){
    //                 var foodItem = $(this).attr('data-name');
    //                 var valOfBtn = $('.pitched-btn[data-name='+foodItem+']').val();
    //                 var num = parseInt(valOfBtn);
    //                 var newAmount=pitched+num;
    //                 database.ref('child/pitched').set({
    //                     lbsPitched: newAmount
    //                 });
    //                 keyref = $(this).attr("data-key");
    //                 database.ref('child/food').child(keyref).remove();
    //                 window.location.reload();
    //                 return false;
    //             });
    
    //         });
    //     }, function(errorObject){
    //         console.log('The read failed: '+errorObject.code);
    //     });
    
    //     database.ref('child/used').on("value", function(snapshot) {        
    //         console.log(snapshot.val());
    //         used = snapshot.val().lbsUsed;
    //         $('.user-used').text(used);
    //     }, function(errorObject) {
    //         console.log("The read failed: " + errorObject.code);
    //     });
    
    //     database.ref('child/donated').on("value", function(snapshot) {  
    //         console.log(snapshot.val());
    //         donated = snapshot.val().lbsDonated;
    //         $('.user-donated').text(donated);
    //     }, function(errorObject) {
    //         console.log("The read failed: " + errorObject.code);
    //     });
    
    //     database.ref('child/compost').on("value", function(snapshot) {  
    //         console.log(snapshot.val());
    //         composted = snapshot.val().lbsComposted;
    //         $('.user-composted').text(composted);
    //     }, function(errorObject) {
    //         console.log("The read failed: " + errorObject.code);
    //     });
    
    //     database.ref('child/pitched').on("value", function(snapshot) {  
    //         console.log(snapshot.val());
    //         pitched = snapshot.val().lbsPitched;
    //         $('.user-pitched').text(pitched);
    //     }, function(errorObject) {
    //         console.log("The read failed: " + errorObject.code);
    //     });
    // } setInterval(counter, 300000);
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