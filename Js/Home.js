const streetSelect= document.getElementById('choose-street');
const bedroomSelect= document.getElementById('choose-bedrooms');
const bathroomSelect= document.getElementById('choose-bathrooms');
const form=document.querySelector('form');

const resultCount= document.getElementById('result-count');
const output= document.getElementById('output');


let houses;

function fetchHouseData(){
  fetch("https://mdn.github.io/shared-assets/misc/houses.json")
  .then((response) => {
    if(!response.ok){
      throw new Error(`Http Error: ${response.status}`)
    }

    return response.json()
  })

  .then((json) => {
    houses=json;

    initializeForm();
  })
}

function initializeForm() {
  const streetOptions = [];

  for (let house of houses){
    if (!streetOptions.includes(house.street)){
      streetOptions.push(house.street);
      const option = document.createElement('option');
      option.textContent = house.street;
      streetSelect.appendChild(option);
    }
  }
  
  const largestBedrooms = Math.max(...houses.map(house => house.bedrooms));
 
    let i = 1;
    while (i <= largestBedrooms) {
        const option = document.createElement('option');
        option.textContent = i;
        bedroomSelect.appendChild(option);
        i++;
    }

  const largestBathrooms = Math.max(...houses.map(house => house.bathrooms));
  let j = 1;
    while (j <= largestBathrooms) {
        const option = document.createElement('option');
        option.textContent = j;
        bathroomSelect.appendChild(option);
        j++;
    }
  /*const largestBedrooms= houses.reduce((largest,house)=> (house.bedrooms>largest ? house.bedrooms:largest));
  let i =0;
  while(i<largestBedrooms){{
    bedroomSelect.appendChild(document.createElement('option').textContent=i);
    i++;
  }
  }
  const largestBathrooms= houses.reduce((largest,house)=> (house.bathrooms>largest ? house.bathrooms:largest));
  let j =0;
  while(j<largestBathrooms){{
    bathroomSelect.appendChild(document.createElement('option').textContent=j);
    j++;
  }
  }*/
}
function renderHouses(e) {
  // Stop the form submitting
  e.preventDefault();

  const filteredHouses = houses.filter((house) => {
    const test = (streetSelect.value==="" || house.street === streetSelect.value) &&
                 (bedroomSelect.value==="" || String(house.bedrooms) === bedroomSelect.value) &&
                 (bathroomSelect.value==="" || String(house.bathrooms) === bathroomSelect.value);
    return test;
  });

  resultCount.textContent =` Results found: ${filteredHouses.length}`;


  output.innerHTML = "";

  function renderHouse(house) {
    let totalArea=0;

    let keys= Object.keys(house.room_sizes);
    for (let key of keys){
        totalArea+=house.room_sizes[key];
    }



    const articleElem = document.createElement("article");
    articleElem.appendChild(document.createElement("h2")).textContent = `${house.house_number} ${house.street}`;
    const listElem =document.createElement("ul");
    const bedli =document.createElement("li");
    bedli.textContent= `🛏️Bedrooms: ${house.bedrooms}`;
    articleElem.appendChild(listElem);
    listElem.appendChild(bedli);
    const bathli = document.createElement("li");
    bathli.textContent = `🛁Bathrooms: ${house.bathrooms}`;
    listElem.appendChild(bathli);
    const areali = document.createElement("li");
    areali.textContent = `📏Total area: ${totalArea} m²`;
    listElem.appendChild(areali);
    const priceLi = document.createElement("li");
    priceLi.textContent = `💰Price: ${house.price.toLocaleString("en-US", {style: "currency", currency: "USD"})}`;
    listElem.appendChild(priceLi);
    articleElem.appendChild(listElem);
    output.appendChild(articleElem);

    
    
}
    for (let house of filteredHouses){
            renderHouse(house);
        }
}


    
    
form.addEventListener("submit", renderHouses);

fetchHouseData();
