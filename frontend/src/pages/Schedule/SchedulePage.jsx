import { useState, useEffect } from 'react';
import axios from 'axios';

const SchedulePage = () => {
  const [view, setView] = useState('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    'Lunch Break', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'
  ];

  useEffect(() => {
    fetchSchedules();
    fetchRooms();
  }, [currentDate, view]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const endpoint = view === 'weekly'
        ? '/api/v1/schedules/weekly'
        : '/api/v1/schedules/monthly';

      const { data } = await axios.get(endpoint, {
        params: { date: currentDate.toISOString() }
      });
      setSchedules(data.data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('/api/v1/rooms');
      setRooms(data.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getMonthDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates = [];

    const startDay = firstDay.getDay();
    for (let i = 0; i < startDay; i++) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() - (startDay - i));
      dates.push({ date, otherMonth: true });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      dates.push({ date: new Date(year, month, i), otherMonth: false });
    }

    const remainingDays = 42 - dates.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(lastDay);
      date.setDate(lastDay.getDate() + i);
      dates.push({ date, otherMonth: true });
    }

    return dates;
  };

  const getScheduleForSlot = (room, day, timeSlot) => {
    return schedules.find(s =>
      s.room?._id === room._id &&
      new Date(s.date).toDateString() === day.toDateString() &&
      s.startTime === timeSlot.split(' - ')[0]
    );
  };

  const getSchedulesForDay = (date) => {
    return schedules.filter(s =>
      new Date(s.date).toDateString() === date.toDateString()
    );
  };

  const formatWeekRange = () => {
    const dates = getWeekDates();
    const start = dates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = dates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${start} - ${end}`;
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="m-0 text-base font-bold">Schedule</h1>
          <div className="text-sm font-normal">
            <span className="text-[#888] no-underline">Home</span>
            <span className="mx-2 text-[#aaa]">/</span>
            <span className="text-font-color font-bold">Schedule</span>
          </div>
        </div>
        <div className="flex items-center gap-[15px]">
          <div className="inline-flex border border-border-color rounded-[5px] overflow-hidden">
            <button
              className={`py-[10px] px-[15px] border-none bg-transparent cursor-pointer border-l border-border-color font-inter text-sm first:border-l-0 ${view === 'weekly' ? 'shadow-[inset_0_0_0_1px_#4a90e2] text-primary' : ''}`}
              onClick={() => setView('weekly')}
            >
              <i className="fas fa-th"></i> Weekly
            </button>
            <button
              className={`py-[10px] px-[15px] border-none bg-transparent cursor-pointer border-l border-border-color font-inter text-sm ${view === 'monthly' ? 'shadow-[inset_0_0_0_1px_#4a90e2] text-primary' : ''}`}
              onClick={() => setView('monthly')}
            >
              <i className="fas fa-calendar"></i> Monthly
            </button>
          </div>
        </div>
      </div>

      {view === 'weekly' ? (
        <div className="bg-white p-5 rounded-lg shadow-custom">
          <div className="flex justify-between items-center mb-5">
            <button className="bg-transparent border border-border-color cursor-pointer py-[5px] px-[10px] rounded-[5px] text-base" onClick={() => navigateWeek(-1)}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <h2 className="m-0 text-lg">{formatWeekRange()}</h2>
            <button className="bg-transparent border border-border-color cursor-pointer py-[5px] px-[10px] rounded-[5px] text-base" onClick={() => navigateWeek(1)}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr>
                <th className="border border-border-color p-1 text-center text-xs align-middle h-[35px] bg-[#f9f9f9] font-bold w-[100px]">Room</th>
                {getWeekDates().map((date, idx) => (
                  <th key={idx} className={`border border-border-color p-1 text-center text-xs align-middle h-[35px] ${isToday(date) ? 'bg-[#fffbe6]' : 'bg-[#f9f9f9]'} font-bold`}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}<br />
                    {date.getDate()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, slotIdx) => (
                <tr key={slotIdx}>
                  <td className="border border-border-color p-1 text-center text-xs align-middle h-[35px] font-medium text-[11px] w-[120px]">{slot}</td>
                  {getWeekDates().map((day, dayIdx) => {
                    if (slot === 'Lunch Break') {
                      return <td key={dayIdx} className="border border-border-color p-1 text-center text-xs align-middle h-[35px] bg-[#f0f0f0] font-bold">Lunch</td>;
                    }

                    const schedule = rooms.map(room =>
                      getScheduleForSlot(room, day, slot)
                    ).filter(Boolean)[0];

                    return (
                      <td key={dayIdx} className="border border-border-color p-1 text-center text-xs align-middle h-[35px]">
                        {schedule && (
                          <div className="bg-[#eaf2fa] border-l-[3px] border-l-primary p-[5px] text-center rounded-[3px] h-full box-border flex flex-col justify-center items-center leading-[1.3] cursor-pointer hover:opacity-80">
                            <div className="font-medium">{schedule.enquiry?.course || 'N/A'}</div>
                            <div className="text-[11px] text-[#555]">{schedule.trainer?.name || 'N/A'}</div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-5 rounded-lg shadow-custom">
          <div className="flex justify-between items-center mb-5">
            <button className="bg-transparent border border-border-color cursor-pointer py-[5px] px-[10px] rounded-[5px] text-base w-10 h-10" onClick={() => navigateMonth(-1)}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <h2 className="m-0 text-lg">{formatMonthYear()}</h2>
            <button className="bg-transparent border border-border-color cursor-pointer py-[5px] px-[10px] rounded-[5px] text-base w-10 h-10" onClick={() => navigateMonth(1)}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-px bg-border-color border border-border-color">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-[#f9f9f9] p-2 font-bold text-center py-[10px]">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-border-color border border-border-color">
            {getMonthDates().map((item, idx) => {
              const daySchedules = getSchedulesForDay(item.date);
              return (
                <div
                  key={idx}
                  className={`bg-white p-2 min-h-[120px] relative flex flex-col ${item.otherMonth ? 'bg-[#fafafa]' : ''} ${isToday(item.date) ? 'bg-[#fffbe6]' : ''}`}
                >
                  <div className={`text-xs font-bold text-right ${item.otherMonth ? 'text-[#ccc]' : ''} ${isToday(item.date) ? 'text-logo' : ''}`}>{item.date.getDate()}</div>
                  <div className="mt-[5px] overflow-y-auto flex-grow">
                    {daySchedules.map((schedule, sIdx) => (
                      <div key={sIdx} className="text-[11px] py-[3px] px-[5px] bg-primary text-white rounded-[3px] mb-[3px] whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer hover:opacity-80">
                        {schedule.enquiry?.course || 'Event'}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
