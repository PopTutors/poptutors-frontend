import { ChevronDown, Menu } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import profile from '../../../../assets/assignment/Image.png';
import Bg from '../../../../assets/assignment/chat-bg.png';

const ChatSection = () => {
  return (
    <div className="w-full mx-auto min-h-[80vh] bg-white font-poppins rounded-lg flex flex-col p-3">
      {/* Header */}
      <header className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative" >
            <img src={profile} alt="profile" className='w-12 h-12 rounded-full overflow-hidden object-cover' />
            <div className='absolute  bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full'></div>
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

        <div className="absolute top-0 left-0 w-full h-full flex flex-col gap-2">
          <div className='border-2 bg-[#e6f9ff] border-primary p-3 rounded-lg'>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start gap-0">
                <span className="font-poppinsbold text-xl text-primary">$125</span>
                <span className="font-poppinsregular text-gray-500">Negotiated Price</span>
              </div>
              <ChevronDown className="w-6 h-6 text-gray-500" />
            </div>

          </div>
          <div className="flex items-center justify-end gap-1">
            <Button variant="pill_solid" className='px-5 m-0 py-[10px] font-poppinsmedium text-xs bg-[#229126] hover:bg-[#229126]/80 text-white'>
              Accept
            </Button>
            <Button variant="pill_outline" className='px-5 m-0 py-2 text-xs font-poppinsmedium'>
              Negotiate
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-auto flex flex-col gap-3">
          <div className='flex items-center justify-center'>
            <span className='text-xs font-poppinsregular bg-gray-100 px-2 py-1 rounded text-gray-500'>Today</span>
          </div>
          <div className='flex justify-end'>
            <div className='flex items-end items-end justify-end p-1 bg-primary w-auto rounded-lg'>
              <span className='text-sm font-poppinsregular bg-primary px-2 py-1 text-white'>I would like to offer at $130</span>
              <span className='text-[8px] font-poppinsmedium bg-primary px-2 py-1 text-white'>10:20 AM</span>
            </div>
          </div>
          <div className='flex justify-start '>
            <div className='flex items-end items-end p-1 justify-end bg-white border border-primary rounded-lg'>
              <span className='text-sm font-poppinsregular bg-white px-2 py-1 text-black'>Offer Accepted 👍</span>
              <span className='text-[8px] font-poppinsmedium bg-white px-2 py-1 text-gray-500'>10:20 AM</span>
            </div>

          </div>
          <div className='flex justify-start mb-5'>

            <Button variant="pill_outline" className='px-5 m-0 py-2 text-xs font-poppinsmedium border-[#229126] hover:bg-[#229126] bg-[#229126]/ text-green-500 hover:bg-green-500 hover:text-white w-auto'>
              Click to Pay 50% Advance
            </Button>
          </div>


        </div>

      </div>

      {/* Chat Input */}
      <div className="flex items-center gap-2 pt-3 bg-white">
        <Input type="text" placeholder="Enter Negotiation Price" className="w-full" />
        <Button variant="pill_solid" className="rounded-sm bg-primary px-4 py-3 text-xs m-0">
          Send Price
        </Button>
      </div>
    </div >
  );
};

export default ChatSection;
