import { DeliveryTracker } from "@/components/maps/DeliveryTracker";
import { DepartureBoard } from "@/components/DepartureBoard";

function DesktopTracker({}) {
  return (
    <>
      <div className="w-screen h-screen bg-board-black">
        <div
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="scroll"
        >
          <DepartureBoard></DepartureBoard>
        </div>
      </div>
    </>
  );
}

export default DesktopTracker;
