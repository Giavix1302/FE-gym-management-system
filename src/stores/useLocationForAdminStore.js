import { create } from "zustand"

const useLocationForAdminStore = create((set, get) => ({
  // State
  locations: [],
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalLocations: 0,
    limit: 10,
    hasNext: false,
    hasPrev: false,
  },
  loading: false,
  error: null,
  searchTerm: "",
  selectedProvince: "",

  // Actions
  setLocations: (locations) => set({ locations }),

  setPagination: (pagination) => set({ pagination }),

  addLocation: (location) =>
    set((state) => ({
      locations: [location, ...state.locations],
    })),

  updateLocation: (id, updatedLocation) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location._id === id ? { ...location, ...updatedLocation } : location,
      ),
    })),

  removeLocation: (id) =>
    set((state) => ({
      locations: state.locations.filter((location) => location._id !== id),
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setSearchTerm: (searchTerm) => set({ searchTerm }),

  setSelectedProvince: (selectedProvince) => set({ selectedProvince }),

  // Get filtered locations based on search and province filter
  getFilteredLocations: () => {
    const state = get()
    const { locations, searchTerm, selectedProvince } = state

    return locations.filter((location) => {
      const matchesSearch =
        !searchTerm ||
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.phone.includes(searchTerm) ||
        location.address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address.ward.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesProvince = !selectedProvince || location.address.province === selectedProvince

      return matchesSearch && matchesProvince
    })
  },

  // Get unique provinces for filter dropdown
  getUniqueProvinces: () => {
    const state = get()
    const provinces = [...new Set(state.locations.map((location) => location.address.province))]
    return provinces.sort()
  },

  // Clear all data
  clearStore: () =>
    set({
      locations: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalLocations: 0,
        limit: 10,
        hasNext: false,
        hasPrev: false,
      },
      loading: false,
      error: null,
      searchTerm: "",
      selectedProvince: "",
    }),
}))

export default useLocationForAdminStore
