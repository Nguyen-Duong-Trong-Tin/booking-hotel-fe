import { Layout, Typography } from "antd";
import { divIcon } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { getRooms } from "../../../apis/roomApi";
import { getRoomAmenities } from "../../../apis/roomAmenityApi";
import ClientFooter from "../../../components/layout/ClientFooter";
import ClientHeader from "../../../components/layout/ClientHeader";

const { Content } = Layout;
const { Title } = Typography;

const DEFAULT_CENTER = {
  lat: 16.0471,
  lng: 108.2062,
  source: "Da Nang",
};

const DEFAULT_PAGE_SIZE = 50;

const formatDistance = (km) => `${km.toFixed(1)} km`;

const haversineKm = (a, b) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(h));
};

const normalizeRoom = (room) => {
  const latitude = room?.latitude ?? room?.lat ?? null;
  const longitude = room?.longitude ?? room?.lng ?? null;
  return {
    id: room?.id,
    roomNumber: room?.roomNumber,
    price: Number(room?.price || 0),
    capacity: room?.capacity ?? null,
    category: room?.category?.name || "",
    latitude,
    longitude,
  };
};

const priceLabelIcon = (price) =>
  divIcon({
    className: "price-label-marker",
    html: `<div class="price-label" style="pointer-events:auto;transform:translate(-50%,-100%);background:linear-gradient(180deg,#ffffff 0%,#f8fafc 100%);border:1px solid #e2e8f0;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:700;letter-spacing:0.2px;color:#0f172a;box-shadow:0 12px 28px rgba(15,23,42,0.16);white-space:nowrap;display:inline-flex;align-items:center;gap:6px;position:relative;">Price: $${price} / night<span style="display:block;position:absolute;left:50%;bottom:-6px;width:10px;height:10px;background:#ffffff;border-right:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;transform:translateX(-50%) rotate(45deg);"></span></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

const MapUpdater = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center?.lat && center?.lng) {
      map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
    }
  }, [center, map]);

  return null;
};

const MapClickHandler = ({ onPick }) => {
  useMapEvents({
    click: (event) => {
      const target = event?.originalEvent?.target;
      if (target?.closest?.(".price-label")) {
        return;
      }
      onPick({ lat: event.latlng.lat, lng: event.latlng.lng, source: "Custom pin" });
    },
  });

  return null;
};

export default function Destinations() {
  const navigate = useNavigate();
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [locating, setLocating] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [locationWarning, setLocationWarning] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [roomsError, setRoomsError] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [loadingAmenities, setLoadingAmenities] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoadingRooms(true);
      setRoomsError("");

      try {
        let page = 0;
        let totalPages = 1;
        const collected = [];

        while (page < totalPages) {
          const response = await getRooms({ page, size: DEFAULT_PAGE_SIZE });
          if (response?.status !== 200) {
            const errorText =
              response?.errors?.join(", ") || response?.message || "Failed to load rooms";
            setRoomsError(errorText);
            break;
          }

          const data = response?.data || {};
          const items = data?.items || [];
          collected.push(...items);

          totalPages = data?.totalPages || 1;
          page += 1;
        }

        setRooms(collected.map(normalizeRoom));
      } catch (err) {
        const errorText =
          err?.response?.data?.errors?.join(", ") ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load rooms";
        setRoomsError(errorText);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationWarning("Geolocation is not supported by this browser.");
      return;
    }

    setLocating(true);
    setLocationWarning("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          source: "Your location",
        });
        const accuracyMeters = position.coords.accuracy;
        setLocationAccuracy(accuracyMeters);
        if (accuracyMeters && accuracyMeters > 5000) {
          setLocationWarning(
            "Location looks approximate. Click the map to set a more accurate spot."
          );
        }
        setLocating(false);
      },
      () => {
        setLocationWarning(
          "Location permission denied. Click the map to set your location manually."
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const roomsByDistance = useMemo(() => {
    return rooms
      .map((room) => {
        if (room.latitude == null || room.longitude == null) {
          return { ...room, distance: Number.POSITIVE_INFINITY };
        }
        return {
          ...room,
          distance: haversineKm(center, { lat: room.latitude, lng: room.longitude }),
        };
      })
      .sort((a, b) => a.distance - b.distance);
  }, [center, rooms]);

  const roomsWithCoords = useMemo(
    () => rooms.filter((room) => room.latitude != null && room.longitude != null),
    [rooms]
  );

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId),
    [rooms, selectedRoomId]
  );

  const selectedRoomDistance = useMemo(() => {
    if (!selectedRoomId) return null;
    const match = roomsByDistance.find((room) => room.id === selectedRoomId);
    if (!match || !Number.isFinite(match.distance)) return null;
    return match.distance;
  }, [roomsByDistance, selectedRoomId]);

  useEffect(() => {
    const fetchAmenities = async () => {
      if (!selectedRoomId) {
        setSelectedAmenities([]);
        return;
      }

      setLoadingAmenities(true);
      try {
        const response = await getRoomAmenities({ roomId: selectedRoomId, size: 20 });
        const items = response?.data?.items || response?.items || [];
        setSelectedAmenities(items);
      } catch (err) {
        setSelectedAmenities([]);
      } finally {
        setLoadingAmenities(false);
      }
    };

    fetchAmenities();
  }, [selectedRoomId]);

  const handleSelectRoom = (room) => {
    if (!room) return;
    setCenter({
      lat: room.latitude ?? center.lat,
      lng: room.longitude ?? center.lng,
      source: room.roomNumber || "Room",
    });
    setSelectedRoomId(room.id);
  };

  const onUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationWarning("Geolocation is not supported by this browser.");
      return;
    }

    setLocating(true);
    setLocationWarning("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          source: "Your location",
        });
        const accuracyMeters = position.coords.accuracy;
        setLocationAccuracy(accuracyMeters);
        if (accuracyMeters && accuracyMeters > 5000) {
          setLocationWarning(
            "Location looks approximate. Click the map to set a more accurate spot."
          );
        }
        setLocating(false);
      },
      () => {
        setLocationWarning(
          "Location permission denied. Click the map to set your location manually."
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <Layout className="min-h-screen bg-slate-50 text-slate-900">
      <ClientHeader />
      <Content className="px-4 py-10">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Title level={2} className="!mb-1 text-slate-900">
                Destinations
              </Title>
              <p className="text-sm text-slate-500">
                Sorted by distance from {center.source}. Select a marker to
                re-center.
              </p>
            </div>
            <button
              type="button"
              onClick={onUseLocation}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              disabled={locating}
            >
              {locating ? "Locating..." : "Use my location"}
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Rooms near you
                </h3>
                <span className="text-xs text-slate-400">
                  {roomsByDistance.length} rooms
                </span>
              </div>
              {roomsError ? (
                <p className="mt-4 text-sm text-rose-500">{roomsError}</p>
              ) : null}
              <div className="mt-4 space-y-3">
                {loadingRooms ? (
                  <p className="text-sm text-slate-500">Loading rooms...</p>
                ) : null}
                {!loadingRooms && roomsByDistance.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No rooms found. Add rooms in the admin panel or check the API response.
                  </p>
                ) : null}
                {roomsByDistance.map((room) => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => handleSelectRoom(room)}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-slate-300 hover:bg-white"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Room {room.roomNumber || "N/A"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {room.category || "Uncategorized"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        ${room.price}
                      </p>
                      {Number.isFinite(room.distance) ? (
                        <p className="text-xs text-slate-400">
                          {formatDistance(room.distance)}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400">No location</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Vietnam map
                  </h3>
                  <p className="text-xs text-slate-500">Markers show room prices.</p>
                </div>
              </div>
              {locationWarning ? (
                <p className="mt-2 text-xs text-amber-600">{locationWarning}</p>
              ) : null}
              {locationAccuracy ? (
                <p className="mt-1 text-xs text-slate-400">
                  Location accuracy: {Math.round(locationAccuracy)} m
                </p>
              ) : null}

              <div className="relative mt-4 h-[420px] w-full overflow-hidden rounded-2xl">
                <MapContainer
                  center={[center.lat, center.lng]}
                  zoom={6}
                  minZoom={4}
                  className="h-full w-full"
                  scrollWheelZoom
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapUpdater center={center} />
                  <MapClickHandler onPick={setCenter} />

                  {roomsWithCoords.map((room) => (
                    <Marker
                      key={room.id}
                      position={[room.latitude, room.longitude]}
                      icon={priceLabelIcon(room.price)}
                      eventHandlers={{
                        click: () => handleSelectRoom(room),
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <p className="font-semibold">Room {room.roomNumber}</p>
                          <p className="text-slate-500">{room.category}</p>
                          <p className="font-semibold text-slate-900">${room.price}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  <CircleMarker
                    center={[center.lat, center.lng]}
                    radius={6}
                    pathOptions={{
                      color: "#1d4ed8",
                      weight: 2,
                      fillColor: "#3b82f6",
                      fillOpacity: 0.9,
                    }}
                  >
                    <Popup>{center.source}</Popup>
                  </CircleMarker>
                </MapContainer>
              </div>
              {selectedRoom ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Room {selectedRoom.roomNumber || "N/A"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {selectedRoom.category || "Uncategorized"}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        ${selectedRoom.price}
                      </p>
                      {selectedRoom.capacity != null ? (
                        <p className="mt-1 text-xs text-slate-400">
                          Capacity: {selectedRoom.capacity} guests
                        </p>
                      ) : null}
                      {selectedRoomDistance != null ? (
                        <p className="mt-1 text-xs text-slate-400">
                          {formatDistance(selectedRoomDistance)} away
                        </p>
                      ) : null}
                      {selectedRoom.latitude != null && selectedRoom.longitude != null ? (
                        <p className="mt-1 text-xs text-slate-400">
                          {selectedRoom.latitude.toFixed(5)}, {selectedRoom.longitude.toFixed(5)}
                        </p>
                      ) : null}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {loadingAmenities ? (
                          <span className="text-xs text-slate-400">Loading amenities...</span>
                        ) : selectedAmenities.length > 0 ? (
                          selectedAmenities.slice(0, 6).map((item) => (
                            <span
                              key={item.id}
                              className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
                            >
                              {item.amenity?.name || "Amenity"}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">No amenities</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/rooms/${selectedRoom.id}`)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                    >
                      View detail
                    </button>
                  </div>
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </Content>
      <ClientFooter />
    </Layout>
  );
}
