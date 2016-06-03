# Leaflet-Control-BasemapBar

A Leaflet control for adding an attractive basemap bar. Supports Bing, Google, and of course TileLayer.

https://github.com/GreenInfo-Network/Leaflet-Control-BasemapBar

http://greeninfo-network.github.io/Leaflet-Control-BasemapBar/

# Requirements for Bing and Google

The Bing and Google support was written for two specific Leaflet plugins, so if you want to use them with this BasemapBar control you should use those same ones.

https://github.com/greeninfo/Leaflet-Control-BasemapBar/blob/master/leaflet-tilelayer-bing.js

https://github.com/greeninfo/Leaflet-Control-BasemapBar/blob/master/leaflet-google.js

# Example of Usage

See index.html and index.js for a working example.

    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.16"></script>
    <script type="text/javascript" src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0"></script>
    <script type="text/javascript" src="leaflet-tilelayer-bing.js"></script>
    <script type="text/javascript" src="leaflet-google.js"></script>

    <link rel="stylesheet" type="text/css" href="dist/leaflet-control-basemapbar.css" />
    <script type="text/javascript" src="dist/leaflet-control-basemapbar.js"></script>

    var basemap_listing = [
        {
            type: 'google',
            label:'G Sat',
            url:'hybrid',
            tooltip: 'Google Photo/Satellite Imagery'
        },
        {
            type: 'bing',
            label:'b road',
            url:'street',
            apikey:"XXXYYYZZZAAABBBCCC",
            tooltip: 'Bing Streets Map'
        },
        {
            type:'xyz',
            label:'esri topo',
            tooltip: 'ESRI Topographic Basemap'
            url:'http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.jpg',
            tileLayerOptions: {
                attribution:'&copy; <a target="_blank" href="http://esri.com/" target="_blank">ESRI</a>'
            }
        },
        {
            type:'xyz',
            label:'osm',
            tooltip: 'Open Street Map',
            url:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            tileLayerOptions: {
                attribution:'&copy; <a target="_blank" href="http://openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>'
            }
        }
    ];

    new L.Control.BasemapBar({ layers:basemap_listing }).addTo(map);


# Constructor Options

* _layers_ -- A list of layer descriptions, comprising the basemap choices available. See _Layer Types_ below for details on supported layer types.
* _position_ -- The usual L.Control positioning for the control; defaults to 'topright'

# Layer Types

The _layers_ parameter is a list of object literals, each one describing a basemap option.

All basemap options must have a _type_ attribute and a _label_ attribute. Depending on the type, additional options are required.

**The _label_ attribute must be unique** as it is both the visible label for the basemap option, and also the unique identifier for the layer instance.

* An ordinary L.TileLayer
  * **type:'xyz'**
  * **label** -- The unique name, and also and visible label, of this basemap option.
  * **tooltip** -- A tooltip displayed when the mouse hovers over the button for this layer. Optional, default to "".
  * **url** -- The URL template for this L.TileLayer. Passed to L.TileLayer as-is.
  * **tileLayerOptions** -- An object of other options to be passed to the L.TileLayer as-given, e.g. subdomains and attributions.

* A Bing basemap option
  * **type:'bing'**
  * **label** -- The unique name, and also and visible label, of this basemap option.
  * **url** -- Which Bing basemap offering? Valid values are: _streets_   _satellite_   _hybrid_   _terrain_

* A Google basemap option
  * **type:'google'**
  * **label** -- The unique name, and also and visible label, of this basemap option.
  * **url** -- Which Google basemap offering? Valid values are: _street_   _aerial_

