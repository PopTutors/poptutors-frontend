import {
  Menu,
  Check,
  Paperclip,
  SendHorizontal,
  RotateCw,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import profile from '../assets/assignment/Image.png';
import Bg from '../assets/assignment/chat-bg.png';

const ChatSection = () => {
  return (
    <div className="w-full mx-auto min-h-[80vh] bg-white font-poppins rounded-lg flex flex-col p-3">
      {/* Header */}
      <header className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <img
              src={profile}
              alt="profile"
              className="w-12 h-12 rounded-full overflow-hidden object-cover"
            />
            <div className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-poppinsmedium">Jane Cooper</h2>
            <p className="text-xs font-poppinsregular text-gray-500">Active Now</p>
          </div>
        </div>
        <Menu className="w-10 h-10 bg-[#e6f9ff] text-gray-500 p-1 cursor-pointer" />
      </header>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-2 py-4 rounded-md relative">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url(${Bg})`,
            opacity: 0.4,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative z-10 flex flex-col gap-3 h-full">
          {/* Price Section */}
          <div className="border-2 bg-[#e6f9ff] border-primary p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start gap-2 w-full">
                <h4 className="text-[#111111] text-base font-poppinssemibold">Price Section</h4>
                <div className="w-full flex flex-col gap-1">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-poppinsregular text-sm text-gray-500">Your Price</span>
                    <span className="font-poppinsmedium text-base text-[#111111]">$110</span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-poppinsregular text-sm text-gray-500">Offered Price</span>
                    <span className="font-poppinsmedium text-base text-[#111111]">$125</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full">
            {/* Today Divider */}
            <div className="flex items-center justify-center my-2">
              <span className="text-xs font-poppinsregular bg-gray-100 px-2 py-1 rounded text-gray-500">
                Today
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex flex-col gap-3">
              {/* Offered Price Message */}
              <div className="flex justify-start">
                <div className="flex items-end bg-[#e6f9ff] border border-primary rounded-lg p-1">
                  <span className="text-sm font-poppinsregular px-2 py-1 text-black">
                    Offered Price
                  </span>
                  <span className="text-sm font-poppinsmedium py-1 text-black">$125</span>
                  <span className="text-[8px] font-poppinsmedium px-2 py-1 text-gray-500">
                    10:20 AM
                  </span>
                </div>
              </div>

              {/* Input Field for Negotiation */}
              <div className="flex justify-end items-center gap-2 w-full">
                <Input
                  type="text"
                  placeholder="Enter Negotiation Price"
                  className="flex-1 border border-gray-300 rounded-lg text-sm max-w-[60%]"
                />
                <SendHorizontal className="w-10 h-10 text-white bg-primary rounded-lg p-3" />
              </div>

              {/* Negotiation Price $100 */}
              <div className="flex justify-end">
                <div className="flex items-center gap-2">
                  <div className="flex items-end bg-primary rounded-lg p-1">
                    <span className="text-sm font-poppinsregular px-2 py-1 text-white">
                      Negotiation Price $100
                    </span>
                    <span className="text-[8px] font-poppinsmedium px-2 py-1 text-white">
                      10:20 AM
                    </span>
                  </div>
                </div>
              </div>

              {/* Renegotiation Price $120 */}
              <div className="flex justify-start">
                <div className="flex items-center gap-2">
                  <div className="flex items-end bg-[#e6f9ff] border border-primary rounded-lg p-1">
                    <span className="text-sm font-poppinsregular px-2 py-1 text-black">
                      Renegotiation Price
                    </span>
                    <span className="text-sm font-poppinsmedium py-1 text-black">$120</span>
                    <span className="text-[8px] font-poppinsmedium px-2 py-1 text-gray-500">
                      10:20 AM
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Check className="w-10 h-10 cursor-pointer bg-[#229126] text-white rounded-lg p-2" />
                    <RotateCw className="w-10 h-10 cursor-pointer  bg-primary text-white rounded-lg p-2" />
                  </div>
                </div>
              </div>

              {/* Accepted Message */}
              <div className="flex justify-end">
                <div className="flex items-end bg-primary rounded-lg p-1">
                  <span className="text-sm font-poppinsregular px-2 py-1 text-white">
                    Accepted 👍
                  </span>
                  <span className="text-[8px] font-poppinsmedium px-2 py-1 text-white">
                    10:20 AM
                  </span>
                </div>
              </div>

              {/* Offer Accepted Message */}
              <div className="flex justify-start">
                <div className="flex items-end bg-[#e6f9ff] border border-primary rounded-lg p-1">
                  <span className="text-sm font-poppinsregular px-2 py-1 text-black">
                    Offer Accepted, Pay advance to start work
                  </span>
                  <span className="text-[8px] font-poppinsmedium px-2 py-1 text-gray-500">
                    10:20 AM
                  </span>
                </div>
              </div>

              {/* Pay 50% Advance Button */}
              <div className="flex justify-start">
                <Button className="bg-[#39A3401A] hover:bg-[#39A340]/20 text-[#39A340] border border-[#39A340] px-5 py-2 text-sm font-poppinsmedium rounded-full">
                  Pay 50% Advance
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="flex items-center gap-2 pt-4 bg-white border-t border-gray-200">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Type your message"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm h-12"
          />
          <Paperclip
            className="w-6 h-6 cursor-pointer absolute top-3 right-2 text-primary"
            strokeWidth={2}
          />
        </div>
        <SendHorizontal className="w-14 h-12 text-white bg-primary rounded-lg p-3" />
      </div>
    </div>
  );
};

export default ChatSection;
