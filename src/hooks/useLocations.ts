import { useQuery } from '@tanstack/react-query';
import { locationsApi } from '../api/locations';

export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: () => locationsApi.list(),
    staleTime: 10 * 60_000,
  });
}
