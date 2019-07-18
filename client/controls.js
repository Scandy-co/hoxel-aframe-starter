
const isHeadset = AFRAME.utils.device.checkHeadsetConnected();

const rightHand = document.getElementById('rightHand')
const leftHand = document.getElementById('leftHand')
const txt = document.getElementById('txt')
// aler)t(AFRAME.utils.device.checkHeadsetCon)nected())
if (isHeadset) {
  alert('headset!') 
}

rightHand.addEventListener('gripdown', event => {
  console.log('The hand is closed into a fist without thumb raised.')
  txt.setAttribute('value', 'The hand is closed into a fist without thumb raised.')
})

rightHand.addEventListener('gripup', event => {
  console.log('The hand is no longer closed into a fist without thumb raised.')
  txt.setAttribute('value', 'The hand is no longer closed into a fist without thumb raised.')
})
rightHand.addEventListener('pointup', event => {
  console.log('The hand is touching or pressing the trigger only.')
  txt.setAttribute('value', 'The hand is touching or pressing the trigger only.')
})
rightHand.addEventListener('pointdown', event => {
  console.log('The hand is no longer touching or pressing the trigger only.')
  txt.setAttribute('value', 'The hand is no longer touching or pressing the trigger only.')
})
rightHand.addEventListener('thumbup', event => {
  console.log('The hand is closed into a fist with thumb raised.')
  txt.setAttribute('value', 'The hand is closed into a fist with thumb raised.')
})
rightHand.addEventListener('thumbdown', event => {
  console.log('The hand is no longer closed into a fist with thumb raised.')
  txt.setAttribute('value', 'The hand is no longer closed into a fist with thumb raised.')
})
rightHand.addEventListener('pointingstart', event => {
  console.log('The hand is pointing with index finger without thumb raised.')
  txt.setAttribute('value', 'The hand is pointing with index finger without thumb raised.')
})
rightHand.addEventListener('pointingend', event => {
  console.log('The hand is no longer pointing without thumb raised.')
  txt.setAttribute('value', 'The hand is no longer pointing without thumb raised.')
})
rightHand.addEventListener('pistolstart', event => {
  console.log('The hand is pointing with index finger and thumb raised.')
  txt.setAttribute('value', 'The hand is pointing with index finger and thumb raised.')
})
rightHand.addEventListener('pistolend', event => {
  console.log('The hand is no long')
  txt.setAttribute('value', 'The hand is no long')
})




leftHand.addEventListener('gripdown', event => {
  console.log('The hand is closed into a fist without thumb raised.')
  txt.setAttribute('value', 'The hand is closed into a fist without thumb raised.')
})
leftHand.addEventListener('gripup', event => {
  console.log('The hand is no longer closed into a fist without thumb raised.')
  txt.setAttribute('value', 'The hand is no longer closed into a fist without thumb raised.')
})
leftHand.addEventListener('pointup', event => {
  console.log('The hand is touching or pressing the trigger only.')
  txt.setAttribute('value', 'The hand is touching or pressing the trigger only.')
})
leftHand.addEventListener('pointdown', event => {
  console.log('The hand is no longer touching or pressing the trigger only.')
  txt.setAttribute('value', 'The hand is no longer touching or pressing the trigger only.')
})
leftHand.addEventListener('thumbup', event => {
  console.log('The hand is closed into a fist with thumb raised.')
  txt.setAttribute('value', 'The hand is closed into a fist with thumb raised.')
})
leftHand.addEventListener('thumbdown', event => {
  console.log('The hand is no longer closed into a fist with thumb raised.')
  txt.setAttribute('value', 'The hand is no longer closed into a fist with thumb raised.')
})
leftHand.addEventListener('pointingstart', event => {
  console.log('The hand is pointing with index finger without thumb raised.')
  txt.setAttribute('value', 'The hand is pointing with index finger without thumb raised.')
})
leftHand.addEventListener('pointingend', event => {
  console.log('The hand is no longer pointing without thumb raised.')
  txt.setAttribute('value', 'The hand is no longer pointing without thumb raised.')
})
leftHand.addEventListener('pistolstart', event => {
  console.log('The hand is pointing with index finger and thumb raised.')
  txt.setAttribute('value', 'The hand is pointing with index finger and thumb raised.')
})
leftHand.addEventListener('pistolend', event => {
  console.log('The hand is no long')
  txt.setAttribute('value', 'The hand is no long')
})



