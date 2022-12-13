import React from 'react'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './Events'
import userServices from 'services/httpService/userAuth/userServices';
import './calendar.css'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid, TextField } from '@mui/material'

export default class Calendar extends React.Component {
  calendarComponentRef = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      weekendsVisible: true,
      calendarEvents: [],
      bookingsList: [],
      calendarWeekends: true,
      open: false,
      studentId: "",
      task: "",
      type: "",



    }
  }
  style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  componentDidMount() {
    userServices.weeklySchedule(`/GetSchedule`, {
      studentId: this.props.studentId, date:
        Date.now()

    })
      .then((res) => {
        console.table("confirmed", res.data.data);
        let filter = this.getEvents(res.data.data);
        console.log("filter:", filter)
        this.setState({
          bookingsList: res.data.Data,
          calendarEvents: filter,
        })
      }).catch((error) => {
        console.log(error);
      });

  }

  addSlot = () => {
    userServices.addSlots(`/SendSchedule`, { studentId: this.state.studentId, task: this.state.task, type: this.state.type })
      .then((res) => {
        console.table("confirmed", res.data.data);
        let filter = this.getEvents(res.data.data);
        console.log("filter:", filter)
        this.setState({
          bookingsList: res.data.Data,
          calendarEvents: filter,
        })
        this.setState({ open: false })
      }).catch((error) => {
        console.log(error);
      });
  }




  eventClick = (event) => {
    console.log("console:", event.event.startStr);
    let filter = this.state.bookingsList.filter((item) => {
      return item.Date === event.event.startStr
    }
    )
    console.log("filter:", filter);


  };

  getEvents = (dataList) => {
    let filters = [];
    dataList.map((item) => {
      console.log("getEvents:", item)
      filters.push({
        title: item.Task,
        start: item.Date,
        // end: item.endTime,
        id: item.user_id,
        allDay: false,
        color: 'green'
      })
    }
    )
    return filters;
  };
  handleShowModal = () => {
    this.setState({ open: true, checked: !this.state.checked });
  };
  handleClose = () => this.setState({ open: false })

  render() {

    console.log("bookingsList", this.state.bookingsList);
    console.log("calendarList", this.state.calendarEvents);
    return (
      <>
        <div className='demo-app-main'>
          <div className="button" style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" onClick={this.handleShowModal}>Add Slot</Button>
          </div>

          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            ref={this.calendarComponentRef}
            weekends={this.state.calendarWeekends}
            events={
              this.state.calendarEvents
            }
            dateClick={this.handleDateClick}
            eventClick={this.eventClick}
          />
        </div>
        {
          this.state.open ? (
            <Modal
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"

              >
                <Box sx={this.style}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add Slot
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    <TextField id="outlined-basic" label="StudentId" variant="standard" style={{ height: "3rem" }}
                      value={this.state.studentId}
                      onChange={(e) => this.setState({ studentId: e.target.value })}
                    />
                    <TextField id="outlined-basic" label="Task" variant="standard" style={{ height: "3rem" }}

                      value={this.state.task}
                      onChange={(e) => this.setState({ task: e.target.value })}
                    />
                    <TextField id="outlined-basic" label="Type" variant="standard" style={{ height: "3rem" }}

                      value={this.state.type}
                      onChange={(e) => this.setState({ type: e.target.value })}

                    />

                  </Typography>
                  <Button variant="contained" onClick={this.addSlot}>Add</Button>
                </Box>
              </Grid>






            </Modal>
          ) : null



        }

      </>

    )
  }

}

// import React from "react";
// import "./calendar.css";
// import { BiChevronRight, BiChevronLeft } from "react-icons/bi";
// import userServices from 'services/httpService/userAuth/userServices';
// function Timeslot(props) {
//   console.log("sdfuhds",props);
//   const [timeslot, setTimeslot] = React.useState([]);
//   const [date, setDate] = React.useState(new Date());

