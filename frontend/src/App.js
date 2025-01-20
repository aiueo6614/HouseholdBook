import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './App.css';

function App() {
  return (
      <div>
        <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />
      </div>
  );
}

export default App;
