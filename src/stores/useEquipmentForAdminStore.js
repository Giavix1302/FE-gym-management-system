import { create } from "zustand"

const useEquipmentForAdminStore = create((set, get) => ({
  // State
  equipments: [],
  selectedLocation: null,
  loading: false,
  error: null,

  // Actions
  setEquipments: (equipments) => set({ equipments }),

  setSelectedLocation: (location) => set({ selectedLocation: location }),

  addEquipment: (equipment) =>
    set((state) => ({
      equipments: [...state.equipments, equipment],
    })),

  updateEquipment: (id, updatedEquipment) =>
    set((state) => ({
      equipments: state.equipments.map((equipment) =>
        equipment._id === id ? { ...equipment, ...updatedEquipment } : equipment,
      ),
    })),

  removeEquipment: (id) =>
    set((state) => ({
      equipments: state.equipments.filter((equipment) => equipment._id !== id),
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  // Get equipments by location
  getEquipmentsByLocation: (locationId) => {
    const state = get()
    return state.equipments.filter((equipment) => equipment.locationId === locationId)
  },

  // Clear all data
  clearStore: () =>
    set({
      equipments: [],
      selectedLocation: null,
      loading: false,
      error: null,
    }),
}))

export default useEquipmentForAdminStore
