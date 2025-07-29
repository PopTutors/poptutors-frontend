import { Button } from '../../../../../components/ui/button';

const PriceSection = () => {
  return (
    <section className="bg-white rounded-lg">
      <div>
        <div className="flex items-center justify-between px-5 pt-5">
          <h4 className="text-[18px] font-poppinssemibold text-gray-900 mb-4">Price Section</h4>
          <button className="text-xs font-poppinssemibold text-primary hover:underline">
            Download Receipt
          </button>
        </div>

        <div className="border-b border-gray-200 mb-4"></div>


        <div className="px-5 pb-5">
          <div className="bg-[#F5F5F599] rounded-lg p-5">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-gray-700 rounded-full">
                  </span>
                  <span className="text-sm font-poppinsmedium text-gray-700">
                    Total Price
                  </span>
                </div>
                <span className="text-md font-poppinsbold text-gray-900">$1500</span>
              </div>
              {/* seperator */}
              <div
                className="w-full h-px"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(to right, #d1d5db 0 10px, transparent 8px 16px)',
                }}
              ></div>

              <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-gray-700 rounded-full">
                  </span>
                  <span className="text-sm font-poppinsmedium text-gray-700">
                    Total amount paid
                  </span>
                </div>
                <span className="text-md font-poppinsbold text-gray-900">$1100</span>
              </div>
                <div className="flex ml-4 justify-between items-center">
                  <span className="text-xs font-poppinsregular text-gray-600">Service</span>
                  <span className="text-xs font-poppinsmedium text-gray-800">$250</span>
                </div>
                <div className="flex ml-4 justify-between items-center">
                  <span className="text-xs font-poppinsregular text-gray-600">3rd Payment</span>
                  <span className="text-xs font-poppinsmedium text-gray-800">$250</span>
                </div>
                <div className="flex ml-4 justify-between items-center">
                  <span className="text-xs font-poppinsregular text-gray-600">Tax Payment</span>
                  <span className="text-xs font-poppinsmedium text-gray-800">$250</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center bg-[#e6f9ff] py-2 pl-3 rounded-lg mt-1">
            <div className="flex items-center gap-3">
              <span className="w-1 h-1 bg-gray-700 rounded-full">
              </span>
              <span className="text-sm font-poppinsmedium text-gray-700">
                Remaining Payment
              </span>
            </div>
            <Button
              variant="outline_rounded_1"
              className="bg-primary text-white font-poppinssemibold text-sm py-1 rounded-full"
            >
              Pay Now $100
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceSection;
