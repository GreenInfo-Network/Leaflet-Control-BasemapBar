var basemap_listing = [
    /* Bing options
     * url    -- string; the basemap type, any one of of these: street, aerial
     * apikey -- your Bing API key; please use your own and not ours
     */
    {
        type: 'bing',
        label:'b road',
        url:'street',
        apikey:"AjBuYw8goYn_CWiqk65Rbf_Cm-j1QFPH-gGfOxjBipxuEB2N3n9yACKu5s8Dl18N",
        tooltip: 'Bing Streets Map'
    },
    {
        type: 'bing',
        label:'b photo',
        url:'aerial',
        apikey:"AjBuYw8goYn_CWiqk65Rbf_Cm-j1QFPH-gGfOxjBipxuEB2N3n9yACKu5s8Dl18N",
        tooltip: 'Bing Photo/Satellite Imagery'
    },
    /* Google options
     * url -- string; the basemap type, any one of of these: streets, satellite, hybrid, terrain
     */
    {
        type: 'google',
        label:'G Streets',
        url:'streets',
        tooltip: 'Google Streets Map'
    },
    {
        type: 'google',
        label:'G Sat',
        url:'hybrid',
        tooltip: 'Google Photo/Satellite Imagery'
    },
    /* plain L.TileLayer options
     * url              -- string; the URL template, passed to L.TileLayer as-is
     * tileLayerOptions -- object; any non-default L.TileLayer options to pass to the L.TileLayer e.g. attributions and subdomains
     */
    {
        type:'xyz',
        label:'esri topo',
        url:'http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.jpg',
        tooltip: 'ESRI Topographic Basemap',
        tileLayerOptions: {
            attribution:'&copy; <a target="_blank" href="http://esri.com/" target="_blank">ESRI</a>',
        }
    },
    {
        type:'xyz',
        label:'osm',
        url:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        tooltip: 'Open Street Map',
        tileLayerOptions: {
            attribution:'&copy; <a target="_blank" href="http://openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>',
        }
    }
];


function init() {
    // create a simple map, centered someplace nice
    var map = L.map('map');
    map.setView([37.7833,-122.4167], 12);

    // add the basemap picker
    // then pick a layer by its unique "label"
    var basemap_control = new L.Control.BasemapBar({ layers:basemap_listing }).addTo(map);
    basemap_control.expandUI().selectLayer('cpad');
}
