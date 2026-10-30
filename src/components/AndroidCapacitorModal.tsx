/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AndroidCapacitorModal.tsx
 * Instructions and one-click copy commands to compile MIAU CALL to an Android APK
 */

import React, { useState } from 'react';
import { X, Copy, Check, Smartphone, Terminal, Sparkles, Download } from 'lucide-react';

interface AndroidCapacitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidCapacitorModal: React.FC<AndroidCapacitorModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const steps = [
    {
      title: '1. Abrir directamente en Android Studio',
      cmd: 'npx cap open android',
      desc: 'Abre Android Studio con el proyecto nativo preconfigurado listo para compilar.',
    },
    {
      title: '2. Generar el APK en Android Studio (1 clic)',
      cmd: 'Build > Build Bundle(s) / APK(s) > Build APK(s)',
      desc: 'En el menú superior de Android Studio, haz clic en Build APK(s). Al finalizar, toca "locate" para ver tu archivo app-debug.apk.',
    },
    {
      title: 'O compilar directamente por terminal (sin Android Studio)',
      cmd: 'cd android && ./gradlew assembleDebug',
      desc: 'Genera el archivo "app-debug.apk" en android/app/build/outputs/apk/debug/ listo para instalar en cualquier celular.',
    },
    {
      title: 'Sincronizar cambios futuros (si haces modificaciones)',
      cmd: 'npm run build && npx cap sync android',
      desc: 'Actualiza los archivos web y sonidos dentro del proyecto Android nativo.',
    },
  ];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-pink-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-pink-50 hover:bg-pink-100 rounded-full transition-colors"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl text-white shadow-md shadow-pink-200">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-kawaii text-slate-900 flex items-center gap-2">
              Empaquetar APK Android <Sparkles className="w-5 h-5 text-amber-500" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Configuración oficial de Capacitor para MIAU CALL
            </p>
          </div>
        </div>

        {/* Intro */}
        <div className="bg-pink-50/80 rounded-2xl p-4 border border-pink-200 text-xs sm:text-sm text-pink-950 mb-5 leading-relaxed">
          <p className="font-semibold mb-1">🐱 ¡El proyecto ya está preconfigurado con Capacitor!</p>
          <p className="text-pink-800">
            Ya creamos el archivo <code className="bg-white px-1.5 py-0.5 rounded font-mono text-pink-700 font-bold border border-pink-200">capacitor.config.json</code> con el ID <code className="bg-white px-1.5 py-0.5 rounded font-mono text-pink-700 font-bold border border-pink-200">com.miaucall.app</code>.
            Seguí estos 4 pasos rápidos para obtener el archivo .APK instalable en tu celular:
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3.5 mb-6">
          {steps.map((s, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 hover:border-pink-300 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-pink-500" />
                  {s.title}
                </span>
                <button
                  onClick={() => copyToClipboard(s.cmd, idx)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-pink-600 hover:text-pink-700 bg-pink-100/70 hover:bg-pink-200/80 px-2.5 py-1 rounded-lg transition-colors active:scale-95"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-2.5 rounded-xl overflow-x-auto selection:bg-pink-500 selection:text-white">
                <code>{s.cmd}</code>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Android Features */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs text-slate-600 mb-6">
          <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
            <p className="font-bold text-amber-900">100% Offline</p>
            <p className="text-[11px] text-amber-700">No requiere internet para reproducir sonidos</p>
          </div>
          <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200">
            <p className="font-bold text-purple-900">Audio Frecuencia Real</p>
            <p className="text-[11px] text-purple-700">Frecuencias agudas que despiertan a los gatos</p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-md transition-transform active:scale-95"
          >
            ¡Entendido, volver a Miau Call!
          </button>
        </div>
      </div>
    </div>
  );
};
