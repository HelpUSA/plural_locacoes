import React, { useState } from "react";

export default function HelpTooltip({ titulo, explicacao, dica, passos = [] }) {
  const [aberto, setAberto] = useState(false);

  return (
    <span className="inline-block relative ml-1.5 align-middle">
      {/* Botão Ícone ? */}
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="w-5 h-5 rounded-full bg-helpusOrange/20 hover:bg-helpusOrange border border-helpusOrange/50 text-helpusOrange hover:text-white font-bold text-[11px] flex items-center justify-center transition shadow-sm cursor-pointer"
        title="Clique para ver instruções desta função"
        aria-label="Ajuda e Instruções"
      >
        ?
      </button>

      {/* Modal / Popup de Ajuda Contextual */}
      {aberto && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-4 shadow-2xl text-left animate-fadeIn">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-helpusOrange/20 text-helpusOrange font-black text-sm flex items-center justify-center border border-helpusOrange/30">
                  ?
                </span>
                <h3 className="font-extrabold text-white text-base">{titulo}</h3>
              </div>
              <button
                type="button"
                onClick={() => setAberto(false)}
                className="text-neutral-400 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-neutral-300 text-xs leading-relaxed">
              {explicacao}
            </p>

            {passos && passos.length > 0 && (
              <div className="space-y-1.5 bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800/80">
                <div className="text-[11px] font-black text-helpusOrange uppercase tracking-wider">
                  Passo a Passo Recomendado:
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-xs text-neutral-300">
                  {passos.map((p, idx) => (
                    <li key={idx} className="leading-snug">{p}</li>
                  ))}
                </ol>
              </div>
            )}

            {dica && (
              <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
                <span className="text-base">💡</span>
                <span><strong>Dica do Operador:</strong> {dica}</span>
              </div>
            )}

            <div className="pt-2 border-t border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={() => setAberto(false)}
                className="py-2 px-5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl"
              >
                Entendi!
              </button>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
