export interface Shop {
  id: string;
  orgId: string;
  name: string;
  location: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateShopPayload {
  name: string;
  location?: string | null;
}

export interface UpdateShopPayload extends Partial<CreateShopPayload> {
  isActive?: boolean;
}
