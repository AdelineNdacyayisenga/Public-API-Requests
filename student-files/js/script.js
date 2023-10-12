let employeeCards = [];
const search = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');

const overlayElem = document.createElement('div');
overlayElem.classList.add('overlay');
body.appendChild(overlayElem);

/* HTML */
const searchHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`;
search.insertAdjacentHTML('beforeend', searchHTML);

//fetch data
async function getData() {
    try {
        const response = await fetch('https://randomuser.me/api/?results=12');
        if(!response.ok) throw new Error("Something went wrong");
        const data = await response.json();
        employeeCards = data.results;
        displayEmployees(data.results);
    } catch (error) {
        console.log('Looks like there is an error', error);
    }
    
}

//makes sure only clicks on the card are targeted
//find a card that matches the name

gallery.addEventListener('click', (e) => {
    const currentValue = e.target.closest('.card'); //returns clicked card

    //currentValue.children[1].children[0].textContent -> gives the name
    if(currentValue) {
        employeeName = currentValue.children[1].children[0].textContent;
        
        const similarEmployee = employeeCards.find(employee => `${employee.name.first} ${employee.name.last}` === employeeName);
        //console.log(similarEmployee);
        displayEmployeeModal(similarEmployee);
    } else {
        return;
    }
});

const overlay = document.querySelector('.overlay');
function displayEmployeeModal (card) {

    //check the name like: it was just name not first name required
    const modelHTML = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${card.picture.thumbnail}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${card.name.first}</h3>
                    <p class="modal-text">${card.email}</p>
                    <p class="modal-text cap">${card.location.city}</p>
                    <hr>
                    <p class="modal-text">${card.cell}</p>
                    <p class="modal-text">${card.location.street}, ${card.location.city}, ${card.location.state} ${card.location.postcode}</p>
                    <p class="modal-text">Birthday: ${card.dob.date}</p>
                </div>
            </div>
        </div>
    `;
    body.insertAdjacentHTML('beforeend', modelHTML);
    //overlay.insertAdjacentHTML('beforeend', modelHTML);
    
    //why is it requiring me to double click?
    document.querySelector('.modal-close-btn').addEventListener('click', e => {
        body.lastChild.remove();
    });

    //when user clicks outside the modal
    body.addEventListener('click', e => {
        const isOutside = !e.target.closest('.modal');
        if(isOutside) {
            body.lastChild.remove();
        }
    });
}





function displayEmployees(data) {
    data.map(item => {
        const galleryHTML = `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${item.picture.thumbnail}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${item.name.first} ${item.name.last}</h3>
                <p class="card-text">${item.email}</p>
                <p class="card-text cap">${item.location.city}, ${item.location.state}</p>
            </div>
        </div>
        `;
        gallery.insertAdjacentHTML('beforeend', galleryHTML);
    });
}
getData();

