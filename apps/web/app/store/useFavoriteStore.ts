import { create } from "zustand";

interface FavoriteStore {
	favorites: string[];
	toggleFavorite: (id: string) => void;
	isFavorite: (id: string) => boolean;
}

// Helper function to load favorites from localStorage
const loadFavorites = (): string[] => {
	try {
		const storedFavorites = localStorage.getItem("favorites");
		return storedFavorites ? JSON.parse(storedFavorites) : [];
	} catch (error) {
		console.error("Failed to load favorites:", error);
		return [];
	}
};

// Store configuration with localStorage persistence
export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
	// Initialize favorites from localStorage
	favorites: loadFavorites(),

	// Toggle favorite status
	toggleFavorite: (id: string) => {
		set((state) => {
			const favorites = state.favorites.includes(id)
				? state.favorites.filter((fav) => fav !== id) // Remove if already favorite
				: [...state.favorites, id]; // Add if not favorite

			// Update localStorage
			localStorage.setItem("favorites", JSON.stringify(favorites));

			return { favorites };
		});
	},

	// Check if a crypto is in favorites
	isFavorite: (id: string) => get().favorites.includes(id),
}));
