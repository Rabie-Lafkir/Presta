import NewZoneForm from "@/components/forms/NewZoneForm";
import MapCard from "@/components/ui/MapCard";

export default async function zones({ searchParams }) {
  return (
    <div
      className="w-full h-full  grid md:grid-cols-2 grid-cols-1 items-center place-items-center p-12 rounded-lg shadow-lg bg-white
    "
    >
      <NewZoneForm />
      <MapCard
        styles="min-w-full"
        zoom={13}
        center={{
          lat: 33.572374435642274,
          lng: -7.599711506827777,
        }}
        height="100%"
        markers={[]}
        modify={true}
        draggable={true}
      />
    </div>
  );
}
