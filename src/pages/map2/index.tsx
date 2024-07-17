import { DeliveryTracker } from "@/components/maps/DeliveryTracker";
import { DepartureBoard } from "@/components/DepartureBoard";

function DesktopTracker({}) {
  return (
    <>
      <div className="w-screen h-[30vh] bg-board-black">
        <div
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="scroll"
        >
          <DepartureBoard></DepartureBoard>
        </div>
      </div>
      <div className="relative h-screen scroll-up overflow-hidden">
        <DeliveryTracker></DeliveryTracker>
      </div>
    </>
  );
}

export default DesktopTracker;
