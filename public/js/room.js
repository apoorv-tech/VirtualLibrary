// const url="../../public/js/pdf.pdf"

function base64ToBlob(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; ++i) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: 'application/pdf' });
};

let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

const scale = 1.5,
  canvas = document.querySelector('#pdf-render'),
  ctx = canvas.getContext('2d');
  const pdfdata = document.querySelector('#pdf')
  const pdfbase64 = pdfdata.innerText
  const pdfbase64_2 = pdfbase64.substr(56,pdfbase64.length-60)

// Render the page
const renderPage = num => {
  pageIsRendering = true;

  // Get page
  pdfDoc.getPage(num).then(page => {
    // Set scale
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });

    // Output current page
    document.querySelector('#page-num').textContent = num;
  });
};

// Check for pages rendering
const queueRenderPage = num => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
};

// Show Prev Page
const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
};

// Show Next Page
const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
};

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

// Get Document
pdfjsLib
  .getDocument({ data : atob(pdfbase64_2)})
  .promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;

    document.querySelector('#page-count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
  })
  .catch(err => {
    // Display error
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div, canvas);
    // Remove top bar
    document.querySelector('.top-bar').style.display = 'none';
  });

// Button Events
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);


function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let socket;

const hassub = getParameterByName('hassub')
const userid = getParameterByName('uid')
const bookid = getParameterByName('room')
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const togglebtn = document.querySelector('#togglebtn')

let exists = false

if(hassub=="true")exists=true

socket = io.connect('http://127.0.0.1:4000',{
  query: {
    userid: String(userid),
    bookdid: String(bookid) 
  }
})
socket.emit("join",{hassub : exists})
socket.emit("message","hemmlo bhio")

socket.on("adduser",(user)=>{
  const li = document.createElement('li');
  li.innerText = user;
  li.className = "userx"
  userList.appendChild(li);
})

socket.on("removeuser",(user)=>{
  console.log(user)
  const arr = document.querySelectorAll('.userx')
  for(let i=0;i<arr.length;i++){
    //console.log(arr[i])
    if(arr[i].innerHTML==user){
      console.log(arr[i])
      arr[i].parentNode.removeChild(arr[i])
    }
  }
})




// // Add users to DOM
// function outputUsers(users) {
//   userList.innerHTML = '';
//   users.forEach((user) => {
//     const li = document.createElement('li');
//     li.innerText = user.username;
//     userList.appendChild(li);
//   });
// }

// socket.on("adduser",(user)=>{
//   outputUsers
// })


togglebtn.addEventListener('click',()=>{
  if(togglebtn.innerHTML=="Join Voice"){
    socket.emit("adduser",userid)
    togglebtn.innerHTML="Leave Voice"
  }else{
    socket.emit("removeuser",userid)
    togglebtn.innerHTML="Join Voice"
  }
})

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', {msg : msg,user : userid});

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});



// Output message to DOM
function outputMessage(data) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  if(data.user==""){
    p.innerText = bookid;
  }else{
    p.innerText = data.user;
  }
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = data.msg;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

socket.on('chatMessage',(data)=>{
  console.log(data.msg)
  outputMessage(data)
})