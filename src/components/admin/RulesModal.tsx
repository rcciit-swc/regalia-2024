import parse from "html-react-parser";
const RulesModal = ({
  isOpen,
  onClose,
  rules,
}: {
  isOpen: boolean;
  onClose: () => void;
  rules: string;
}) => {
  return (
    <>
      {isOpen && (
        <div className="fixed  inset-0 flex items-center font-retrolight tracking-widest justify-center bg-black bg-opacity-50 z-[50]">
          <div
            className={`bg-body border-y-2 border-regalia p-4 rounded-lg ${
              rules.length < 200 ? "h-auto" : "h-[60vh]"
            } w-[90%] flex flex-col items-start md:w-[50%] lg:w-[35%] `}
          >
            <div className="w-full flex flex-row mb-2 items-center justify-between">
              <h2 className="text-lg font-semibold">Rules of the Event</h2>

              <h2
                onClick={onClose}
                className="bg-regalia md:py-2 md:px-3 px-2 py-1 hover:bg-black hover:text-regalia border-2 border-regalia hover:border-regalia  text-white text-sm font-semibold rounded-full cursor-pointer"
              >
                X
              </h2>
            </div>
            <div
              className=" overflow-y-auto my-1 py-2 px-1 w-full font-hollirood tracking-widest"
            >
              {parse(rules!)}
            </div>
            <button
              className="border-2 mt-3 border-regalia px-5 py-1 rounded-full font-semibold bg-regalia text-black hover:bg-black hover:text-regalia"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RulesModal;