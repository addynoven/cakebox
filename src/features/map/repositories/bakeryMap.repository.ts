import { BakeryLocation } from '../models/bakeryLocation.model';

export const BAKERY_LOCATIONS: BakeryLocation[] = [
  {
    id: 'loc-1',
    name: 'CakeBox Downtown Atelier',
    address: '104 Sweetwater Avenue, Downtown Springfield',
    hours: 'Mon–Sun: 8:00 AM – 9:00 PM',
    specialty: 'Same-Day Signature Drip Cakes & Custom Tiers',
    distance: '0.8 miles away',
  },
  {
    id: 'loc-2',
    name: 'The Sugar Blossom Cake Studio',
    address: '742 Evergreen Plaza, Suite B',
    hours: 'Tue–Sun: 9:00 AM – 7:00 PM',
    specialty: 'Vintage Lambeth Buttercream & Organic Gluten-Free',
    distance: '1.5 miles away',
  },
  {
    id: 'loc-3',
    name: 'Velvet & Crumbs Bakery Lounge',
    address: '520 Blossom Hill Road',
    hours: 'Daily: 8:30 AM – 8:00 PM',
    specialty: 'Belgian Chocolate Ganache & European Petit Fours',
    distance: '3.2 miles away',
  },
];

export class BakeryMapRepository {
  static getLocations(): BakeryLocation[] {
    return BAKERY_LOCATIONS;
  }

  static getLocationById(id: string): BakeryLocation | undefined {
    return BAKERY_LOCATIONS.find((loc) => loc.id === id);
  }
}
