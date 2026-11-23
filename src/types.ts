export type Favorite = {
  id: string;
  name: string;
  url: string;
  groupId?: string;
  pinned: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
};

export type FavoriteGroup = {
  id: string;
  name: string;
  position: number;
};

export type NexusData = {
  favorites: Favorite[];
  groups: FavoriteGroup[];
};
