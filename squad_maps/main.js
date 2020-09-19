mapboxgl.accessToken =
    'pk.eyJ1IjoiZWdlcnR1IiwiYSI6ImNqd3gzbDBkMTBxNHQ0M216aDhnN2htbDkifQ.VQnmmTRVTleFGdK7aDXczg';

var startCoordinate = [-18.167310, 50.450492],
    startZoom = 2;

var popupViewportInterval = 200; // 0.2 sec

var map = new mapboxgl.Map({
    container: 'map',
    maxZoom: 18,
    minZoom: 1.5,
    zoom: startZoom,
    center: startCoordinate,
    style: 'mapbox://styles/egertu/ckf7bv0oj1bvh19myamuyin3i?fresh=true',
});

var images = {
    'Gorodok': 'Alpha_v9_Gorodok_Map.jpg',
    'Yehorivka': 'Alpha_v9_Yehorivka_Map.jpg',
    'Belaya': 'Belaya_HighRes.jpg',
    'Chora': 'Chora1_Minimap_V6.jpg',
    'Fallujah': 'Fallujah_Minimap.jpg',
    'Fool\'s Road': 'Fools_Road_v1_Minimap_V6.jpg',
    'Kamdesh': 'Kamdesh_Minimap_Final.jpg',
    'Kohat Toi': 'Kohat_minimap_V6.jpg',
    'Kokan': 'Kokan_minimap_8.jpg',
    'Lashkar Valley': 'Lashkar_Minimap.jpg',
    'Logar Valley': 'Logarvalley_minimap_V6.jpg',
    'Manic-5': 'Manic-5_Minimap.jpg',
    'Mestia': 'Minimap_Mestia.jpg',
    'Mutaha': 'Mutaha.jpg',
    'Nanisivik': 'Nanisivik_Minimap.jpg',
    'Narva': 'Narva_Minimap_Alpha_V10.jpg',
    'Skorpo': 'Skorpo_minimap.jpg',
    'Al Basrah': 'Squad_Al_Basrah_2.jpg',
    'Sumari Bala': 'Sumari_minimap_V6.jpg',
    'Tallil Outskirts': 'Tallil_Outskirts_Minimap.jpg',
    'Harju': 'Harju.jpg'
};

data.features.forEach(feature => {
    feature.properties.image =
        "<img src=img/" + images[feature.properties.name] + " width=\"500\" height=\"500\">";
});

map.on('load', function () {

    map.loadImage(
        'empty_marker.png',
        // Add an image to use as a custom marker
        function (error, image) {
            if (error) throw error;
            map.addImage('custom-marker', image);
            LoadMapbox();
        }
    )
});

var popup;

var LoadMapbox = function () {
    map.addSource('popups', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': data.features
        }
    });

    // Add a layer showing the places.
    map.addLayer({
        'id': 'popups',
        'type': 'symbol',
        'source': 'popups',
        'layout': {
            'icon-image': 'custom-marker',
            'icon-allow-overlap': true
        },
        "minzoom": 3,
    }, 'squad-maps-geojson-images');

    // Create a popup, but don't add it to the map yet.
    popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        maxWidth: 500,
        className: "popup"
    });

    map.on('click', 'popups', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        flyTo(coordinates);
    });

    createHook(popup, '_update', function () {
        if (popup != null) {
            if (popup._container != null) {
                popup._container.style.originalTransform = popup._container.style.transform;
                popupViewportAlign();
            }
        }
    })

    // map.addLayer({
    //     "id": "terrain-data",
    //     "type": "fill-extrusion",
    //     "source": {
    //         type: 'vector',
    //         url: 'mapbox://mapbox.mapbox-terrain-v2'
    //     },
    //     "source-layer": "contour",
    //     'minzoom': 8,
    //     'paint': {
    //         'fill-extrusion-color': {
    //             "stops": [[0,'#fff'],[8840*0.02,'#7F7F7F'], [8840*0.1,'#232323']],
    //             "property": "ele",
    //             "base": 1
    //         },
    //         'fill-extrusion-height': {
    //             'type': 'identity',
    //             'property': 'ele'
    //         },
    //         'fill-extrusion-opacity':.6
    //     }
    // });
}


function onMouseEnter(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    var coordinates = e.features[0].geometry.coordinates.slice();
    var image = e.features[0].properties.image;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(image).addTo(map);
    popupViewportAlign();
}

function onMouseLeave() {
    map.getCanvas().style.cursor = '';
    popup.remove();
}

