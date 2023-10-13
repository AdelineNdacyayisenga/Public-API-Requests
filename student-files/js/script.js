/**
 * Treehouse FullStack JavaScript Techdegree Project 5
 * @author Adeline Ndacyayisenga
 */

let employeeCards = [];
const search = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');

/**
 * Fetches data and display the results
 */
async function getData() {
    try {
        const response = await fetch('https://randomuser.me/api/?nat=us&results=12');
        if(!response.ok) throw new Error("Something went wrong");
        const data = await response.json();
        employeeCards = data.results;
        displayEmployees(data.results);
    } catch (error) {
        console.log('Looks like there is an error', error);
    }
    
}

/**
 * Event listener; makes sure user only clicks on a card
 * Finds and displays the card
 */
gallery.addEventListener('click', (e) => {
    const currentValue = e.target.closest('.card'); //returns clicked card

    //currentValue.children[1].children[0].textContent -> gives the name
    if(currentValue) {
        employeeName = currentValue.children[1].children[0].textContent;
        
        const similarEmployee = employeeCards.find(employee => `${employee.name.first} ${employee.name.last}` === employeeName);
        const cardIndex = employeeCards.indexOf(similarEmployee);
        displayEmployeeModal(similarEmployee);
    } else {
        return;
    }
});

/**
 * Display a modal for the selected card
 * Emplements a way for user to close the modal
 * @param {array} card - The array of object properties of the card to display
 */
function displayEmployeeModal (card) {
    const modelHTML = `
        <div class="modal-container" data-index="${employeeCards.indexOf(card)}">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${card.picture.thumbnail}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${card.name.first} ${card.name.last}</h3>
                    <p class="modal-text">${card.email}</p>
                    <p class="modal-text cap">${card.location.city}</p>
                    <hr>
                    <p class="modal-text">${formatCell(card.cell)}</p>
                    <p class="modal-text">${card.location.street.number} ${card.location.street.name}, ${card.location.city}, ${card.location.state}, ${card.location.postcode}</p>
                    <p class="modal-text">Birthday: ${formatDOB(card.dob.date)}</p>
                </div>
            </div>

            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;
    body.insertAdjacentHTML('beforeend', modelHTML);
    const currentValue = body.querySelector('.modal-container');
    //close modal when user clicks the X or button or on the overlay
    document.addEventListener('click', e => {
        if(e.target.className === 'modal-close-btn' || e.target.innerText === 'X') {
            currentValue.remove();
        }
        if(e.target.className === 'modal-container') {
            const isOutside = !e.target.closest('.modal-info-container');
            
            if(isOutside) {
                currentValue.remove();
            }
        } 
    });
    //close modal if user clicks the escape key
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') {
          currentValue.remove();
        }
      });
}

/**
 * Event Listener for the prev and next buttons; displays modals accordingly
 */
document.addEventListener('click', e => {
    const cards = document.querySelectorAll('.card');
    if(e.target.closest('.modal-prev')) {
        const prevButton = document.getElementById('modal-prev');
        const modalCont = document.querySelector('.modal-container');
        const currentIndex = +modalCont.dataset.index;
        if(currentIndex !== 0) {
            const previousCardName = cards[currentIndex-1].querySelector('h3').textContent;
            const sameEmployee = employeeCards.find(employee => `${employee.name.first} ${employee.name.last}` === previousCardName);
            //check if there is already a modal container and remove it before creating a new one
            if(modalCont !== null) {
                modalCont.remove();
            }
            displayEmployeeModal(sameEmployee);
        } else {
            const previousCardName = cards[cards.length-1].querySelector('h3').textContent;
            const sameEmployee = employeeCards.find(employee => `${employee.name.first} ${employee.name.last}` === previousCardName);
            if(modalCont !== null) {
                modalCont.remove();
            }
            displayEmployeeModal(sameEmployee);
        } 
    }
    if(e.target.closest('.modal-next')) {
        const nextButton = document.querySelector('#modal-next');
        const modalCont = document.querySelector('.modal-container');
        const currentIndex = +modalCont.dataset.index;
        //if on the last card, then show the very first one
        if(currentIndex === 11) {
            const nextCardName = cards[cards.length - cards.length].querySelector('h3').textContent;
            const sameEmployee = employeeCards.find(employee => `${employee.name.first} ${employee.name.last}` === nextCardName);
            //check if there is already a modal container and remove it before creating a new one
            if(modalCont !== null) {
                modalCont.remove();
            }
            displayEmployeeModal(sameEmployee);
        } else {
            const nextCardName = cards[currentIndex+1].querySelector('h3').textContent;
            const sameEmployee = employeeCards.find(employee => `${employee.name.first} ${employee.name.last}` === nextCardName);
            if(modalCont !== null) {
                modalCont.remove();
            }
            displayEmployeeModal(sameEmployee);
        } 
    }
});

/**
 * Formats user phone number
 * @param {string} phoneString - user's cell
 * @returns formated phone number (xxx) xxx-xxxx
 */
function formatCell (phoneString) {
    const cleaned = ('' + phoneString).replace(/\D/g, '');
    if(cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
    }   
}

/**
 * Formats user's date of birth
 * @param {string} dob - user's date of birth details
 * @returns formated birthdate MM/DD/YYYY
 */
function formatDOB (dob) {
    const cleaned = ('' + dob).replace(/\D/g, '');
    const date = cleaned.substring(0,8);
    return date.replace(/(\d{4})(\d{2})(\d{2})/, "$2/$3/$1");
}

/**
 * Implements the search functionality
 */
const searchHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`;
search.insertAdjacentHTML('beforeend', searchHTML);

search.addEventListener('keyup', e => {
    let matchingEmployees = [];
    let currentValue = e.target.value.toLowerCase();
    let employees = document.querySelectorAll('h3.card-name');
    
    employeeCards.forEach(employee => {
        const name = `${employee.name.first} ${employee.name.last}`;
        if(name.includes(currentValue)) {
            matchingEmployees.push(employee);
        }
    });
    if (currentValue.length === 0) {
        gallery.innerHTML = '';
        displayEmployees(employeeCards);
    } else if (currentValue.length !== 0 && matchingEmployees.length !== 0) {
        gallery.innerHTML = '';
        displayEmployees(matchingEmployees);
    } else if(currentValue.length !== 0 && matchingEmployees.length === 0) {
        const html = '<h3>Sorry, No Results found</h3>';
        gallery.innerHTML = html;
    } 
});

/**
 * Display employee cards
 * @param {array} data - cards to display on the page
 */
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

