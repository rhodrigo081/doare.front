import React, { useEffect } from "react";
import { Clock4 } from "lucide-react";
import { toast } from "react-toastify";
import { useShallow } from "zustand/react/shallow";
import { pixStore } from "@/zustand/pixStore";

const PIX_STATUS = {
  PAID: "PAGA",
  PENDING: "PENDENTE",
  CANCELED: "CANCELADA",
  EXPIRED: "EXPIRADA",
};

interface PixStatusProps {
  txId: string;
}

const PixStatus: React.FC<PixStatusProps> = ({ txId }) => {
  const [pixStatus, setPixStatus] = pixStore(
    useShallow((state) => [state.pixStatus, state.setPixStatus])
  );

  useEffect(() => {
    if (!txId) {
      console.warn("txId não fornecido para PixStatus. Não será possível conectar ao SSE.");
      return;
    }

    const eventSource = new EventSource(
      `${import.meta.env.VITE_BACKEND_URL}/sse/${txId}`
    );

    eventSource.addEventListener("donationPaid", (event) => {
      const data = JSON.parse(event.data);
      if (data && data.donation && data.donation.status) {
        console.log("SSE data received in PixStatus:", data.donation.status);
        setPixStatus(data.donation.status);

        if (data.donation.status === PIX_STATUS.PAID) {
          eventSource.close();
        }
      }
    });

    eventSource.onerror = (error) => {
      console.error("Erro no EventSource do PixStatus:", error);
      toast.error("Ocorreu um erro ao verificar o status do Pix.");
      eventSource.close();
    };


    return () => {
      eventSource.close();
    };
  }, [txId, setPixStatus]);


  const getStatusClasses = (status: string) => {
    switch (status) {
      case PIX_STATUS.PAID:
        return "bg-green-100 text-green-800";
      case PIX_STATUS.CANCELED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <span className="text-gray-800 text-sm font-semibold">Status:</span>
      <span
        className={`${getStatusClasses(
          pixStatus
        )} text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1`}
      >
        <Clock4 size={14} />
        {pixStatus}
      </span>
    </div>
  );
};

export default PixStatus;