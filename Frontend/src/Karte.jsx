import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import zonen from './hystreet_locations.json'

// Ausschnitt, der alle 4 Zonen zeigt: [[Süd, West], [Nord, Ost]]
const AUSSCHNITT = [
    [47.3668, 8.5365],
    [47.3772, 8.5415],
]

function Karte({ farben, ausgewaehlteStandorte, umschalten }) {
    return (
        <MapContainer bounds={AUSSCHNITT} zoomSnap={0.25} style={{ height: '280px', width: '100%' }}>
            <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
            />

            {zonen.features.map((feature) => {
                const name = feature.properties.name
                const istGewaehlt = ausgewaehlteStandorte.includes(name)
                const farbe = farben[name]

                return (
                    // Leaflet ändert den Stil nicht von selbst. Die Auswahl steht im key,
                    // damit die Zone bei jedem Wechsel neu gezeichnet wird.
                    <GeoJSON
                        key={`${name}-${istGewaehlt}`}
                        data={feature}
                        style={{
                            color: farbe,
                            fillColor: farbe,
                            weight: 3,
                            opacity: istGewaehlt ? 1 : 0.15,
                            fillOpacity: istGewaehlt ? 0.5 : 0.15,
                        }}
                        eventHandlers={{ click: () => umschalten(name) }}
                    >
                        <Tooltip sticky>{name}</Tooltip>
                    </GeoJSON>
                )
            })}
        </MapContainer>
    )
}

export default Karte
