import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import jaLocale from '@fullcalendar/core/locales/ja';
import './App.css';

function App() {
    let year='2025';
    let month='01';
    let day=['01','02','03'];

    let time=[year+'-'+month+'-'+day[0],year+'-'+month+'-'+day[1],year+'-'+month+'-'+day[2]];
  return (
      <div>
        <FullCalendar
          plugins={[dayGridPlugin,listPlugin]}
          initialView="dayGridMonth"
          locales={[jaLocale]}
          locale="ja"
          headerToolbar={{
              right: 'dayGridMonth,listMonth',
          }}
          events={[
              { title: 'event 1', start: time[0] },
              { title: 'event 3', start: time[1] },
              { title: 'event 2', start: time[0],end: time[2]}
          ]}
        />
      </div>
  );
}

export default App;
