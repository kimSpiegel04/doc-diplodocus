var API_KEY = "jkXB5uHC"
var API_SECRET = "dAhKeTbZOiAxnss9ajV868m20it0HFaX"
var herokuProxy = "https://cors-anywhere.herokuapp.com/"

queryURL = herokuProxy + "https://www.iamdata.co/v1/stores?client_id=" + API_KEY + "&client_secret=" + API_SECRET

// console.log(queryURL);
// 50, 55, 75, 86, 95
axios.get(queryURL).then((response) => {
    console.log(response);

    var res = response.data.result;
    console.log(res);

    for (var i = 0; i < res.length; i++) {
        if (res[i].can_scrape===true&&res[i].restaurant===false){
            // console.log(res[i]);
            $('.store-list').append(`
            <div class='logo-container'>
            <li class="logo-info" name=${res[i].name}>
            <img src=${res[i].image_link} class="logo-img">
            <form class='store-form'>
            <input placeholder='User'></input>
            <input placeholder='Password' type='password'></input>
            <button type='submit' class='store-submit'>Connect</button>
            </form></li></div>`);
        }       
    }
}).catch((err) => {
    console.log(err);

});
