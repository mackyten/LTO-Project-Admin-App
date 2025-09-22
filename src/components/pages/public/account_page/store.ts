import { create } from 'zustand';

interface AccountPageState {
  // UI State
  isEditing: boolean;
  isSubmitting: boolean;
  
  // Form submission handler
  submitForm: (() => void) | null;
  
  // Actions
  setIsEditing: (isEditing: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setSubmitForm: (submitFn: (() => void) | null) => void;
  
  // Convenience methods
  startEditing: () => void;
  stopEditing: () => void;
  toggleEditing: () => void;
  handleSave: () => void;
  handleCancel: () => void;
}

export const useAccountPageStore = create<AccountPageState>((set, get) => ({
  // Initial state
  isEditing: false,
  isSubmitting: false,
  submitForm: null,
  
  // Basic setters
  setIsEditing: (isEditing) => set({ isEditing }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setSubmitForm: (submitFn) => set({ submitForm: submitFn }),
  
  // Convenience methods
  startEditing: () => set({ isEditing: true }),
  stopEditing: () => set({ isEditing: false }),
  toggleEditing: () => set((state) => ({ isEditing: !state.isEditing })),
  
  // Action handlers
  handleSave: () => {
    const { submitForm } = get();
    if (submitForm) {
      submitForm();
    }
  },
  
  handleCancel: () => {
    set({ isEditing: false });
    // Form reset will be handled by the form component
  },
}));
