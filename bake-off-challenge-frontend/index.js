// your code here!
//Dom elements

const bakesUl = document.querySelector("#bakes-container")
const detailId = document.querySelector("#detail")
const form = document.querySelector("#new-bake-form")
const scoreForm = document.querySelector("#score-form")
const judge = document.querySelector("#judge-bake-button")

let currentList
let currentBake
let currentScore = 0
let winningBake

//
// function winningBakeScore(){
//     currentList.forEach(bake => {
//         if (currentScore < bake.score){
//             bake.score = currentScore
//             winningBake = bake
//             const id = bake.id
//         }
//     })
// }

function winningBakeScore(event){
    fetch('http://localhost:3000/bakes/winner')
    .then(response => response.json())
    .then(winningBake => {
        const allLis = bakesUl.querySelectorAll("li")
        for(i = 0; i < allLis.length; i++) { 

            if(allLis[i].textContent === winningBake.name){
                allLis[i].className = "winner"
            }
          }
}) 
    
}

//event listeners
judge.addEventListener("click", winningBakeScore)

bakesUl.addEventListener("click", function(event){
    if (event.target.tagName === "LI"){
        const id = event.target.dataset.id
       const index =  currentList[(id - 1)]
        showBake(index)
    }
})

form.addEventListener("submit", handleForm)

scoreForm.addEventListener("submit", handleScoreForm)

//forms

function handleScoreForm(event){
    event.preventDefault()
    scoreObj = {
        score: event.target.score.value
    }
    let id = currentBake.id
    fetch(`http://localhost:3000/bakes/${id}/ratings`, {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer 699a9ff1-88ca-4d77-a26e-e4bc31cfc261"
    },
    body: JSON.stringify(scoreObj),
    })
    .then(response => response.json())
    .then(returnedBake => {
    console.log('After score submit:', returnedBake);
    })
    .catch((error) => {
    console.error('Error:', error);
    });
    event.target.reset()

}

function handleForm(event){
    event.preventDefault()
    let newBake = {
        name: event.target.name.value,
        image_url: event.target.image_url.value,
        description: event.target.description.value
    }
    fetch("http://localhost:3000/bakes", {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newBake),
    })
    .then(response => response.json())
    .then(newBake => {
        createBakesList(newBake)
    console.log('Success new Bake:', newBake);
    })
    .catch((error) => {
    console.error('Error:', error);
    });
    event.target.reset()
}

//display bake

function showBake(bake){
    currentBake = bake
    const img = detailId.querySelector("img")
    const h1 = detailId.querySelector("h1")
    const p = detailId.querySelector("p")
    img.src = bake.image_url
    h1.textContent = bake.name
    p.textContent = bake.description
}
//create list of bakes

function createBakesList(bake){
    const li = document.createElement("li")
    li.textContent = bake.name
    li.dataset.id = bake.id
    bakesUl.append(li)
}

//inital render

function iterateBakes(bakesArray){
    bakesArray.forEach(bake => {
        createBakesList(bake)
    })
}

function initialize (){
    fetch('http://localhost:3000/bakes')
    .then(response => response.json())
    .then(bakesArray => {
        currentList = bakesArray
        iterateBakes(bakesArray)
        showBake(bakesArray[0])
    });
}
initialize()