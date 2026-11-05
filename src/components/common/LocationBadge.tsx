import { MapPin } from 'lucide-react';
import { useLocations } from '../../hooks/useLocations';
import { Badge } from '../ui/Badge';

export function LocationBadge({
  locationId,
  inline = false,
}: {
  locationId: string | null | undefined;
  inline?: boolean;
}) {
  const locations = useLocations();
  if (!locationId) return null;

  if (locations.isError) {
    return (
      <span className="text-xs text-slate-500" role="status">
        Localização indisponível
      </span>
    );
  }

  const location = locations.data?.find((item) => item.id === locationId);
  if (!location) return null;

  const content = (
    <>
      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {location.nome}
    </>
  );

  return inline ? (
    <span className="inline-flex items-center gap-1.5">{content}</span>
  ) : (
    <Badge className="gap-1.5 bg-teal-50 text-teal-800 ring-1 ring-teal-100">
      {content}
    </Badge>
  );
}
