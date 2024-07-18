import { Board } from "@/components/Board";
import { ScaleToFitWidth } from "@/components/scaleToFitWidth";
import {
  getTransfers,
  transferToTransferDetail,
} from "@/utils/transferGenerator";
import useSWR from "swr";
import {
  getArrivalTimeAsString,
  getDepartureTimeAsString,
} from "@/lib/transferHelpers";
import { TransferDetails } from "@/lib/types/transfer";
import { APIANIcon } from "@/components/icons/ApianLogo";
import { useState } from "react";
import { useInterval } from "usehooks-ts";

export function DepartureBoard({}) {
  const [render, setRender] = useState(false);
  useInterval(() => {
    setRender((r) => !r);
  }, 1000);
  const {
    data: transfers,
    error,
    isLoading,
  } = useSWR(
    "/api/user/123",
    () => {
      return getTransfers();
    },
    {
      refreshInterval: 15000,
    }
  );

  if (isLoading) return null;

  const values = transfers
    ?.map((transfer: any) => {
      const transferDetail = transferToTransferDetail(transfer);
      return `${transfer.source_location.name.substring(
        0,
        8
      )} ${getDepartureTimeAsString(
        transferDetail as unknown as TransferDetails
      )}        ${transfer.destination_location.name.substring(
        0,
        8
      )} ${getArrivalTimeAsString(transferDetail as unknown as TransferDetails)}
      `;
    })
    .slice(0, 10);
  return (
    <div className="p-4  min-h-screen w-screen bg-board-black border-black border-4 overflow-hidden">
      <APIANIcon className="w-[150px] mb-4"></APIANIcon>
      <ScaleToFitWidth>
        <Board rowCount={15} value={values as any} />
      </ScaleToFitWidth>
    </div>
  );
}

const VanillaBoard = () => {};
