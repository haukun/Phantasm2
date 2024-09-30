//  右クリック無効化
document.addEventListener('contextmenu',function(event){
  event.preventDefault();
});

document.addEventListener('keydown', function (event) {
  if (event.key == 'Tab' || event.key == 'Escape') {
    event.preventDefault();
  }
});


