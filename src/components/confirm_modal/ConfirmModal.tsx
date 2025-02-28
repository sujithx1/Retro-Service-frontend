import { Dialog, DialogTitle } from "@headlessui/react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm }: ConfirmModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="bg-black bg-opacity-50 fixed inset-0" onClick={onClose}></div>

      {/* Modal Content (Stop click propagation) */}
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto relative z-10"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click from closing the modal
      >
        <DialogTitle className="text-lg font-semibold">Confirm</DialogTitle>
        <p className="text-gray-600 mt-2">Are you sure?</p>
        <div className="mt-4 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={()=>{onConfirm();onClose()}} className="px-4 py-2 bg-red-600 text-white rounded">
            Yes
          </button>
        </div>
      </div>
    </Dialog>
  );
}
