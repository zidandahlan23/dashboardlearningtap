import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  nama: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ isOpen, nama, onClose, onConfirm }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[420px] overflow-hidden">
        <div className="px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#B84A3E]/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-[#B84A3E]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-[#2C3531]">Hapus Data Peserta</h3>
              <p className="text-[13px] text-[#566A7F] mt-2 leading-relaxed">
                Apakah Anda yakin ingin menghapus data{' '}
                <span className="font-medium text-[#2C3531]">{nama}</span>? Tindakan ini tidak dapat
                dibatalkan.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8A938B] hover:bg-[#F0F4F1] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E0E8E3] bg-[#F0F4F1]/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#566A7F] border border-[#E0E8E3] hover:bg-white transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-white bg-[#B84A3E] hover:bg-[#9a3d33] transition-colors shadow-sm hover:shadow-md"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
