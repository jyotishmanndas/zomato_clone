import type { IOrder } from '../types';
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { useSocket } from '../hooks/useSocket';

declare module "leaflet" {
  namespace Routing {
    function control(options: any): any;
    function osrmv1(options?: any): any;
  }
}

const riderIcon = new L.DivIcon({
  html: "🛵",
  iconSize: [30, 30],
  className: ""
});

const deliveryIcon = new L.DivIcon({
  html: "📦",
  iconSize: [30, 30],
  className: ""
});

// 🔥 Recenter map when rider moves
const Recenter = ({ position }: { position: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [position, map]);

  return null;
};

// 🔥 Routing component
const Routing = ({ from, to }: {
  from: [number, number],
  to: [number, number],
}) => {

  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    const control = L.Routing.control({
      waypoints: [L.latLng(from), L.latLng(to)],
      lineOptions: {
        styles: [{ color: "#E23744", weight: 5 }]
      },
      fitSelectedRoutes: true, // 🔥 important
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
      createMarker: () => null,
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1"
      })
    }).addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [from, to, map]);

  return null;
};

interface RiderOrderMapProps {
  order: IOrder;
}

const RiderOrderMap = ({ order }: RiderOrderMapProps) => {
  const [riderLocation, setRiderLocation] = useState<[number, number] | null>(null);
  const socket = useSocket();

  if (
    order.deliveryAddress.latitude == null ||
    order.deliveryAddress.longitude == null
  ) {
    return null;
  }
  

  // 🔥 TEMP FIX (because your backend data is swapped)
  const deliveryLocation: [number, number] = [
    order.deliveryAddress.longitude, // actually latitude
    order.deliveryAddress.latitude   // actually longitude
  ];

  useEffect(() => {
    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          // ✅ CORRECT FORMAT (DO NOT SWAP)
          setRiderLocation([latitude, longitude]);

          console.log("Rider:", latitude, longitude);
          console.log("Delivery:", deliveryLocation);

          if (!socket.current) return;

          socket.current.emit("rider:location", {
            userId: order.userId,
            latitude,
            longitude
          });
        },
        (err) => console.log("Location error", err),
        {
          enableHighAccuracy: true,
          maximumAge: 500,
          timeout: 1000
        }
      );
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 3000);

    return () => clearInterval(interval);
  }, [order.userId]);

  if (!riderLocation) return null;

  return (
    <div className='rounded-xl bg-white shadow-sm p-3'>
      <MapContainer
        center={riderLocation}
        zoom={14}
        className='h-87.5 w-full rounded-lg'
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {/* 🔥 keep map centered */}
        <Recenter position={riderLocation} />

        <Marker position={riderLocation} icon={riderIcon}>
          <Popup>You (Rider)</Popup>
        </Marker>

        <Marker position={deliveryLocation} icon={deliveryIcon}>
          <Popup>Delivery Location</Popup>
        </Marker>

        <Routing from={riderLocation} to={deliveryLocation} />
      </MapContainer>
    </div>
  );
};

export default RiderOrderMap;