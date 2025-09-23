import { create } from 'zustand';

interface AccountPageState {
  // UI State
  isEditing: boolean;
  isSubmitting: boolean;
  isPasswordModalOpen: boolean;
  
  // Form submission handler
  submitForm: (() => void) | null;
  
  // Actions
  setIsEditing: (isEditing: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsPasswordModalOpen: (isOpen: boolean) => void;
  setSubmitForm: (submitFn: (() => void) | null) => void;
  
  // Convenience methods
  startEditing: () => void;
  stopEditing: () => void;
  toggleEditing: () => void;
  openPasswordModal: () => void;
  closePasswordModal: () => void;
  handleSave: () => void;
  handleCancel: () => void;
}

export const useAccountPageStore = create<AccountPageState>((set, get) => ({
  // Initial state
  isEditing: false,
  isSubmitting: false,
  isPasswordModalOpen: false,
  submitForm: null,
  
  // Basic setters
  setIsEditing: (isEditing) => set({ isEditing }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setIsPasswordModalOpen: (isOpen) => set({ isPasswordModalOpen: isOpen }),
  setSubmitForm: (submitFn) => set({ submitForm: submitFn }),
  
  // Convenience methods
  startEditing: () => set({ isEditing: true }),
  stopEditing: () => set({ isEditing: false }),
  toggleEditing: () => set((state) => ({ isEditing: !state.isEditing })),
  openPasswordModal: () => set({ isPasswordModalOpen: true }),
  closePasswordModal: () => set({ isPasswordModalOpen: false }),
  
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
