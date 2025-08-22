import React, { useEffect, useState } from "react";

import logo_unica from "@/assets/22ae72c2-d56e-4002-9acf-fe41d79a1f45-removebg-preview.png";

import { Copy, CopyCheck } from "lucide-react";


import { Button } from "@/components/ui/button";

import { pixStore } from "@/zustand/pixStore";
import { useNavigate } from "react-router-dom";
import LoadingPage from "@/components/LoadingPage";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-toastify";
import { useShallow } from "zustand/react/shallow";

import PixStatus from "@/components/System/PixPayment/PixStatus";

const PixPayment: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [pixData] = pixStore(useShallow((state) => [state.pix]));
  const navigate = useNavigate();

  useEffect(() => {
    if (!pixData) {
      navigate("/pix");
    } else {
      setIsLoading(false);
    }
  }, [pixData, navigate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixData?.copyPaste || "");
      setCopied(true);
      toast.success("Código Pix copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar o código Pix!");
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }


  if (!pixData) {

    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-[#E6E6E6] p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md text-center">
        {/* Logo */}
        <img
          src={logo_unica}
          alt="Logo Doa.re"
          className="mx-auto w-25 mt-2 mb-2"
        />

        {/* Faixa verde */}
        <div className="w-full mb-2">
          <div className="h-[9px] w-full bg-[#0310FF]" />
        </div>

        {/* Código PIX */}
        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Código PIX:
            </h2>
            <div className="relative bg-gray-100 p-4 rounded font-mono text-sm text-left text-gray-700 overflow-auto break-all">
              <span>{pixData.copyPaste}</span>
              <Button
                type="button"
                onClick={handleCopy}
                variant="outline"
                className="absolute bottom-2 right-2 rounded-full font-sans"
                aria-label="Copiar código Pix"
              >
                {copied ? <CopyCheck /> : <Copy />}
              </Button>
            </div>
          </div>

          <PixStatus txId={pixData.txId} />

          {/* QR Code */}
          <p className="text-sm text-gray-500 mb-2">
            Escaneie com seu aplicativo de banco:
          </p>
          <div className="flex justify-center">
            <div className="bg-white p-3 border rounded-xl shadow-md">
              <QRCodeSVG
                value={pixData.copyPaste}
                className="w-48 h-48 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixPayment;