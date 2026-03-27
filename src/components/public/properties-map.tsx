"use client";

import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const brandIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface MapProperty {
  slug: string;
  title: string;
  address: string;
  lat: number;
  lng: number;
}

interface PropertiesMapProps {
  properties: MapProperty[];
}

// Center of Viareggio
const VIAREGGIO_CENTER: [number, number] = [43.8695, 10.2527];

export function PropertiesMap({ properties }: PropertiesMapProps) {
  return (
    <div className="w-full h-[420px] rounded-2xl overflow-hidden border border-[#E0D8CC] shadow-sm">
      <MapContainer
        center={VIAREGGIO_CENTER}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {properties.map((p) => (
          <Marker key={p.slug} position={[p.lat, p.lng]} icon={brandIcon}>
            <Popup>
              <div className="text-sm min-w-[140px]">
                <p className="font-semibold text-[#2D3436] mb-0.5">{p.title}</p>
                <p className="text-gray-500 text-xs mb-2">{p.address}</p>
                <Link
                  href={`/appartamenti/${p.slug}`}
                  className="text-[#4A90A4] text-xs font-medium hover:underline"
                >
                  Vedi appartamento →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
