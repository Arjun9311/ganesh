export type CategoryId =
  | 'face'
  | 'eyes'
  | 'trunk'
  | 'ears'
  | 'crown'
  | 'clothes'
  | 'jewellery'
  | 'tilak'
  | 'flowers'
  | 'aura'
  | 'mushika'
  | 'colors';

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Divine';

export interface ShopItem {
  id: string;
  categoryId: CategoryId;
  name: string;
  hindiName: string;
  rarity: Rarity;
  vighnasRequired: number; // 0 for unlocked by default
  icon: string;
  description: string;
}

export interface GaneshaCustomization {
  face: string;
  eyes: string;
  trunk: string;
  ears: string;
  crown: string;
  clothes: string;
  jewellery: string;
  tilak: string;
  flowers: string;
  aura: string;
  mushika: string;
  skinColor: string;
  clothesColor: string;
  decorationColor: string;
}

export interface SavedGaneshaDesign {
  id: string;
  name: string;
  createdAt: string;
  config: GaneshaCustomization;
  isCurrentAvatar?: boolean;
}

export interface ColorSwatch {
  id: string;
  name: string;
  hex: string;
  label: string;
}
