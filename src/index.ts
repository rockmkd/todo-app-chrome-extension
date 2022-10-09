var state = [];

interface Item {
    status: "new" | "done" | "danger",
    id: string,
    title: string
}

interface Items {
    [id: string]: Item
}

function setDefaultState(): Items {
  const id = generateID();
  const baseState: Items = {};
  baseState[id] = {
    status: "new",
    id: id,
    title: "This site uses 🍪to keep track of your tasks"
  };
  syncState(baseState);
  return baseState;
}

function generateID(): string {
  var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return randLetter + Date.now();
}

function pushToState(title: string, status: string, id: string) {
  var baseState = getState();
  baseState[id] = { id: id, title: title, status: status };
  syncState(baseState);
}

function setToDone(id: string) {
  var baseState = getState();
  if (baseState[id].status === 'new') {
    baseState[id].status = 'done'
  } else {
    baseState[id].status =  'new';
  }

  syncState(baseState);
}

function deleteTodo(id: string) {
  var baseState = getState();
  delete baseState[id]
  syncState(baseState)
}

function syncState(state: any) {
  localStorage.setItem("state", JSON.stringify(state));
}

function getState() {
  return JSON.parse(localStorage.getItem("state") || '{}');
}

function addItem(text: string, status?: string, id?: string, noUpdate?: boolean) {
  id = id ? id : generateID();
  var c = status === "done" ? "danger" : "";
  var item =
    '<li data-id="' +
    id +
    '" class="animated flipInX ' +
    c +
    '"><div class="checkbox"><span class="close"><i class="fa fa-times"></i></span><span class="edit"><i class="fa fa-pencil-square"></i></span><label><span class="checkbox-mask"></span><input type="checkbox" />' +
    text +
    "</label></div></li>";

  var isError = $(".form-control").hasClass("hidden");

  if (text === "") {
    $(".err").removeClass("hidden").addClass("animated bounceIn");
  } else {
    $(".err").addClass("hidden");
    $(".todo-list").append(item);
  }

  $(".no-items").addClass("hidden");

//   $(".form-control").val("").attr("placeholder", "✍️ Add item...");
  setTimeout(function() {
    $(".todo-list li").removeClass("animated flipInX");
  }, 500);

  if (!noUpdate) {
    pushToState(text, "new", id);
  }
}

$(function() {
  var err = $(".err"),
    formControl = $(".form-control"),
    isError = formControl.hasClass("hidden");

  if (!isError) {
    formControl.blur(function() {
      err.addClass("hidden");
    });
  }

  $(".add-btn").on("click", function() {
    var itemVal = $(".form-control").val();
    addItem(itemVal?.toString() || '');
    formControl.focus();
  });
  
  $(".todo-list").on("click", 'input[type="checkbox"]', function() {
    var li = $(this)
      .parent()
      .parent()
      .parent();
    li.toggleClass("danger");
    li.toggleClass("animated flipInX");

    setToDone(li.data().id);

    setTimeout(function() {
      li.removeClass("animated flipInX");
    }, 500);
  });

  $(".todo-list").on("click", ".close", function() {
    var box = $(this).parent().parent();

    if ($(".todo-list li").length == 1) {
      box.removeClass("animated flipInX").addClass("animated                bounceOutLeft");
      setTimeout(function() {
        box.remove();
        $(".no-items").removeClass("hidden");
      }, 500);
    } else {
      box.removeClass("animated flipInX").addClass("animated bounceOutLeft");
      setTimeout(function() {
        box.remove();
      }, 500);
    }

    deleteTodo(box.data().id)
  });

  $(".form-control").keypress(function(e) {
    if (e.which == 13) {
      var itemVal = $(".form-control").val();
      addItem(itemVal?.toString() || '');
    }
  });
  $(".todo-list").sortable();
//   $(".todo-list").disableSelection();
});

function today(): string {
    var d = new Date();
    const weekday = ['일', '월', '화', '수', '목', '금', '토']
    return [
        d.getMonth(), '월 ', 
        d.getDate(), '일 ', 
        '(', weekday[d.getDay()],') ', 
        d.getHours(), '시 ', 
        d.getMinutes(), '분', 
    ].join('');

}

var todayContainer = document.querySelector(".today");

// document.querySelector(".today")?.innerHTML = today()
if (todayContainer) {
    todayContainer.innerHTML = today();
}

$(document).ready(function() {
  var state = getState();

  if (!state) {
    setDefaultState();
    state = getState();
  }

  Object.keys(state).forEach(function(todoKey) {
    var todo = state[todoKey];
    addItem(todo.title, todo.status, todo.id, true);
  });
}); 

