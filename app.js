// DOM element references
const grocery__form = document.querySelector(".grocery__form")
const grocery__alert = document.querySelector(".grocery__alert")
const grocery__container = document.querySelector(".grocery__container")
const grocery__list = document.querySelector(".grocery__list")

const input = document.getElementById("grocery-input")
const submit = document.getElementById("grocery-submit")
const clear = document.getElementById("grocery-clear")

// global variables.
let editID = "",
    editFlag = false,
    editElement

// EVENT listners
grocery__form.addEventListener( "submit", addItem)
clear.addEventListener( "click", clearItems)
window.addEventListener( "DOMContentLoaded", setupItems)


// FUNCTIONS
function addItem(e) {
  e.preventDefault()
  let id = new Date().getTime().toString()
  const value = input.value

  
  if(value && !editFlag) {
      // add a value
      // create item
      createItem(id,value)
      setToDefaults()
      displayAlert(`${value} added`,"success")
      
      // add to local storage
      addToLocalstorage(id,value)
  }

  else if(value && editFlag) {
      // editing
      editElement.textContent = value
      
      // edit to local storage
      editLocalStorage(editID,value)
      // setback to default
      // and display alert
      setToDefaults()
      displayAlert("item edited", "success")
      
  }

  else {
      // empty value
      displayAlert("please enter a value.","danger")
  }

}

// create item
function createItem(id,value) {
   const element = document.createElement("article")
   element.classList.add("grocery__item")
   const attr = document.createAttribute("data-id")
   attr.value = id
   element.setAttributeNode(attr)
   grocery__list.appendChild(element)

   element.innerHTML = `<p class="grocery__text">${value}</p>
   <div class="grocery__buttons">
       <button class="grocery__delete">del</button>
       <button class="grocery__edit">edit</button>
   </div>`

   const editBtns = document.querySelectorAll(".grocery__edit")
   const delBtns = document.querySelectorAll(".grocery__delete")

   editBtns.forEach( editBtn => {
       editBtn.addEventListener( "click", editItem)
   })

   delBtns.forEach( editBtn => {
       editBtn.addEventListener( "click", deleteItem)
   })
    
    

}

function editItem(e) {
    editElement = e.currentTarget.parentElement.previousElementSibling
    const element = e.currentTarget.parentElement.parentElement
    editID = element.dataset.id
    editFlag = true
    input.value = editElement.textContent
    submit.textContent = "edit"
}

function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement
    grocery__list.removeChild(element)
    const id = element.dataset.id

    // delete from local storage
    deleteFromLocalstorage(id)
}

function setToDefaults() {
    input.value = ""
    editID = ""
    editFlag = false
    submit.textContent = "submit"
}

function displayAlert(message,action) {
   grocery__alert.textContent = message
   grocery__alert.classList.add(action)

   setTimeout( () => {
     grocery__alert.textContent = ""
     grocery__alert.classList.remove(action)
   }, 1300)
}

// clear all items
function clearItems() {
    const items = document.querySelectorAll(".grocery__item")
    items.forEach( item => {
        grocery__list.removeChild(item)
    })
    localStorage.removeItem("list")
}

function addToLocalstorage(id,value) {
   const items = getLocalstorage()
   const grocery = {id,value}
   items.push(grocery)
   // add local storage
   localStorage.setItem("list",JSON.stringify(items))
}

function deleteFromLocalstorage(ID) {
    let items = getLocalstorage()

    items = items.filter( item => {
        if(item.id !== ID) {
            return item
        }
    })

    // add to local storage
    localStorage.setItem("list",JSON.stringify(items))
}

function editLocalStorage(ID,value) {
   let items = getLocalstorage()
   
   items = items.map( item => {
       if(item.id === ID) {
           item.value = value
       }
       return item
   })
   
   // set local storage
   localStorage.setItem("list",JSON.stringify(items))
}

function getLocalstorage() {
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : []
}





// SETUP
function setupItems() {
   const items = getLocalstorage()
   items.forEach( item => {
       createItem(item.id,item.value)
   })    
}

