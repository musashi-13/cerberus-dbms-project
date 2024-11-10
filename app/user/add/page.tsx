import Icon from '@/app/_components/icon-wrapper';
import vehicles from '@/lib/vehicles';

export default function Page() {
  return (
    <div className="h-screen bg-garage-2 flex items-center justify-center">
        <div className='bg-gray-900/60 flex flex-col items-center gap-2 backdrop-blur-lg rounded-md border -translate-y-16 border-zinc-600 p-6 w-96'>
            <h1 className='text-xl font-bold'>Enter Vehicle Details</h1>
            <select className='w-24 border border-black p-1 bg-transparent border-none outline-none'>
                <option className='bg-zinc-900' value="car">Car</option>
                <option className='bg-zinc-900' value="bike">Bike</option>
            </select>
            <div className='flex items-center'>
                <Icon icon='chevron_left' size='24px'/>
                <div className='relative flex w-56 h-32 hide-scrollbar overflow-x-scroll snap-x snap-mandatory scroll-smooth'>
                    {vehicles.cars.map((car: string, index: number) => (
                        <div key={index} className='flex flex-col gap-1 flex-shrink-0 snap-start'>
                            <img src={`/cars/${car}.png`} alt={car} className='w-56 h-32'/>
                        </div>
                    ))}
                </div>
                <Icon icon='chevron_right' size='24px'/>

            </div>
        </div>
    </div>
  );
}   