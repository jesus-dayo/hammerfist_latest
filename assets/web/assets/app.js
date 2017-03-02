var app = angular.module('app', [,'ui.calendar', 'ui.bootstrap']);

app.controller('appCtrl', ['$scope','$compile','uiCalendarConfig', function ($scope,$compile,uiCalendarConfig) {
	var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
	var monday = getFirstDayOfWeek(date, 'mon');
	var tuesday = getFirstDayOfWeek(date, 'tue');
	var wednesday = getFirstDayOfWeek(date, 'wed');
	var thursday = getFirstDayOfWeek(date, 'thurs');
	var friday = getFirstDayOfWeek(date, 'fri');
	var saturday = getFirstDayOfWeek(date, 'sat');
	var sunday = getFirstDayOfWeek(date, 'sun');
	
	
    
    $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com */
    $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
    };
    /* event source that contains custom events on the scope */
    $scope.events = [
	  {title: 'HammerFist Kids',start: getDayWithTime(tuesday,16,30),end: thursday,color: '#5cb85c',textColor: 'black',allDay: false},
	  {title: 'Grappling',start: getDayWithTime(tuesday,20,00),color: '#b85c8f',textColor: 'black',allDay: false},
	  {title: 'Grappling',start: getDayWithTime(thursday,20,30),color: '#b85c8f',textColor: 'black',allDay: false},
	  {title: 'MMA',start: getDayWithTime(wednesday,16,30),color: '#e1a90f',textColor: 'black',allDay: false},
	  {title: 'MMA',start: getDayWithTime(friday,20,00),color: '#e1a90f',textColor: 'black',allDay: false},
	  {title: 'HammerFist Women',start: getDayWithTime(monday,19,00),color: '#5bc0de',textColor: 'black',allDay: false},
	  {title: 'HammerFist Women',start: getDayWithTime(wednesday,19,00),color: '#5bc0de',textColor: 'black',allDay: false},
	  {title: 'HammerFist Women',start: getDayWithTime(friday,19,00),color: '#5bc0de',textColor: 'black',allDay: false},
	  {title: 'Muay Thai',start: getDayWithTime(monday,20,00),color: '#c0a375',textColor: 'black',allDay: false},
	  {title: 'Muay Thai',start: getDayWithTime(wednesday,20,00),color: '#c0a375',textColor: 'black',allDay: false},
	  {title: 'Boxing',start: getDayWithTime(tuesday,20,00),color: '#f281b5',textColor: 'black',allDay: false},
	  {title: 'Boxing',start: getDayWithTime(thursday,20,00),color: '#f281b5',textColor: 'black',allDay: false},
	  {title: 'Fighters Class',start: getDayWithTime(saturday,17,00),color: '#f0f281',textColor: 'black',allDay: false},
    ];
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };

    $scope.calEventsExt = {
       color: '#f00',
       textColor: 'yellow',
       events: [ 
          {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
        ]
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) { 
        element.attr({'tooltip': event.title,
                     'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };

    $scope.changeLang = function() {
      if($scope.changeTo === 'Hungarian'){
        $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
        $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
        $scope.changeTo= 'English';
      } else {
        $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        $scope.changeTo = 'Hungarian';
      }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
	
	function getFirstDayOfWeek(date, day) {

  // copy date object
  date = new Date(date);

  if (day == 'mon') {
    date.setDate(date.getDate() - (date.getDay() || 7) + 1);

  }else if (day == 'tue') {
    date.setDate(date.getDate() - (date.getDay() || 7) + 2);

  }else if (day == 'wed') {
    date.setDate(date.getDate() - (date.getDay() || 7) + 3);

  }else if (day == 'thurs') {
    date.setDate(date.getDate() - (date.getDay() || 7) + 4);

  }else if (day == 'fri') {
    date.setDate(date.getDate() - (date.getDay() || 7) + 5);
  }else if (day == 'sat') {
    date.setDate(date.getDate() - (date.getDay() || 7) + 6);
  }else if (day == 'sun') {
    date.setDate(date.getDate() - (date.getDay() || 7) + 7);
  }else {
    date.setDate(date.getDate() - date.getDay());
  }
  return date;
}

function getDayWithTime(date, hr,min) {

  // copy date object
  date = new Date(date);
  date.setHours(hr);
  date.setMinutes(min);
  return date;
}
}]);