//   //weekly schedule for the user
//   React.useEffect(() => {
//     userServices.weeklySchedule(`/GetSchedule`, {date: date, studentId: props.studentId})
//       .then((res) => {
//         console.log(res.data);
//         setTimeslot(res.data.data);
//       }
//     )
//   }, [date]);
//   return (
//     <div className=" container-fulldiv">
//       <div className="colordivallcolor">
//         <div className="center">
//           <BiChevronLeft className="colordivall" />
//           <p className="centerdivAll">
//             <input type="date" className="dateinput"
//               onChange={(e) => { setDate(e.target.value) }}
//               value={date}
//             />
//           </p>
//           <BiChevronRight className="colordivall" />
//         </div>
//       </div>
//       <div className="days">
//         <div className="day">
//           <div className="datelabel">
//             <strong>Lunes</strong>
//             <br />
//             <div className="timeslot">{
//               timeslot.map((item) => {
//                 if (item.Day === "Mon") {
//                   return (
//                     <p className="timeslotp">{item.Date}</p>
//                   )
//                 } else {
//                   return null;
//                 }
//               }
//               )
//             }
//             </div>
//           </div>
//         </div>
//         <div className="day">
//           <div className="datelabel">
//             <strong>Jueves</strong>
//             <br />
//           </div>
//           <div className="timeslot">{
//               timeslot.map((item) => {
//                 if (item.Day === "Tue") {
//                   return (
//                     <p className="timeslotp">{item.Date}</p>
//                   )
//                 } else {
//                   return null;

//                 }
//               }
//               )
//             }</div>
//         </div>
//         <div className="day">
//           <div className="datelabel">
//             <strong>Miércoles</strong>
//             <br />
//           </div>
//           <div className="timeslot">{
//               timeslot.map((item) => {
//                 if (item.Day === "Wed") {
//                   return (
//                     <p className="timeslotp">{item.Date}</p>
//                   )
//                 } else {
//                   return null;

//                 }
//               }
//               )
//             }</div>

//         </div>
//         <div className="day">
//           <div className="datelabel">
//             <strong>Martes</strong>
//             <br />
//           </div>
//           <div className="timeslot">{
//               timeslot.map((item) => {
//                 if (item.Day === "Thu") {
//                   return (
//                     <p className="timeslotp">{item.Date}</p>
//                   )
//                 } else {
//                   return null;

//                 }
//               }
//               )
//             }</div>
//         </div>
//         <div className="day">
//           <div className="datelabel">
//             <strong>Viernes</strong>
//             <br />
//           </div>
//           <div className="timeslot">{
//               timeslot.map((item) => {

//                 if (item.Day === "Fri") {
//                   return (
//                     <p className="timeslotp">{item.Date}</p>
//                   )
//                 } else {
//                   return null;

//                 }
//               }
//               )
//             }</div>
//         </div>
//         <div className="day">
//           <div className="datelabel">
//             <strong>Sábado</strong>
//             <br />
//           </div>
//           <div className="timeslot">{
//               timeslot.map((item) => {
//                 if (item.Day === "Sat") {
//                   return (
//                     <p className="timeslotp">{item.Date}</p>
//                   )
//                 } else {
//                   return null;

//                 }
//               }
//               )
//             }</div>
//         </div>
//         <div className="day">
//           <div className="datelabel">
//             <strong>Domingo</strong>
//             <br />
//           </div>
//           <div className="timeslot">{
//               timeslot.map((item) => {
//                 if (item.Day === "Sun") {
//                   return (
//                     <p className="timeslotp">{item.Date}</p>
//                   )
//                 } else {
//                   return null;

//                 }
//               }
//               )
//             }</div>
//         </div>
//       </div>

//       <button type="button" className="btnDivALL"
//       >
//         Semana siguiente
//       </button>
//     </div>
//     // </div>
//   );
// }

// export default Timeslot;
