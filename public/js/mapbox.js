/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZnVtaXR1cyIsImEiOiJjbGhvcWgwMzAxeWpoM2RudXlqN2lwd2tvIn0.e2K_KRXySdpY3pSxjg6Dwg';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/fumitus/clhorsrue01r501pnelw705r6',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popUp

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extends map bounds to include current location
    bounds.extend(loc.coordinates);

    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 200,
        right: 200,
      },
    });
  });
};