// rightHand.addEventListener('triggerdown', (event) => {
//   console.log('Trigger pressed.')
//   txt.setAttribute("value",'Trigger pressed.');
// }))
// rightHand.addEventListener('triggerup', (event) => {
//   console.log('Trigger released.')
//   txt.setAttribute("value",'Trigger released.');
// }))
// rightHand.addEventListener('triggertouchstart', (event) => {
//   console.log('Trigger touched.')
//   txt.setAttribute("value",'Trigger touched.');
// }))
// rightHand.addEventListener('triggertouchend', (event) => {
//   console.log('Trigger no longer touched.')
//   txt.setAttribute("value",'Trigger no longer touched.');
// }))
// rightHand.addEventListener('triggerchanged', (event) => {
//   console.log('Trigger changed.')
//   txt.setAttribute("value",'Trigger changed.');
// }))
// rightHand.addEventListener('thumbstickdown', (event) => {
//   console.log('Thumbstick pressed.')
//   txt.setAttribute("value",'Thumbstick pressed.');
// }))
// rightHand.addEventListener('thumbstickup', (event) => {
//   console.log('Thumbstick released.')
//   txt.setAttribute("value",'Thumbstick released.');
// }))
// rightHand.addEventListener('thumbsticktouchstart', (event) => {
//   console.log('Thumbstick touched.')
//   txt.setAttribute("value",'Thumbstick touched.');
// }))
// rightHand.addEventListener('thumbsticktouchend', (event) => {
//   console.log('Thumbstick no longer touched.')
//   txt.setAttribute("value",'Thumbstick no longer touched.');
// }))
// rightHand.addEventListener('thumbstickchanged', (event) => {
//   console.log('Thumbstick changed.')
//   txt.setAttribute("value",'Thumbstick changed.');
// }))
// rightHand.addEventListener('gripdown', (event) => {
//   console.log('Grip button pressed.')
//   txt.setAttribute("value",'Grip button pressed.');
// }))
// rightHand.addEventListener('gripup', (event) => {
//   console.log('Grip button released.')
//   txt.setAttribute("value",'Grip button released.');
// }))
// rightHand.addEventListener('griptouchstart', (event) => {
//   console.log('Grip button touched.')
//   txt.setAttribute("value",'Grip button touched.');
// }))
// rightHand.addEventListener('griptouchend', (event) => {
//   console.log('Grip button no longer touched.')
//   txt.setAttribute("value",'Grip button no longer touched.');
// }))
// rightHand.addEventListener('gripchanged', (event) => {
//   console.log('Grip button changed.')
//   txt.setAttribute("value",'Grip button changed.');
// }))
// rightHand.addEventListener('abuttondown', (event) => {
//   console.log('A button pressed.')
//   txt.setAttribute("value",'A button pressed.');
// }))
// rightHand.addEventListener('abuttonup', (event) => {
//   console.log('A button released.')
//   txt.setAttribute("value",'A button released.');
// }))
// rightHand.addEventListener('abuttontouchstart', (event) => {
//   console.log('A button touched.')
//   txt.setAttribute("value",'A button touched.');
// }))
// rightHand.addEventListener('abuttontouchend', (event) => {
//   console.log('A button no longer touched.')
//   txt.setAttribute("value",'A button no longer touched.');
// }))
// rightHand.addEventListener('abuttonchanged', (event) => {
//   console.log('A button changed.')
//   txt.setAttribute("value",'A button changed.');
// }))
// rightHand.addEventListener('bbuttondown', (event) => {
//   console.log('B button pressed.')
//   txt.setAttribute("value",'B button pressed.');
// }))
// rightHand.addEventListener('bbuttonup', (event) => {
//   console.log('B button released.')
//   txt.setAttribute("value",'B button released.');
// }))
// rightHand.addEventListener('bbuttontouchstart', (event) => {
//   console.log('B button touched.')
//   txt.setAttribute("value",'B button touched.');
// }))
// rightHand.addEventListener('bbuttontouchend', (event) => {
//   console.log('B button no longer touched.')
//   txt.setAttribute("value",'B button no longer touched.');
// }))
// rightHand.addEventListener('bbuttonchanged', (event) => {
//   console.log('B button changed.')
//   txt.setAttribute("value",'B button changed.');
// }))
// rightHand.addEventListener('xbuttondown', (event) => {
//   console.log('X button pressed.')
//   txt.setAttribute("value",'X button pressed.');
// }))
// rightHand.addEventListener('xbuttonup', (event) => {
//   console.log('X button released.')
//   txt.setAttribute("value",'X button released.');
// }))
// rightHand.addEventListener('xbuttontouchstart', (event) => {
//   console.log('X button touched.')
//   txt.setAttribute("value",'X button touched.');
// }))
// rightHand.addEventListener('xbuttontouchend', (event) => {
//   console.log('X button no longer touched.')
//   txt.setAttribute("value",'X button no longer touched.');
// }))
// rightHand.addEventListener('xbuttonchanged', (event) => {
//   console.log('X button changed.')
//   txt.setAttribute("value",'X button changed.');
// }))
// rightHand.addEventListener('ybuttondown', (event) => {
//   console.log('Y button pressed.')
//   txt.setAttribute("value",'Y button pressed.');
// }))
// rightHand.addEventListener('ybuttonup', (event) => {
//   console.log('Y button released.')
//   txt.setAttribute("value",'Y button released.');
// }))
// rightHand.addEventListener('ybuttontouchstart', (event) => {
//   console.log('Y button touched.')
//   txt.setAttribute("value",'Y button touched.');
// }))
// rightHand.addEventListener('ybuttontouchend', (event) => {
//   console.log('Y button no longer touched.')
//   txt.setAttribute("value",'Y button no longer touched.');
// }))
// rightHand.addEventListener('ybuttonchanged', (event) => {
//   console.log('Y button changed.')
//   txt.setAttribute("value",'Y button changed.');
// }))
// rightHand.addEventListener('surfacedown', (event) => {
//   console.log('Surface button pressed.')
//   txt.setAttribute("value",'Surface button pressed.');
// }))
// rightHand.addEventListener('surfaceup', (event) => {
//   console.log('Surface button released.')
//   txt.setAttribute("value",'Surface button released.');
// }))
// rightHand.addEventListener('surfacetouchstart', (event) => {
//   console.log('Surface button touched.')
//   txt.setAttribute("value",'Surface button touched.');
// }))
// rightHand.addEventListener('surfacetouchend', (event) => {
//   console.log('Surface button no longer touched.')
//   txt.setAttribute("value",'Surface button no longer touched.');
// }))
// rightHand.addEventListener('surfacechange', (event) => {
//   console.log('surfacechange')
//   txt.setAttribute("value",'surfacechange');
// })) 