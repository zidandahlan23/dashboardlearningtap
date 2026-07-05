import { TreePalm } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

/** Keamanan akses dijalankan server-side oleh Netlify Function. */
export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-[#F0F4F1] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0px_8px_32px_rgba(60,107,86,0.12)] p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3D6B56] to-[#D9A443] flex items-center justify-center mx-auto mb-4"><TreePalm className="w-8 h-8 text-white" /></div>
        <h1 className="text-[20px] font-bold text-[#2C3531]">Dashboard Monitoring Sertifikasi</h1>
        <p className="text-[13px] text-[#8A938B] mt-2 mb-6">Akses dilakukan melalui password dashboard dan password admin pada Netlify Function.</p>
        <button onClick={onLogin} className="px-4 py-2.5 rounded-lg text-[13px] font-medium text-white bg-[#3D6B56] hover:bg-[#2d5444]">Buka Dashboard</button>
      </div>
    </div>
  );
}
