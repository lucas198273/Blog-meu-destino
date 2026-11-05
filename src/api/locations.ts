import { apiGet } from '../lib/http';
import type { Location } from '../types/location';

export const locationsApi = {
  list: () => apiGet<Location[]>('/api/locations'),
};
