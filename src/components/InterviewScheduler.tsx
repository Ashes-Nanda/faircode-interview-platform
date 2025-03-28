
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/Button';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Clock, Users } from 'lucide-react';

interface InterviewSchedulerProps {
  onSchedule: (date: Date, time: string, participants: string[]) => void;
  onClose: () => void;
}

const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({ onSchedule, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('09:00');
  const [participants, setParticipants] = useState<string[]>(['']);
  
  const availableTimes = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  
  const handleAddParticipant = () => {
    setParticipants([...participants, '']);
  };
  
  const handleParticipantChange = (index: number, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };
  
  const handleRemoveParticipant = (index: number) => {
    if (participants.length > 1) {
      const newParticipants = [...participants];
      newParticipants.splice(index, 1);
      setParticipants(newParticipants);
    }
  };
  
  const handleSchedule = () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    
    const validParticipants = participants.filter(p => p.trim() !== '');
    if (validParticipants.length === 0) {
      toast.error('Please add at least one participant');
      return;
    }
    
    onSchedule(selectedDate, selectedTime, validParticipants);
    toast.success('Interview scheduled successfully');
    onClose();
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md border p-6 max-w-md w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Schedule Interview</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Date
          </label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={{ before: new Date() }}
            className="border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Time
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {availableTimes.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Participants
          </label>
          
          {participants.map((participant, index) => (
            <div key={index} className="flex mb-2 gap-2">
              <input
                type="email"
                value={participant}
                onChange={(e) => handleParticipantChange(index, e.target.value)}
                placeholder="Email address"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              {participants.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="px-2" 
                  onClick={() => handleRemoveParticipant(index)}
                >
                  ×
                </Button>
              )}
            </div>
          ))}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            onClick={handleAddParticipant}
          >
            Add Participant
          </Button>
        </div>
        
        <Button 
          className="w-full"
          onClick={handleSchedule}
        >
          Schedule Interview
        </Button>
      </div>
    </div>
  );
};

export default InterviewScheduler;
