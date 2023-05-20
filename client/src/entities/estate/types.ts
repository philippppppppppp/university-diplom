export type EstateType = "house" | "flat";

export interface EstateItemInfo {
  id: string;
  title: string;
  description: string;
  images: string[];
  address: string;
  priceUAH: number;
  createdAt: string;
  rooms: number;
  livingAreaM2: number;
  kitchenAreaM2: number;
  type: EstateType;
}

export type EstateListItem = EstateItemInfo;

export interface EstateItem extends EstateItemInfo {
  author: {
    id: string;
    name: string;
    phone: string;
    lastOnline?: string;
  };
}

export interface EstateFormValues {
  title: string;
  description: string;
  images: string[];
  address: string;
  priceUAH: string;
  rooms: string;
  livingAreaM2: string;
  kitchenAreaM2: string;
  type: EstateType | "";
}

export interface ListFilters {
  type?: string;
  rooms?: string;
  priceFrom?: string;
  priceTo?: string;
}
