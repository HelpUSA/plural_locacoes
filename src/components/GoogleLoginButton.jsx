import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function GoogleLoginButton({ onSuccessRedirect }) {
  const { loginWithGoogle } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "812202824664-r66j9n6ar0f3l83fj73bqvojf8h6p9p5.apps.googleusercontent.com";

  useEffect(() => {
    if (!googleClientId) return;

    // Carregar SDK oficial do Google Identity Services (GIS)
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleResponse,
          auto_select: false
        });

        const btnContainer = document.getElementById("googleBtnContainer");
        if (btnContainer) {
          btnContainer.innerHTML = "";
          window.google.accounts.id.renderButton(btnContainer, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signin_with",
            locale: "pt-BR"
          });
        }
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [googleClientId]);

  const handleGoogleResponse = async (response) => {
    try {
      // Decodificar o JWT ID Token do Google
      const base64Url = response.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const googleUser = JSON.parse(jsonPayload);

      const res = await loginWithGoogle({
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        googleId: googleUser.sub
      });

      if (onSuccessRedirect) onSuccessRedirect(res);
    } catch (e) {
      console.error("Erro no retorno do Google:", e);
      alert("Falha na autenticação via Google.");
    }
  };

  // Função para abrir o Seletor de Contas do Google com `prompt=select_account`
  const handleEscolherOutraContaGoogle = () => {
    const redirectUri = window.location.origin + "/login";
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=id_token&scope=openid%20email%20profile&prompt=select_account&nonce=${Date.now()}`;

    // Janela popup para escolha de conta do Google
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const popup = window.open(
      googleAuthUrl,
      "GoogleAccountPicker",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    // Escutar resposta do token via hash na URL
    const checkHash = setInterval(() => {
      try {
        if (popup && popup.location && popup.location.href.includes("id_token=")) {
          const hashParams = new URLSearchParams(popup.location.hash.substring(1));
          const idToken = hashParams.get("id_token");
          if (idToken) {
            popup.close();
            clearInterval(checkHash);
            handleGoogleResponse({ credential: idToken });
          }
        }
        if (popup && popup.closed) {
          clearInterval(checkHash);
        }
      } catch (e) {
        // Cross-origin até o redirecionamento
      }
    }, 500);
  };

  return (
    <div className="space-y-2">
      {/* Botão Nativo do Google */}
      <div id="googleBtnContainer" className="w-full flex justify-center min-h-[44px]"></div>

      {/* Botão de Troca / Seleção de Outra Conta */}
      <button
        type="button"
        onClick={handleEscolherOutraContaGoogle}
        className="w-full text-[11px] text-neutral-400 hover:text-white underline text-center transition py-1 block"
      >
        <span>🔁 Escolher outra conta do Google</span>
      </button>
    </div>
  );
}
