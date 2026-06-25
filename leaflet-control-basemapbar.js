/*
 * Bar-style basemap picker by GreenInfo Network
 */

L.Control.BasemapBar = L.Control.extend({
    options: {
        position: 'topleft',
        layers: [],
        selected: undefined,
        expanded: false,
        enhancedfocus: false,
        expandButtonHTML: 'Base Maps &gt;',
        collapseButtonHTML: '&lt; Close',
    },
    initialize: function(options) {
        L.setOptions(this, options);
        if (! this.options.layers || ! Array.isArray(this.options.layers) || ! this.options.layers.length) throw "L.Control.BasemapBar: missing layers list";
        this._map = undefined;  // our current L.Map
    },
    onAdd: function (map) {
        this._container = document.createElement('div');
        this._container.classList.add('leaflet-control-basemapbar', 'leaflet-control-basemapbar-collapsed');

        const randomid = Math.random().toString(36).substring(0, 10);

        this._container.innerHTML = `
        <div>
            <button type="button" class="leaflet-control-basemapbar-expandbutton" aria-controls="leaflet-control-basemapbar-expandedcontent-${randomid}" aria-expanded="false"></button>
            <button type="button" class="leaflet-control-basemapbar-collapsebutton" aria-controls="leaflet-control-basemapbar-expandedcontent-${randomid}" aria-expanded="false"></button>
            <fieldset class="leaflet-control-basemapbar-expandedcontent" id="leaflet-control-basemapbar-expandedcontent-${randomid}">
                <legend></legend>
            </fieldset>
        </div>
        `;

        this._expandbutton = this._container.querySelector('.leaflet-control-basemapbar-expandbutton');
        this._collapsebutton = this._container.querySelector('.leaflet-control-basemapbar-collapsebutton');
        this._expandbutton.innerHTML = this.options.expandButtonHTML;
        this._collapsebutton.innerHTML = this.options.collapseButtonHTML;
        this._expandbutton.addEventListener('click', () => {
            this.expand();
            this._collapsebutton.focus();
        });
        this._collapsebutton.addEventListener('click', () => {
            this.collapse();
            this._expandbutton.focus();
        });

        this._optionbuttoncontainer = this._container.querySelector('.leaflet-control-basemapbar-expandedcontent');
        this.options.layers.forEach((layeroption) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('data-layeroption-id', layeroption.id);
            button.setAttribute('aria-pressed', 'false');
            button.classList.add('leaflet-control-basemapbar-optionbutton');
            button.innerText = layeroption.id;
            button.title = layeroption.tooltip;
            button.setAttribute('aria-description', layeroption.tooltip);

            button._leaflet_control_basemapbar_layer = layeroption.layer;

            this._optionbuttoncontainer.append(button);

            button.addEventListener('click', () => {
                this.selectLayer(layeroption.id);
            });
        });
        this._optionbuttons = this._optionbuttoncontainer.querySelectorAll('button');

        // if enhancedfocus was requested, add that extra class
        if (this.options.enhancedfocus) {
            this._container.classList.add('leaflet-control-basemapbar-enhancedfocus');
        }

        // select the "selected" option, or else the first option
        setTimeout(() => {
            const selectlayerid = this.options.selected ? this.options.selected : this.options.layers[0].id;
            this.selectLayer(selectlayerid);
        }, 0.1 * 1000);

        // expand the UI if requested
        if (this.options.expanded) {
            setTimeout(() => {
                this.expand();
            }, 0.1 * 1000);
        }

        // done
        this._map = map;  // our current L.Map
        return this._container;
    },
    collapse: function () {
        this._container.classList.add('leaflet-control-basemapbar-collapsed');
        this._container.classList.remove('leaflet-control-basemapbar-expanded');

        this._expandbutton.setAttribute('aria-expanded', 'false');
        this._collapsebutton.setAttribute('aria-expanded', 'false');

        return this;  // allow method chaining
    },
    expand: function () {
        this._container.classList.remove('leaflet-control-basemapbar-collapsed');
        this._container.classList.add('leaflet-control-basemapbar-expanded');

        this._expandbutton.setAttribute('aria-expanded', 'true');
        this._collapsebutton.setAttribute('aria-expanded', 'true');

        return this;  // allow method chaining
    },
    selectLayer: function (layerid) {
        this._optionbuttons.forEach((button) => {
            const istheone = layerid == button.getAttribute('data-layeroption-id');
            if (istheone) {
                button.classList.add('leaflet-control-basemapbar-optionbutton-selected');
                button.setAttribute('aria-pressed', 'true');
                this._map.addLayer(button._leaflet_control_basemapbar_layer);
            } else {
                button.classList.remove('leaflet-control-basemapbar-optionbutton-selected');
                button.setAttribute('aria-pressed', 'false');
                this._map.removeLayer(button._leaflet_control_basemapbar_layer);
            }
        });

        return this;  // allow method chaining
    },
    whichLayer: function () {
        const button = [...this._optionbuttons].filter(button => button.matches('.leaflet-control-basemapbar-optionbutton-selected'));
        return button.length ? button[0].getAttribute('data-layeroption-id') : undefined;
    },
});
