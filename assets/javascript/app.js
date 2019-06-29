var firebaseConfig = {
    apiKey: "AIzaSyAK7kgYfuhaLVCbPFILgUj9VMTQ9uPGiDg",
    authDomain: "beet-waste.firebaseapp.com",
    databaseURL: "https://beet-waste.firebaseio.com",
    projectId: "beet-waste",
    storageBucket: "beet-waste.appspot.com",
    messagingSenderId: "525194791524",
    appId: "1:525194791524:web:516a562b13f9fa3a"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database=firebase.database();

$(document).ready(function () {
    // document.querySelector('#sidebar').classList.remove('active');
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        // $('#sidebarCollapse').html('<i class="fas fa-chevron-left fa-lg"</i>');
    });
});

//add to item list
var item='';
var amount='';

function counter(x) {
    setInterval(x--, 1000);  
};



$('#submit-info').on('click', function(event){
    event.preventDefault();

    //grab values
    item=$('#text').val().trim();
    amount=$('#number').val().trim();
    num=parseInt(amount);

    var inputDate = moment().format('YYYY-MM-DD');
    console.log(`input date: ${inputDate}`);
    console.log(inputDate)
    console.log(typeof(inputDate))


    var expDate = moment(inputDate).add(14, 'd');
    console.log(`expires: ${expDate}`);
    console.log(expDate)
    console.log(expDate.valueOf())
    console.log(typeof(expDate))

    
    var distance = expDate.diff(inputDate, 'd');
    console.log(`distance: ${distance}`);
    // console.log(typeof(distance));

    //countdown
    // console.log(counter(distance));
    // 86400000


//     setInterval(function(){ 
//         distance--
//         console.log(distance)


// }, 3000);

    //push
    database.ref().push({
        item: item,
        amount: num,
        // countDown: distance,
        beginDate: inputDate,
        expriationDate: expDate.valueOf()

    });

    database.ref().on('child_added', function(snapshot){
        var ss=snapshot.val();

        // console.log(ss.item);
        // console.log(snapshot.key)
        console.log(ss);

        var bD = ss.beginDate;
        var eD = ss.expriationDate;
        // var duration = moment.duration(bD.diff(eD));
        // console.log(duration);
        // var days = duration.asDays();
        // var distance1 = eD.diff(bD, 'days');
        console.log(moment(eD));
    //     $('.list').append(
    //         `<div class='item-container' data-attribute=${ss.item}>
    //             <ul>
    //                 <li class='item-listing'>${ss.item}</li>
    //                 <li class='lbs-listing'>${ss.amount} lbs.</li>
    //                 <li class='exp-listing' id='d' name=${ss.item}>${ss.countDown}</li>
    //             </ul>
    //         </div>
    //         <div class="button-container" data-attribute=${ss.item}>
    //             <a href="#"><i class="fas fa-drumstick-bite" title="Used Item"></i></a>
    //             <a href="#" title='Preserved'><i class="fas fa-box-open"></i></a>
    //             <a href="#" title='Donate'><i class="fas fa-heart"></i></a>
    //             <a href="#" title='Compost'><i class="fas fa-seedling"></i></a>
    //             <a href="#" title='Thrown Out'><i class="fas fa-trash-alt"></i></i></a>
    //         </div>`        
    //     );
    //     function countDown(){
    //         document.getElementById(`d`).innerHTML=`${ss.countDown} days`;
    //         //colors
    //         if(ss.countDown>=10){
    //             document.getElementById(`d`).style.color='green';
    //         } else if(countDown<=9&&countDown>=4){
    //             document.getElementById(`d`).style.color='yellow';
    //         } else if(countDown<=3){
    //             document.getElementById(`d`).style.color='red';
    //         }
    //     }
    //     countDown();

        //expand item list
        $('.item-container').click(function() {
                $('.button-container').hide();
                var item = $(this).attr('data-attribute');
                $('.button-container[data-attribute=' + item + ']').show();
                return false;
        });
    })    
});



// //API
var API_KEY = "jkXB5uHC"
var API_SECRET = "dAhKeTbZOiAxnss9ajV868m20it0HFaX"
var herokuProxy = "https://cors-anywhere.herokuapp.com/"

queryURL = herokuProxy + "https://www.iamdata.co/v1/categories?&client_id=" + API_KEY + "&client_secret=" + API_SECRET

// console.log(queryURL);
// 50, 55, 75, 86, 95
axios.get(queryURL).then((response) => {
    // console.log(response);

    // var res = response.data.result;
    // console.log(res);

    // for (var i = 0; i < res.length; i++) {
    //     if (res[i].parent_id === 50 || res[i].parent_id === 55 || res[i].parent_id === 75 ){
    //     console.log(res[i])   
    //     }     
    // }
}).catch((err) => {
    console.log(err);

});