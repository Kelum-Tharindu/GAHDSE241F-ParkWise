import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const BookingCalendar = () => {
  const events = [
    { title: 'Booking #BK001', start: '2023-05-01', end: '2023-05-03', color: '#4F46E5' },
    { title: 'Booking #BK002', start: '2023-05-05', color: '#10B981' },
    { title: 'Booking #BK003', start: '2023-05-07', end: '2023-05-09', color: '#F59E0B' },
    { title: 'Booking #BK004', start: '2023-05-12', color: '#EF4444' },
    { title: 'Booking #BK005', start: '2023-05-15', end: '2023-05-17', color: '#4F46E5' },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg mb-4">Booking Calendar</h3>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek',
        }}
        height="400px"
      />
    </div>
  )
}

export default BookingCalendar