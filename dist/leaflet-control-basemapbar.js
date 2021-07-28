/*
 * Bar-style basemap picker by GreenInfo Network
 */

L.Control.BasemapBar = L.Control.extend({
    options: {
        position: 'topright'
    },
    initialize: function(options) {
        if (! options.layers || ! Array.isArray(options.layers) ) throw "L.Control.BasemapBar: missing layers list";

        L.setOptions(this,options);

        this.buttons = {};          // random-access to our own buttons, so we can arbitrarily fetch a button by name, e.g. to toggle one programatically
        this.map     = null;        // linkage to our containing L.Map instance
    },
    onAdd: function (map) {
        // add a linkage to the map, since we'll be managing map layers
        this.map = map;

        // pass 1
        // create an internal registry entry for each layer-option, mapping the button text onto the L.tileLayer instance
        // this is the key to the selectLayer() function being able to identify which layer is desired
        this._layers = {};
        for (var li=0, ll=this.options.layers.length; li<ll; li++) {
            var layeroption = this.options.layers[li];

            // preprocessing
            // standardize the capitalization to always be lowercase; makes things more consistent when testing
            layeroption.label = layeroption.label;

            switch (layeroption.type) {
                case 'xyz':
                    // XYZ which can be used as a Leaflet L.TileLayer
                    // params:
                    //      url             the URL template of the XYZ tile service, as is usual for a L.TileLayer
                    //      attribution     attribution (text/html) when this layer is showing
                    var options = L.Util.extend({ attribution:layeroption.attribution }, layeroption.tileLayerOptions);
                    this._layers[ layeroption.label ] = L.tileLayer(layeroption.url, options);
                    break;
                case 'google':
                    // Google basemap: various subtypes
                    // params:
                    //      url             the type of Map to use; any of: satellite, streets, terrain
                    //      attribution     NOT USED (here as a note) the Google Maps layer driver already provides the attribution
                    switch (layeroption.url) {
                        case 'satellite':
                            this._layers[ layeroption.label ] = new L.Google('SATELLITE', { zIndex:-1 });
                            break;
                        case 'hybrid':
                            this._layers[ layeroption.label ] = new L.Google('HYBRID', { zIndex:-1 });
                            break;
                        case 'streets':
                            this._layers[ layeroption.label ] = new L.Google('ROADMAP', { zIndex:-1 });
                            break;
                        case 'terrain':
                            this._layers[ layeroption.label ] = new L.Google('TERRAIN', { zIndex:-1 });
                            break;
                    }
                    break;
                case 'bing':
                    // Bing basemap: various subtypes
                    // params:
                    //      apikey      the Bing Maps API key to use for this layer
                    //      url         the type of Map to use; any of: aerial, street
                    switch (layeroption.url) {
                        case 'aerial':
                            this._layers[ layeroption.label ] = new L.BingLayer(layeroption.apikey, { zIndex:-1, type:'Aerial' });
                            break;
                        case 'street':
                            this._layers[ layeroption.label ] = new L.BingLayer(layeroption.apikey, { zIndex:-1, type:'Road' });
                            break;
                        case 'aerialwithlabels':
                            this._layers[ layeroption.label ] = new L.BingLayer(layeroption.apikey, { zIndex:-1, type:'AerialWithLabels' });
                            break;
                        default:
                            throw("L.Control.BasemapBar: Unknown Bing subtype ("+layeroption.url+") Must be: street, aerial");
                    }
                    break;
                default:
                    throw("L.Control.BasemapBar: Unknown layer 'type' ("+layeroption.type+") Must be: xyz, bing, google");
            } // end of layer type switch
        }

        // pass 2
        // create a button for each registered layer, complete with a data attribute for the layer to get toggled, and a linkage to the parent control
        // give them tabindex and a keydown-Enter handler, for keyboard usability
        var controlDiv = L.DomUtil.create('div', 'leaflet-control-basemapbar');
        for (var di=0, dl=this.options.layers.length; di<dl; di++) {
            var label            = this.options.layers[di].label;
            var tooltip          = this.options.layers[di].tooltip ? this.options.layers[di].tooltip : '';

            var button           = L.DomUtil.create('div', 'leaflet-control-basemapbar-option', controlDiv);
            button.control       = this;
            button.innerHTML     = label;
            button.title         = tooltip;
            button.tabIndex      = 0;
            button['data-layer'] = label;

            // on a click on a button, it calls the control's selectLayer() method by name
            L.DomEvent.addListener(button, 'click', function () {
                this.control.selectLayer( this['data-layer'] );
            });
            button.addEventListener('keypress', function (e) {
                if (e.key !== 'Enter') return;
                e.target.click();
            });

            // add the button to our internal random-access list, so we can arbitrarily fetch buttons later, e.g. to toggle one programatically
            this.buttons[label] = button;
        }

        // afterthought: add Open and Close buttons to the list, which when clicked, expands/collapses the other buttons
        // give them tabindex and a keydown-Enter handler, for keyboard usability
        this.closer = L.DomUtil.create('div', 'leaflet-control-basemapbar-close', controlDiv);
        this.closer.innerHTML = '&#9656;';
        this.closer.title     = 'Hide basemap selector';
        this.closer.tabIndex  = 0;
        this.closer.control   = this;

        L.DomEvent.addListener(this.closer, 'click', function () {
            this.control.collapseUI();
        });
        this.closer.addEventListener('keypress', (e) => {
            if (e.key !== 'Enter') return;
            this.closer.click();
            this.opener.focus();  // Safari doesn't support focus() and has other accessibility issues
        });

        this.opener = L.DomUtil.create('div', 'leaflet-control-basemapbar-open', controlDiv);
        this.opener.innerHTML = '<span>&#9666;</span> Base Maps';
        this.opener.title     = 'Show options for the base map';
        this.opener.tabIndex  = 0;
        this.opener.control   = this;

        L.DomEvent.addListener(this.opener, 'click', function () {
            this.control.expandUI();
        });
        this.opener.addEventListener('keypress', (e) => {
            if (e.key !== 'Enter') return;
            this.opener.click();
            this.closer.focus();  // Safari doesn't support focus() and has other accessibility issues
        });

        // keep mouse events from falling through to the map: don't drag-pan or double-click the map on accident
        L.DomEvent.disableClickPropagation(controlDiv);
        L.DomEvent.disableScrollPropagation(controlDiv);

        // and on launch.... collapse the UI
        this.collapseUI();

        // done!
        return controlDiv;
    },
    selectLayer: function (which) {
        // selectLayer() is *the* public method to trigger the basemap picker to select a layer, highlight appropriately, and trigger a change in the map layers
        for (var tag in this.buttons) {
            var button = this.buttons[tag];
            if (tag == which) {
                L.DomUtil.addClass(button,'leaflet-control-basemapbar-option-active');
                this.map.addLayer(this._layers[tag],true);
            } else {
                L.DomUtil.removeClass(button,'leaflet-control-basemapbar-option-active');
                this.map.removeLayer(this._layers[tag]);
            }
        }

        // return myself cuz method chaining is awesome
        return this;
    },
    whichLayer: function () {
        for (var tag in this.buttons) {
            var button = this.buttons[tag];
            if ( L.DomUtil.hasClass(button,'leaflet-control-basemapbar-option-active') ) return tag;
        }
        return null; // impossible, none of them at all
    },
    collapseUI: function () {
        // add the CSS which hides the picker buttons
        for (var tag in this.buttons) {
            var button = this.buttons[tag];
            L.DomUtil.addClass(button,'leaflet-control-basemapbar-hidden');
        }

        // then add/remove CSS to show/hide the opener/closer button
        L.DomUtil.addClass(this.closer, 'leaflet-control-basemapbar-hidden');
        L.DomUtil.removeClass(this.opener, 'leaflet-control-basemapbar-hidden');

        // return myself cuz method chaining is awesome
        return this;
    },
    expandUI: function () {
        // remove the CSS which hides the picker buttons
        for (var tag in this.buttons) {
            var button = this.buttons[tag];
            L.DomUtil.removeClass(button,'leaflet-control-basemapbar-hidden');
        }

        // then add/remove CSS to show/hide the opener/closer button
        L.DomUtil.removeClass(this.closer, 'leaflet-control-basemapbar-hidden');
        L.DomUtil.addClass(this.opener, 'leaflet-control-basemapbar-hidden');

        // return myself cuz method chaining is awesome
        return this;
    }
});
