import React from "react";
import { useGoogleAuth, GoogleLoginButton as SharedGoogleButton } from "../shared/googleAuth/index.js";

export default function GoogleLoginButton({ onSuccessRedirect }) {
  const {
    isLoading,
    error,
    login,
    clearError
  } = useGoogleAuth({
    storageKey: "plural_google_auth_user",
    onSuccess: (googleUser) => {
      clearError();
      if (onSuccessRedirect) {
        onSuccessRedirect({ user: googleUser });
      }
    }
  });

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl font-bold text-center">
          {error}
        </div>
      )}

      {/* Botão Padronizado de Login com Google (Padrão Kaline Modas) */}
      <SharedGoogleButton
        onClick={() => {
          clearError();
          login();
        }}
        isLoading={isLoading}
        label="ENTRAR COM O GOOGLE"
        variant="dark"
        className="w-full bg-neutral-950 hover:bg-neutral-800 text-white border-neutral-700 hover:border-helpusOrange font-bold text-xs py-3.5 px-4 rounded-xl shadow-lg transition"
      />
    </div>
  );
}
