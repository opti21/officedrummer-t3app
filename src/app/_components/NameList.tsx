import { useAtom } from 'jotai';
import { 
  type FC, 
  useState
} from 'react';
import { wheelDataAtom, wowSoundVolumeAtom } from '~/server/state';
import { Trash2 } from 'react-feather';
import Swal from 'sweetalert2';
import { api } from '~/trpc/react';


type Props = {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const NameList: FC<Props> = ({ audioRef }) => {
  const [option, setOption] = useState<string>('');
  const [names, setNames] = useAtom(wheelDataAtom);
  const [volume, setVolume] = useAtom(wowSoundVolumeAtom);
  const { mutate: clearAll } = api.songRequest.clearAll.useMutation()

  const handleAddName = () => {
    if (option === '') {
      return;
    }

    setNames([...names, { option, style: { textColor: 'black' } }]);
    setOption('');
  };

  const handleDeleteName = (index: number) => {
    const newNames = [...names];
    newNames.splice(index, 1);
    setNames(newNames);
  };

  // const handleReorder = (index: number, direction: 'up' | 'down') => {
  //   if (
  //     (direction === 'up' && index === 0) ||
  //     (direction === 'down' && index === names.length - 1)
  //   ) {
  //     return;
  //   }
  //   const newNames = [...names];
  //   const temp = newNames[index];
  //   if (!temp) {
  //     return
  //   }

  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   newNames[index] = newNames[index + (direction === 'up' ? -1 : 1)];
  //   newNames[index + (direction === 'up' ? -1 : 1)] = temp;
  //   setNames(newNames);
  // };

  const handleSizeChange = (index: number, newSize: number) => {
    const newNames = [...names];
    const currentName = newNames[index];
    if (currentName) {
      currentName.optionSize = Math.max(1, newSize);
      setNames(newNames);
    }
  };

  const handleNameChange = (index: number, newName: string) => {
    const newNames = [...names];
    const currentName = newNames[index];
    if (currentName) {
      currentName.option = newName;
      setNames(newNames);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleClearAll = () => {
    void Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to clear all the requests?",
      confirmButtonText: "Clear All",
      confirmButtonColor: "#DC2626",
      showCancelButton: true,
      cancelButtonText: "Nah"

    }).then(response => {
      if (response.isConfirmed) {
        clearAll(undefined, {
          onSuccess: () => {
            void Swal.fire({
              icon: "success",
              title: "Requests Cleared"
            })
          }
        })
      }
    })

  }

  return (
    <div className='w-full max-h-screen bg-white p-2 rounded-b-lg '>
      <div className='w-full flex flex-row items-center justify-between'>
        <div>
          <label>Volume: </label>
          <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume} 
              onChange={handleVolumeChange} 
          />
        </div>
        <button
          className='w-1/2 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ml-2'
          onClick={handleClearAll}
        >
            Clear All Requests
        </button>
      </div>
      <div className='flex flex-row w-full my-2'>
        <input
          value={option}
          onChange={(e) => setOption(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddName();
            }
          }}
          placeholder="Enter a name"
          className='w-3/4 border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none'
        />
        <button
          className='w-1/4 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ml-2'
          onClick={handleAddName}>Add Name</button>
      </div>

      <div className='flex flex-col gap-2 overflow-y-auto max-h-[600px] overflow-hidden'>
        {names.map((item, index) => (
          <div key={index} className='flex flex-row items-center'>
            <input
              value={item.option}
              onChange={(e) => handleNameChange(index, e.target.value)}
              className='w-3/4 border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none'
            />
            <input
              type="number"
              value={item.optionSize ?? 1}
              onChange={(e) => handleSizeChange(index, parseInt(e.target.value))}
              className='w-14 border-2 border-gray-300 mx-2 h-10 pl-4 rounded-lg text-sm focus:outline-none'
            />
            <button
              className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2'
              onClick={() => handleSizeChange(index, (item.optionSize ?? 1) + 1)}>↑</button>
            <button
              className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2'
              onClick={() => handleSizeChange(index, (item.optionSize ?? 1) - 1)}>↓</button>
            <button
              className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded h-10'
              onClick={() => handleDeleteName(index)}>
                <Trash2 size={20} />
              </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NameList;
