(function(){
    var animating = false;
  
    function animatecard(ev) {
      if (animating === false) {
        var t = ev.target;
        if (t.className === 'but-nope') {
          t.parentNode.classList.add('nope');
          animating = true;
          fireCustomEvent('nopecard',
            {
              origin: t,
              container: t.parentNode,
              card: t.parentNode.querySelector('.card')
            }
          );
        }
        if (t.className === 'but-yay') {
          t.parentNode.classList.add('yes');
          animating = true;
          fireCustomEvent('yepcard',
            {
              origin: t,
              container: t.parentNode,
              card: t.parentNode.querySelector('.card')
            }
          );
        }
        if (t.classList.contains('current')) {
          fireCustomEvent('cardchosen',
            {
              container: getContainer(t),
              card: t
            }
          );
        }
      }
    }
  
    function fireCustomEvent(name, payload) {
      var newevent = new CustomEvent(name, {
        detail: payload
      });
      document.body.dispatchEvent(newevent);
    }
  
    function getContainer(elm) {
      var origin = elm.parentNode;
      if (!origin.classList.contains('cardcontainer')){
        origin = origin.parentNode;
      }
      return origin;
    }
  
    function animationdone(ev) {
      animating = false;
      var origin = getContainer(ev.target);
      if (ev.animationName === 'yay') {
        origin.classList.remove('yes');
      }
      if (ev.animationName === 'nope') {
        origin.classList.remove('nope');
      }
      if (origin.classList.contains('list')) {
        if (ev.animationName === 'nope' ||
            ev.animationName === 'yay') {
          origin.querySelector('.current').remove();
          if (!origin.querySelector('.card')) {
            fireCustomEvent('deckempty', {
              origin: origin.querySelector('button'),
              container: origin,
              card: null
            });
          } else {
            origin.querySelector('.card').classList.add('current');
          }
        }
      }
    }
    document.body.addEventListener('animationend', animationdone);
    document.body.addEventListener('webkitAnimationEnd', animationdone);
    document.body.addEventListener('click', animatecard);
    window.addEventListener('DOMContentLoaded', function(){
      document.body.classList.add('tinderesque');
    });
  })();
  
 document.body.addEventListener('nopecard', function(ev) {
   var container = ev.detail.container;
   var label = container.querySelector('.nopes');
   if (label) {
     var nopes = +container.nopes || 0;
     nopes++;
     container.nopes = nopes;
     label.innerHTML = container.nopes;
   }
 });

 document.body.addEventListener('yepcard', function(ev) {
   var container = ev.detail.container;
   var label = container.querySelector('.yays');
   if (label) {
     var yeps = +container.yeps || 0;
     yeps++;
     container.yeps = yeps;
     label.innerHTML = container.yeps;
   }
 });

 document.body.addEventListener('deckempty', function(ev) {
   var container = ev.detail.container;
   var list = container.querySelector('.cardlist');
   var out = '<li class="card current">#1</li>';
   for (var i = 2; i < 6; i++) {
     out += '<li class="card">#' + i + '</li>';
   }
   list.innerHTML = out;
 });