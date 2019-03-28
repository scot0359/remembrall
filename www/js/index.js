

let app = {

    notificationArr: [],

    init: function (ev) {
      document.addEventListener("deviceready", app.ready);
    },

    ready: function () {
      app.addListeners();
      app.switchPage();
    },

    addListeners: function () {
      document.querySelector("#save-btn").addEventListener("click", app.addNote);

      cordova.plugins.notification.local.on("click", function (notification) {
        //navigator.notification.alert("clicked: " + notification.id);
        //user has clicked on the popped up notification
        console.log(notification.data);
      });

      cordova.plugins.notification.local.on("trigger", function (notification) {
        //added to the notification center on the date to trigger it.
       //navigator.notification.alert("triggered: " + notification.id);
      });
    },

    switchPage: function () {

       let pages = [];

        pages = document.querySelectorAll(".page");

        document.getElementById("add-btn").addEventListener("click", function () {
            pages[0].classList.remove("active");
            pages[1].classList.add("active");
            let resetButton = document.getElementById("label");
            if(resetButton){
              resetButton.value= "";
            }
        });
        
        document.getElementById("save-btn").addEventListener("click", function () {
          pages[1].classList.remove("active");
          pages[0].classList.add("active");
        });

        document.getElementById("cancel-btn").addEventListener("click", function () {
          pages[1].classList.remove("active");
          pages[0].classList.add("active");
        });
    },

    displayArray: function () {
      sortMonth = app.notificationArr.sort(function (a, b){
        return a.date.getMonth()-b.date.getMonth();
      })

      sortMonth.sort(function (a, b){
        return a.date.getDay()-b.date.getDay();
      })

      document.getElementById("notification-div").innerHTML = '';

      app.notificationArr.forEach(notification => {
        document.getElementById("notification-div").innerHTML += notification.element;
      });

      [].forEach.call(document.querySelectorAll(".remove-btn"), (notification) => {
          notification.addEventListener('click', app.removeNotification)
      });
    },

    removeNotification: function (ev) {
    let iframe = document.createElement("IFRAME");
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    let choice = window.frames[0].window.confirm("Are you sure you want to remove this notification?");
    iframe.parentNode.removeChild(iframe);
    if (choice === true) {
      console.log(ev.target.getAttribute("data-id"));
      app.notificationArr.forEach(notification => {
        if (notification.id == ev.target.getAttribute("data-id")) {
          app.notificationArr.splice(app.notificationArr.indexOf(notification), 1)
        }
      });

      app.displayArray();
    }
  },

    addNote: function (ev) {

      let props = cordova.plugins.notification.local.getDefaults();
      console.log(props);
      
      let inOneMin = new Date();
      inOneMin.setMinutes(inOneMin.getMinutes() + 1);
      let id = new Date().getMilliseconds();
      
      let label = document.getElementById("label").value;
      let date = document.getElementById("date").value;
      
      date = new Date(date);
      
      let formattedDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
      
      let notificationDate = new Date();
      notificationDate.setDate(date.getDate()-7);
      let time = document.getElementById("time").value;
      
      
      app.notificationArr.push({
        element: `<h2>${label}<br>${formattedDate}<br>${time}<button class="remove-btn" data-id="${id}">Remove</button></h2>`,
        id: id,
        date: date
      });

      app.displayArray();
      
      let noteOptions = {
        id: id,
        title: label,
        text: label,
        at: notificationDate,
        badge: 1,
        data: {
          prop: "prop value",
          num: 42
        }
      };
  
      cordova.plugins.notification.local.schedule(noteOptions);
  
    }
  };

  app.init();
