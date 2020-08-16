var addSecNoteButton = document.getElementById('addSecNote');
var addSecNoteDialog = document.getElementById('addSecNoteDialog');

var addSecPasswordButton = document.getElementById('addSecPassword');
var addSecPasswordDialog = document.getElementById('addSecPasswordDialog');

addSecNoteButton.addEventListener('click', function onOpen() {
  if (typeof addSecNoteDialog.showModal === "function") {
    addSecNoteDialog.showModal();
  } else {
    alert("The <dialog> API is not supported by this browser");
  }
});

addSecPasswordButton.addEventListener('click', function onOpen() {
    if (typeof addSecNoteDialog.showModal === "function") {
      addSecPasswordDialog.showModal();
    } else {
      alert("The <dialog> API is not supported by this browser");
    }
});

// addSecNoteDialog.addEventListener('close', function onClose() {
//    // 
// });



