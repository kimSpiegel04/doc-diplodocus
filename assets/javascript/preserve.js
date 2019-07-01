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

    //functions
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

    database.ref('child/freezer').on('child_added', function(ss){
        var key = ss.key;
        var item = ss.val().item;
        var amount = ss.val().amount;
        var inputDate = ss.val().inputDate;
        now = new Date().getTime();

        //calculate expiration date
        expiresDate = getPreserveDate(inputDate);

        //calculate how many days food expires
        difference = getDifference(now,expiresDate);

        $('.freezer-list').append(
            `<div class='item-container row' data-name=${item} data-key=${key}>
                <div class='item-listing col-4'>${item}</div>
                <div class='lbs-listing col-4'>${amount} lbs.</div>
                <div class='exp-listing col-4' id=${item}>${difference} days</div>
            </div>
                <div class="button-container" data-name=${item} data-key=${key}>

                <button value=${amount} data-key=${key} title="Used Item" class='used-btn btn' data-name=${item}><i class="fas fa-drumstick-bite"></i></button>

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
                database.ref('child/freezer').child(keyref).remove();
                window.location.reload();
                return false;
            });
        });
    }, function(errorObject){
        console.log('The read failed: '+errorObject.code);

    });

    database.ref('child/used').on("value", function(snapshot) {       
        used = snapshot.val().lbsUsed;
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    // function counter(){
    //     $('.list').empty();

    //     database.ref('child/food').on('child_added', function(ss){
            
    //             });
    //         });
    //     })
    // };
    // setInterval(counter, 300000);
    



});
