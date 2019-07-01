$(document).ready(function () {
    //sidebar menu
    var chevron=$('.chevron');
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        chevron.toggleClass('fa-chevron-right fa-chevron-left');
    });
});

function initMap(){
    //map options
    var options = {
        zoom: 10,
        center: {lat:38.9072, lng:-77.0369}
    }
    //new map
    var map = new google.maps.Map(document.getElementById('map'), options);

    //array of markers
    var markers = [
        {
            coords: {lat:38.936470, lng:-77.175100},
            content: {
                pantry: 'Share of McLean',
                address: '1367 Chain Bridge Rd., McLean, VA 22101',
                website: '<a href="www.shareofmclean.org" class="hover-a">www.shareofmclean.org</a>'}
        },{
            coords: {lat:38.872120, lng:-77.236862},
            content: {
                pantry: 'Food for Others',
                address: '2938 Prosperity Ave., Fairfax, VA 22031',
                website: '<a href="www.foodforothers.org" class="hover-a">www.foodforothers.org</a>'}
        }];

    //loop through markers
    for(var i=0; i<markers.length;i++){
        addMarker(markers[i]);
    }

    //add marker function
    function addMarker(props){
        var marker = new google.maps.Marker({
            position: props.coords,
            map: map,
        });

        //check content
        if(props.content){
            var infoWindow = new google.maps.InfoWindow({
                content: props.content.pantry
            });

            marker.addListener('click', function(){
                infoWindow.open(map, marker);
                $('#put-info').html(`
                <p class='pantry-name'>${props.content.pantry}</p>
                <p><b>Address:</b> ${props.content.address}
                <br>
                <b>Website:</b> ${props.content.website}
                <p>`);
            });

        }
    }
}
