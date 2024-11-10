'use client'
import vehicles from '@/lib/vehicles';
import { useState, useRef, useEffect } from 'react';
import ky from 'ky';
import { useAuth } from '@/app/AuthContext';

export default function Page() {
  const [type, setType] = useState('car');
  const [color, setColor] = useState('');
  const [registration, setRegistration] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const currentVehicles = type === 'bike' ? vehicles.bikes : vehicles.cars;
  
  useEffect(() => {
    // Center the first vehicle on initial load
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      const firstItem = scrollContainer.children[1]; // Skip the spacer div
      if (firstItem) {
        const offset = (firstItem as HTMLElement).offsetLeft - (scrollContainer.clientWidth - (firstItem as HTMLElement).clientWidth) / 2;
        scrollContainer.scrollLeft = offset;
      }
    }
  }, [type]);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      const targetItem = scrollContainer.children[index + 1]; // +1 to account for spacer
      if (targetItem) {
        const offset = (targetItem as HTMLElement).offsetLeft - (scrollContainer.clientWidth - (targetItem as HTMLElement).clientWidth) / 2;
        scrollContainer.scrollTo({
          left: offset,
          behavior: 'smooth'
        });
      }
    }
    setSelectedIndex(index);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      const centerX = scrollContainer.scrollLeft + scrollContainer.clientWidth / 2;
      
      // Find the element closest to the center
      let closest = null;
      let closestDistance = Infinity;
      
      Array.from(scrollContainer.children).forEach((child, index) => {
        if (index === 0) return; // Skip spacer div
        const childCenter = (child as HTMLElement).offsetLeft + (child as HTMLElement).clientWidth / 2;
        const distance = Math.abs(childCenter - centerX);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = index - 1; // Subtract 1 to account for spacer
        }
      });
      
      if (closest !== null && closest !== selectedIndex) {
        setSelectedIndex(closest);
      }
    }
  };

  const handleNext = () => {
    const nextIndex = Math.min(selectedIndex + 1, currentVehicles.length - 1);
    scrollToIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = Math.max(selectedIndex - 1, 0);
    scrollToIndex(prevIndex);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const model = currentVehicles[selectedIndex];
    if(!user) {
        console.error('User not found');
        return;
    }
    const uid = user?.userId

    console.log(uid)
    try {
      const response = await ky.post('/api/add-vehicle', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, registration, color, type, model }),
      }).json();
      console.log(response);
    } catch (error) {
      console.error(error);
    }
}

  return (
    <div className="h-screen bg-garage-2 flex items-center justify-center">
        <form onSubmit={handleSubmit} className='flex flex-col items-center gap-2 w-full'>
            <div className='flex flex-col bg-zinc-900/80 border border-neutral-500 backdrop-blur-sm mt-4 gap-2 p-4 rounded-md w-96 items-center'>
                <h1 className='text-xl font-bold mb-2'>Register your Vehicle</h1>
                <input value={registration} onChange={(e)=> setRegistration(e.target.value)} placeholder='Vehicle Registration Number' className='w-64 border-b-2 border-zinc-900/60 p-1 bg-transparent outline-none'/>
                <input value={color} onChange={(e)=> setColor(e.target.value)} placeholder='Vehicle Color' className='w-64 border-b-2 border-zinc-900/60 p-1 bg-transparent outline-none'/>
                <div className='flex items-center'>
                    <p>Select the Model of</p>
                    <select onChange={(e) => setType(e.target.value)} className='w-16 border border-black p-1 bg-transparent border-none outline-none'>
                        <option className='bg-zinc-900' value="car">Car</option>
                        <option className='bg-zinc-900' value="bike">Bike</option>
                    </select>
                </div>
            </div>
            <div className='relative flex items-center'>
                <div className="relative w-full">
                    <div
                        ref={scrollRef}
                        className="relative flex w-full h-[300px] hide-scrollbar overflow-x-scroll snap-x snap-mandatory scroll-smooth"
                        onScroll={handleScroll}
                    >
                        {/* Initial spacer for first item centering */}
                        <div className="relative h-full w-1/3 flex-shrink-0 snap-start" />
                        
                        {currentVehicles.map((vehicle, index) => (
                        <div
                            key={index}
                            className={`
                            flex flex-col items-center gap-1 flex-shrink-0 snap-start transition-all duration-300
                            ${selectedIndex === index ? '' : 'opacity-50'}
                            `}
                        >
                            <img
                            src={`/${type}s/${vehicle}.png`}
                            alt={vehicle}
                            className={`
                                ${type === 'bike' ? 'mx-12 w-[333px] h-[187px]' : 'w-[440px] h-[250px]'}
                                transition-transform duration-300
                            `}
                            />
                            <p className={`text-lg bg-zinc-900/70 backdrop-blur-sm p-2 rounded-md transition-opacity font-medium ${selectedIndex === index ? 'opacity-100' : 'opacity-0'}`}>{vehicle}</p>
                        </div>
                        ))}
                        <div className="relative h-full w-1/3 flex-shrink-0 snap-start" />
                    </div>
                    
                    {/* Navigation buttons */}
                    <button
                        onClick={handlePrev}
                        disabled={selectedIndex === 0}
                        className={`
                        bg-black bg-opacity-50 hover:bg-opacity-75 absolute left-2 top-1/2 -translate-y-1/2
                        p-2 rounded-full transition-opacity duration-300
                        ${selectedIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}
                        `}
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={selectedIndex === currentVehicles.length - 1}
                        className={`
                        bg-black bg-opacity-50 hover:bg-opacity-75 absolute right-2 top-1/2 -translate-y-1/2
                        p-2 rounded-full transition-opacity duration-300
                        ${selectedIndex === currentVehicles.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}
                        `}
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
            <button type='submit' className='bg-gradient-to-r text-lg from-amber-600 to-orange-600 text-white px-2 py-1 rounded-md'>Register Vehicle</button>
        </form>
    </div>
  );
}   