export default function VenueCard({ venue }) {
  const capacityStr = venue.capacity ? `MEM_ALLOC: ${venue.capacity}b` : 'MEM_ALLOC: UNKNOWN';

  return (
    <header className="venue-header">
      <h1 className="venue-name">{venue.name}</h1>
      <p className="venue-location">
        [{venue.city}{venue.city && venue.country ? ', ' : ''}{venue.country}]
      </p>
      <div className="venue-capacity">{capacityStr}</div>
    </header>
  );
}
