# Leaflet-Control-BasemapBar

A Leaflet control for adding an attractive basemap bar.

https://github.com/GreenInfo-Network/Leaflet-Control-BasemapBar

http://greeninfo-network.github.io/Leaflet-Control-BasemapBar/


# Installation

Include the CSS and JS files using tags as usual:
```
<script type="text/javascript" src="leaflet-control-basemapbar.js"></script>
<link rel="stylesheet" type="text/css" href="leaflet-control-basemapbar.css" />
```

Then use it:

```
const basemap_offerings = [
    {
        id: 'Topo',
        tooltip: 'ESRI Topographic Basemap'
        layer: L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.jpg', {
            attribution:'&copy; <a target="_blank" href="http://esri.com/" target="_blank">ESRI</a>'
        })
    },
    {
        id: 'Positron',
        tooltip: 'Mapbox Positron'
        layer: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
            attribution: 'Map tiles by <a target="_blank" href="http://www.mapbox.com">MapBox</a>.<br />Data &copy; <a target="_blank" href="http://openstreetmap.org/copyright" target="_blank">OpenStreetMap contributings</a>',
        }),
    },
    {
        id: 'OSM',
        tooltip: 'Open Street Map',
        layer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:'&copy; <a target="_blank" href="http://openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>'
        }}
    },
];

const mymap = L.map();
mymap.layerpicker = new L.Control.BasemapBar({
    layers: basemap_offerings,
}).addTo(mymap);
```


# Constructor Options

- `layers` = A list of layers to offer, and their titles.
  = `id` = the label to display in the bar; **this must be unique**, as this is used by `selectOption()` to trigger a selection programmatically
  = `tooltip` = a tooltip title when mouse hovers over this choice
  = `layer` = a L.TileLayer instance, or probably almost any type of L.Layer as long as you set its `pane` appropriately
- `position` = The usual L.Control positioning for the control; defaults to 'topleft'
- `expanded` = true to have the options expanded by default when the control is added; defaults to false (collapsed)
- `expandButtonHTML` = set the HTML content of the button when the bar is collapsed
- `collapseButtonHTML` = set the HTML content of the collapse button when the bar is expanded
- `enhancedfocus` = adds an enhanced `:focus` outline on the control's buttons to aid people with low vision; particularly useful when using basemaps with a dark color


# Methods

- `expand()` = expand the interface
- `collapse()` = collapse the interface
- `whichLayer()` = get the `id` of the currently-selected layer
- `selectLayer(layerid)` = select a layer by its `id`

