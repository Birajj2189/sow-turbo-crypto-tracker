import { create } from "zustand";

interface CryptoState {
	currency: string;
	favorites: string[];
	setCurrency: (currency: string) => void;
	addFavorite: (coin: string) => void;
	removeFavorite: (coin: string) => void;
}

export const useCryptoStore = create<CryptoState>((set) => ({
	currency: "usd",
	favorites: [],
	setCurrency: (currency) => set({ currency }),
	addFavorite: (coin) =>
		set((state) => ({ favorites: [...state.favorites, coin] })),
	removeFavorite: (coin) =>
		set((state) => ({
			favorites: state.favorites.filter((fav) => fav !== coin),
		})),
}));
