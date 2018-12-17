

// 
let map;

const displayBox = document.querySelector('#displayBox')
const content = document.querySelector('.content')
const closeBtn = document.querySelector('#closeBtn')

// the popup's close button
closeBtn.addEventListener('click', () => {
    displayBox.style.transform = `translate3d(0px, 40vh, 0px)`;
})

// fetches the earthquake data and displays them on the map
function renderMap() {
    const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'

    fetch(url)
    .then(res => res.json())
    .then(data => {


        const { bbox, features } = data

        const [
        minX, minY,,
        maxX, maxY
        ] = bbox


        /*
        After a bit of research
        earthquake.usgs uses a standard bbox which
        is a map boundry to display the map

        Google doesn't really adhere to it so I'm not
        sure the bounds code is accurate
        */ 
        const bounds = new google.maps.LatLngBounds()
        const min = new google.maps.LatLng(minY, minX)
        const max = new google.maps.LatLng(maxY, maxX)
        bounds.extend(min)
        bounds.extend(max)
        
        map = new google.maps.Map(document.querySelector('#map'))
        map.fitBounds(bounds)

        const infowindow = new google.maps.InfoWindow()
        
        features.forEach((feature) => {
            const {title, mag, time} = feature.properties
            const date = (new Date(time)).toDateString()

            const [lng, lat] = feature.geometry.coordinates

            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                title
            })

            google.maps.event.addListener(marker, 'click', (function(marker) {
                return function() {
                    content.innerHTML = ''
                    const html = `
                        <h1>${title}</h1>
                        <h3>Date: ${date}</h3>
                    `
                    content.insertAdjacentHTML('beforeend', html)
                    displayBox.style.transform = `translate3d(0px, 0px, 0px)`

                    /*
                    I didn't want to go with the standard google pin popup
                    I couldn't find an alternative so I made my own
                    Comment out the code form line 65 if you want to see the code below operate
                    */ 
                    // infowindow.setContent(`${title}, Date: ${date}`);
                    // infowindow.open(map, marker);
                }
            })(marker));
 
        })

        
    })
}

// google script tag runs initMap
function initMap() {
    renderMap()
}


