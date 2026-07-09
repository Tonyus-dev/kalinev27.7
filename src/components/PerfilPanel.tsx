import React, { useState } from 'react';
import { Camera } from 'lucide-react';

export default function PerfilPanel() {
  const [apelido, setApelido] = useState('Ká');
  const [pronome, setPronome] = useState<'bem-vinda' | 'bem-vindo' | 'bem-vinde'>('bem-vindo');
  const [photo, setPhoto] = useState<string | null>(null);

  const processImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 192;
        canvas.height = 192;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // crop to center
          const size = Math.min(img.width, img.height);
          const x = (img.width - size) / 2;
          const y = (img.height - size) / 2;
          ctx.drawImage(img, x, y, size, size, 0, 0, 192, 192);
          const dataUrl = canvas.toDataURL('image/png');
          setPhoto(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleSave = () => {
    // Save to local storage or something
    alert('Perfil salvo com sucesso!');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10 max-w-2xl" id="panel-perfil-root">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[#FF4C1F] font-serif tracking-[0.2em] uppercase">Perfil</h2>
        <p className="text-sm text-[#A89F96] mt-2">Como Kaline e Klio te chamam, e a foto que aparece nas suas mensagens.</p>
      </div>

      {/* Photo Upload */}
      <div className="flex items-center gap-6">
        <div className="relative">
          {/* Avatar Container */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-[#FF4C1F]/40 p-1 bg-[#10131A] shadow-[0_0_20px_rgba(255,76,31,0.15)] flex items-center justify-center overflow-hidden">
            {photo ? (
              <img src={photo} alt="Perfil" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full rounded-full bg-[#0B0D12] flex items-center justify-center text-[#A89F96] font-serif text-3xl">
                {apelido.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {/* Upload Button */}
          <label className="absolute bottom-1 right-1 p-2 bg-[#962A1F] hover:bg-[#FF4C1F] rounded-full cursor-pointer transition-colors border-2 border-[#0B0D12] shadow-lg">
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            <Camera className="w-4 h-4 text-[#F7EFE7]" />
          </label>
        </div>
        <p className="text-[11px] text-[#A89F96] flex-1">
          PNG ou JPG, até 4 MB. Visível só pra você — ninguém mais usa esse app.
        </p>
      </div>

      {/* Fields */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#A89F96]">Apelido</label>
          <input
            type="text"
            value={apelido}
            onChange={(e) => setApelido(e.target.value)}
            className="w-full text-base px-4 py-3 bg-[#1A0A08] border border-[#3A1813] rounded-xl focus:outline-none focus:border-[#FF4C1F]/50 text-[#F7EFE7] transition-colors"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#A89F96]">Pronome de Tratamento</label>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setPronome('bem-vinda')}
              className={`px-5 py-2.5 rounded-full text-xs tracking-widest uppercase font-bold transition-colors border ${pronome === 'bem-vinda' ? 'bg-[#962A1F] border-[#FF4C1F] text-[#F7EFE7]' : 'bg-transparent border-[#252936] text-[#A89F96] hover:bg-[#10131A]'}`}
            >
              Bem-vinda
            </button>
            <button 
              onClick={() => setPronome('bem-vindo')}
              className={`px-5 py-2.5 rounded-full text-xs tracking-widest uppercase font-bold transition-colors border ${pronome === 'bem-vindo' ? 'bg-[#962A1F] border-[#FF4C1F] text-[#F7EFE7]' : 'bg-transparent border-[#252936] text-[#A89F96] hover:bg-[#10131A]'}`}
            >
              Bem-vindo
            </button>
            <button 
              onClick={() => setPronome('bem-vinde')}
              className={`px-5 py-2.5 rounded-full text-xs tracking-widest uppercase font-bold transition-colors border ${pronome === 'bem-vinde' ? 'bg-[#962A1F] border-[#FF4C1F] text-[#F7EFE7]' : 'bg-transparent border-[#252936] text-[#A89F96] hover:bg-[#10131A]'}`}
            >
              Bem-vinde
            </button>
          </div>
          <p className="text-[11px] text-[#A89F96]">
            Define como Kaline e Klio te saúdam no cockpit.
          </p>
        </div>
      </div>

      <div className="pt-8 flex justify-end">
        <button 
          onClick={handleSave}
          className="px-8 py-3 bg-[#FF4C1F] text-white hover:bg-[#FF6A45] rounded-xl text-sm font-bold shadow-lg shadow-[#FF4C1F]/20 transition-all"
        >
          Salvar
        </button>
      </div>

    </div>
  );
}
