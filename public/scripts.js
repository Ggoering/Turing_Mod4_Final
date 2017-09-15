var sortDir = 'up'

function getItems() {
  return fetch('api/v1/items')
  .then((blob) => blob.json())
  .catch((error) => error.json())
}

function postItems(data) {
  $('.garage-list').empty()
    for(let i = 0; i < data.length; i++) {
      $('.garage-list').append(`
        <article data-name="${data[i].name.toLowerCase()}" id="${data[i].id}" class="garage-list-item">
          <h3 class="list-item-name">${data[i].name}</h3>
          <div class="expanded-info">
            <p class="list-item-name">Still here because: ${data[i].reason}</p>
            <p class="list-item-name">Cleanliness:     
              <select class="cleanliness-selector">
              </select>
            </p>
          </div>
        </article> 
        `)
      setCleanlinessBar(data[i].cleanliness, data[i].id)
    }
}

getItems()
.then((data) => {
  postItems(data)
  displayBreakdown(data)
  displayItemCount(data)
  sortGarageItems()
})

function setCleanlinessBar(defaultLevel, id) {
  const cleanlinessArray = ['Sparkling', 'Dusty', 'Rancid']
  for (let j = 0; j < cleanlinessArray.length; j++) {
    let selected = ''
    defaultLevel == cleanlinessArray[j] ? selected = 'selected' : selected = ''
    $('#'+id).find('.cleanliness-selector').append(
      `<option ${selected} value="${cleanlinessArray[j]}">${cleanlinessArray[j]}</option>`
    )
  }
}

function getCleaninessCount(data, matching) {
  return data.reduce((accu, element) => {
    element.cleanliness === matching ? accu += 1 : accu = accu
    return accu
  }, 0)
}

function displayBreakdown(data) {
  $('.break-down-container').remove()
  const sparklingCount = getCleaninessCount(data, 'Sparkling')
  const dustyCount = getCleaninessCount(data, 'Dusty')
  const rancidCount = getCleaninessCount(data, 'Rancid')
  
  $('.garage-info-breakdown').append(
    `<div class="break-down-container">
      <h2>How clean is your junk?</h2>
      <h3>Sparkling clean items: ${sparklingCount}</h3>
      <h3>Dusty items: ${dustyCount}</h3>
      <h3>rancid items: ${rancidCount}</h3>
    </div>`
  )
}

function displayItemCount(data) {
  $('.garage-info-sum').append(
    `<div class="break-down-container">
      <h2>${data.length} items of junk in storage</h2>
    </div>`
  )
}

function closeDoor() {
  $('.door').height('100%')
}

function openDoor() {
  $('.door').height('0px')
}

$('.down').on('click', closeDoor)
$('.up').on('click', openDoor)

function addItem() {
  fetch('/api/v1/items', {
    method: 'POST',
    body: JSON.stringify({ 
      name: $('.new-garage-item').val(),
      reason: $('.new-garage-reason').val(),
      cleanliness: $('.new-garage-item-cleanliness').val()
     }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(() => {
    getItems()
    .then((data) => {
      postItems(data)
      displayBreakdown(data)
      displayItemCount(data)
    })
  })
}

function updateCleanliness(event) {
  itemId = event.target.closest('article').id
  fetch(`/api/v1/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ 
      cleanliness: event.target.value
     }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(() => {
    getItems()
    .then((data) => {
      postItems(data)
      displayBreakdown(data)
      displayItemCount(data)
      sortGarageItems()
    })
  })
}

$('.submit-item-button').on('click', addItem)
$('.garage-list').on('change', $('.cleanliness-selector'), updateCleanliness)








function sortGarageItems() {
  var $items = $('.garage-list-item')
  
  $items.sort((a, b) => {
    const an = a.getAttribute('data-name')
    const bn = b.getAttribute('data-name')
    
    if(an > bn) {
      return 1;
    }
    if(an < bn) {
      return -1;
    }
    return 0;
  });
  
  $items.detach().appendTo('.garage-list');
}




