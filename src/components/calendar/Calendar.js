import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {useMemo, useEffect, useState} from 'react';
import { es } from 'date-fns/locale';
import toDate from 'date-fns/toDate'
import parseISO from 'date-fns/parseISO'
import { endPoint } from '../../config/config';


import './styles.css'
import { getLocalUserdata } from 'services/auth/localStorageData'
import userServices from 'services/httpService/userAuth/userServices';

require('globalize/lib/cultures/globalize.culture.es');

const locales = {
  'es': es,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const MyCalendar = (props) => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const data = getLocalUserdata();

    userServices.commonPostService('/GetSchedule',{"studentId":data.id,"month":(new Date().getMonth()+1)})
    .then((response) => {
      if(response.data.status==='Successfull')
      {
        response.data.data.forEach((task) => {
          const date=toDate(parseISO(task.Date));
          setSchedule(oldArray => [...oldArray, {
            id:task.id,
            title:task.Task,
            start:date,
            end:date,
            bgColor:task.bgcolor,
            image:task.image,
          }]);
        })
      }
      else {
        console.log('Some error came fetching schedule');
      }
    }).catch((err) => {
      console.log(err)
    });
  },[])

  const lang = {
    es: {
      week: 'Semana',
      work_week: 'Semana de trabajo',
      day: 'Día',
      month: 'Mes',
      previous: 'Atrás',
      next: 'Siguiente',
      today: 'Hoy',
      agenda: 'El Diario',
      
      showMore: (total) => `+${total} más`,
    }}

    {/*const d = new Date();
    const localTime = d.getTime();
    const localOffset = d.getTimezoneOffset() * 60000;

    const utc = localTime + localOffset;
    const offset = 2; // UTC of Dubai is +04.00
    const dubai = utc + (3600000 * offset);

    const spainTimeNow = new Date(dubai).toLocaleString();
    console.log(new Date(spainTimeNow));*/}

    const { defaultDate, messages, views, formats } = useMemo(() => ({
      defaultDate: new Date(),
      messages: lang['es'],
      views : {
        month: true,
        week: true
      },
      formats: {
        dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
          localizer.format(start, 'dd', culture) +
          ' - ' +
          localizer.format(end, 'dd LLLL yyyy', culture),
        dayHeaderFormat: (date, culture, localizer) =>
          localizer.format(date, 'EEEE, dd MMMM yyyy', culture),
      },
    }),[])

    const eventStyleGetter = (event, start, end, isSelected) => {
      var style = {
          backgroundColor: event?.bgColor,
      };
      return {
          style: style
      };
  }
  
  return(
    <div style={{display:'flex', width:'96%', margin:'2%'}}>
      <div style={{flexGrow:1}}>
      <Calendar
        localizer={localizer}
        events={schedule}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 550 }}
        culture={'es'}
        messages={messages}
        defaultDate={defaultDate}
        views={views}
        popup
        components={{
          week: {
            header: ({ date, localizer }) => localizer.format(date, 'EEEE dd')
          },
        }}
        formats={formats}
        eventPropGetter={(eventStyleGetter)}
        titleAccessor={function(e){return <span style={{display:'flex'}}>
          {e?.image?
            <img style={{maxWidth:'3em', borderRadius:'3%'}} src={`https://neoestudio.net/${e?.image}`}/>
            :null}
                      <span>{e.title}</span>
            </span>;
          }}

      />
      </div>
    </div>
  )
}

    export default MyCalendar