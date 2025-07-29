import { useController, type Control } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
interface DurationFieldProps {
  name: string;
  control: Control<any>;
}

interface Props {
  value: Date | null;
  onChange: (date: Date | null) => void;
  durationField: DurationFieldProps;
  durationOptions?: string[];
}

export const DateTimeDurationInput = ({
  value,
  onChange,
  durationField,
  durationOptions = ['15 mins', '30 mins', '1 hour', '2 hours'],
}: Props) => {
  const {
    field: { value: durationValue, onChange: onDurationChange },
  } = useController({
    name: durationField.name,
    control: durationField.control,
  });

  return (
    <div className="flex items-center justify-between min-w-full h-[40px] max-w-md border rounded px-3 py-1 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
      <div className="flex gap-4">
        {' '}
        <DatePicker
          selected={value}
          onChange={onChange}
          showTimeSelect
          timeIntervals={15}
          dateFormat="d MMM h:mm aa (zzz), zzzz"
          placeholderText="Select date & time"
          className="flex-1 bg-transparent  text-sky-500 text-sm font-normal font-poppinsregular focus:outline-none"
          popperPlacement="bottom"
        />
        <select
          value={durationValue}
          onChange={onDurationChange}
          className="bg-sky-100 text-sky-600 text-xs font-medium px-3 py-1 rounded mr-2 focus:outline-none"
        >
          {durationOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <Calendar className="w-4 h-4 text-gray-400" />
    </div>
  );
};