function openNav() {
    document.getElementById("mySidebar").style.width = "300px";
    document.getElementById("openNavBtn").style.opacity = 0;
    document.getElementById("bulletin-board").style.opacity = 1;
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("openNavBtn").style.opacity = 1;
    document.getElementById("bulletin-board").style.opacity = 0;
}


var collapMap = document.getElementById("collapsibleMaps");
var categories = [],
    categoryDivs = [];

data.features.forEach(feature => {
    let name = feature.properties.name;
    let category = feature.properties.category;

    let categoryIndex = categories.indexOf(category);
    if (categoryIndex === -1) {
        categories.push(category);
        categoryIndex = categories.indexOf(category);

        let newCategoryDiv = document.createElement("div");
        newCategoryDiv.classList.add("content");

        let newCollapsibleLink = document.createElement("a");
        newCollapsibleLink.setAttribute("href", "#");
        newCollapsibleLink.classList.add("collapsible-link");
        newCollapsibleLink.innerText = category;

        newCategoryDiv.appendChild(newCollapsibleLink);
        // <a href="#" class="collapsible-link">NA</a>
        // <div class="content">a</div>
        categoryDivs.push(collapMap.appendChild(newCategoryDiv));
    } else {
        // console.log("This category already exists");
    }

    let newContent = document.createElement("div");
    newContent.setAttribute("href", "#");
    newContent.addEventListener("click", () => {
        flyTo(feature.geometry.coordinates);
    })

    newContent.classList.add("content", "subcontent");
    if(name == "Mutaha" || name == "Harju"){
        name +="*";
    }
    // newContent.innerText = name;

    let newContentText = document.createElement("p");
    newContentText.style.display = "inline-block";
    newContentText.innerText = name;
    // newContentText.addEventListener("click", () => {
    //     flyTo(feature.geometry.coordinates);
    // })
    newContent.appendChild(newContentText);

    let newContentLink = document.createElement("span");
    newContentLink.innerHTML = "<button style=\"padding-left: 20px; display: inline-block\" class=\"iconify\" data-icon=\"subway-cain\" data-inline=\"false\"></button>";
    newContentLink.addEventListener("click", ()=>{
        window.open(feature.url);
    })
    newContent.appendChild(newContentLink);

    categoryDivs[categoryIndex].appendChild(newContent);
});

var coll = document.getElementsByClassName("collapsible-link");
for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        var content = this.parentNode.querySelectorAll(":scope > .content");
        this.classList.toggle("active");
        for (let i = 0; i < content.length; i++) {
            const element = content[i];
            if (element.style.display === "block") {
                element.style.display = "none";
            } else {
                element.style.display = "block";
            }
        }

    });
}

var flyTo = function (coordinates, zoom) {
    map.flyTo({
        center: coordinates,
        zoom: zoom || 12,
        bearing: 0,

        speed: 0.5,
        curve: 3,

        easing: function (t) {
            return t;
        },

        essential: true
    });
}

var hoverImageToggle = document.getElementById("hoverImageToggle");
var isHoverImage = hoverImageToggle.checked;
updateHoverImagePopup();

hoverImageToggle.addEventListener("change", function (e) {
    isHoverImage = hoverImageToggle.checked;
    updateHoverImagePopup();
})

function updateHoverImagePopup() {
    if (isHoverImage) {
        map.on('mouseenter', 'popups', onMouseEnter);
        map.on('mouseleave', 'popups', onMouseLeave);
    } else {
        onMouseLeave();
        map.off('mouseenter', 'popups', onMouseEnter);
        map.off('mouseleave', 'popups', onMouseLeave);
    }
}

var isInViewport = function (element) {
    if (element == null) {
        return null;
    }
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

var popupViewportAlign = function () {
    if (popup != null) {
        if (popup._container != null) {
            var content = popup._container;
            let res = isInViewport(content)

            if (!res) {
                var tries = 1;
                do {
                    content.style.originalTransform = content.style.transform;
                    content.style.transform = content.style.originalTransform + " scale(" + tries + ", " + tries + ")";
                    tries -= 0.01;
                } while (!isInViewport(content) && tries > 0.8);
            }
        }
    }
}

// setInterval(popupViewportAlign, popupViewportInterval);

function createHook(obj, targetFunction, hookFunction) {
    let temp = obj[targetFunction]
    obj[targetFunction] = function (...args) {
        let ret = temp.apply(this, args)
        if (ret && typeof ret.then === 'function') {
            return ret.then((value) => {
                hookFunction([value, args]);
                return value;
            })
        } else {
            hookFunction([ret, args])
            return ret
        }
    }
}

setTimeout(openNav, 1500);