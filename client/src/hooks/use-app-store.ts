import { create } from 'zustand';
import { AppState, Category, ModalType, Priority, Status, TimePeriod } from '@/types';

interface AppStore extends AppState {
  setSelectedTimePeriod: (period: TimePeriod) => void;
  setCurrentModal: (modal: ModalType, requestId?: number | null) => void;
  setSelectedCategory: (category: Category | 'all') => void;
  setSelectedPriority: (priority: Priority | 'all') => void;
  setSelectedStatus: (status: Status | 'all') => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // Initial state
  selectedTimePeriod: 'this-month',
  currentModal: null,
  selectedRequestId: null,
  selectedCategory: 'all',
  selectedPriority: 'all',
  selectedStatus: 'all',
  searchQuery: '',

  // Actions
  setSelectedTimePeriod: (period) => set({ selectedTimePeriod: period }),
  
  setCurrentModal: (modal, requestId = null) => set({ 
    currentModal: modal,
    selectedRequestId: requestId !== undefined ? requestId : null
  }),
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  setSelectedPriority: (priority) => set({ selectedPriority: priority }),
  
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  resetFilters: () => set({ 
    selectedCategory: 'all',
    selectedPriority: 'all',
    selectedStatus: 'all',
    searchQuery: ''
  })
}));
