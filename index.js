const menuItems = document.querySelectorAll(".item");
const tables = document.querySelectorAll(".table");



let selectedTableId; 


for (const item of menuItems) {
  item.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", item.querySelector(".itemname").id);
  });
}

for (const table of tables) {
  table.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  table.addEventListener("drop", (event) => {
    event.preventDefault();
    console.log("triggered")
    const itemId = event.dataTransfer.getData("text/plain");
   
    const itemCost = parseInt(
      document.getElementById(itemId).nextElementSibling.textContent.slice(3)
    );
    addItems(table, itemId, itemCost);
  });

  table.addEventListener("click", () => {
    const countElem = document.getElementById(`${table.id}-count`);
    const count = parseInt(countElem.textContent);
    const costElem = document.getElementById(`${table.id}-cost`);
    const cost = parseInt(costElem.textContent);
    const popup = document.getElementById("table-popup");
    const popupTitle = document.querySelector(".popup-title");
    const popupMessage = document.querySelector(".popup-message");
    popupTitle.textContent = `Table-${table.id.slice(5)} | Order Details`;

    const rows = document.querySelectorAll(".billsummary tr");
    let counter = 1;
    rows.forEach(row => {
      if ((row.getAttribute("tableno") === table.id) ){
        row.style.display = "table-row";
        row.querySelector(".serial").innerHTML=`${counter}`;
        counter++;
      } 
      else {
        if(row.getAttribute("class")==="billheading"){
          row.style.display = "table-row";
        }
        else{
        row.style.display = "none";
        }
      }
    });
    popupMessage.textContent = `This table has ${count} items, costing Rs.${cost}`;
    selectedTableId = table.id;
    popup.style.display = "block";
  });
}

function addItems(table, itemId, itemCost) {
  const countElem = document.getElementById(`${table.id}-count`);
  const count = parseInt(countElem.textContent);
  countElem.textContent = count + 1;

  const costElem = document.getElementById(`${table.id}-cost`);
  const cost = parseInt(costElem.textContent);
  costElem.textContent = cost + itemCost;

  const addeditem = document.querySelector(".billsummary");
  let rowToUpdate = null;

  for (let i = 1; i < addeditem.rows.length; i++) {
    const row = addeditem.rows[i];
    if (
      row.querySelector("[type='name']").textContent ===
        document.getElementById(itemId).textContent &&
      row.getAttribute("tableno") == table.id
    ) {
      rowToUpdate = row;
      break;
    }
  }

  if (rowToUpdate) {
    const noOfServingsCell = rowToUpdate.querySelector("[type='no_servings']");
    const noOfServings = parseInt(noOfServingsCell.textContent) + 1;
    noOfServingsCell.textContent = noOfServings;
  } else {
    const childrow = document.createElement("tr");
    addeditem.appendChild(childrow);
    childrow.setAttribute("tableno", table.id);






    const serial = document.createElement("td");
    serial.setAttribute("class", "serial");
    childrow.appendChild(serial).innerHTML="hello"




    const name = document.getElementById(itemId).textContent;
    const childcolumn1 = document.createElement("td");
    childcolumn1.setAttribute("type", "name");
    childrow.appendChild(childcolumn1).innerHTML = name;


    const childcolumn2 = document.createElement("td");
    childcolumn2.setAttribute("type", "price");
    childrow.appendChild(childcolumn2).innerHTML = itemCost;

    const no_of_servings = 1;
    const childcolumn3 = document.createElement("td");
    childcolumn3.setAttribute("type", "no_servings");
    childrow.appendChild(childcolumn3).innerHTML = no_of_servings;

    const plusButton = document.createElement("button");
    plusButton.innerHTML = "+";
    plusButton.addEventListener("click", () => {
      const noOfServingsCell = childrow.querySelector("[type='no_servings']");
      const noOfServings = parseInt(noOfServingsCell.textContent) + 1;
      noOfServingsCell.textContent = noOfServings;

      const countElem = document.getElementById(`${table.id}-count`);
      const count = parseInt(countElem.textContent);
      countElem.textContent = count + 1;

      const costElem = document.getElementById(`${table.id}-cost`);
      const cost = parseInt(costElem.textContent);
      costElem.textContent = cost + itemCost;

      const popupMessage = document.querySelector(".popup-message");
      popupMessage.textContent = `This table has ${
        count + 1
      } items, costing Rs.${cost + itemCost}`;
    });

    const minusButton = document.createElement("button");
    minusButton.innerHTML = "-";
    minusButton.addEventListener("click", () => {
      const noOfServingsCell = childrow.querySelector("[type='no_servings']");

      if (parseInt(noOfServingsCell.textContent) > 0) {
        const noOfServings = parseInt(noOfServingsCell.textContent) - 1;
        noOfServingsCell.textContent = noOfServings;

        const countElem = document.getElementById(`${table.id}-count`);
        const count = parseInt(countElem.textContent);
        countElem.textContent = count - 1;

        const costElem = document.getElementById(`${table.id}-cost`);
        const cost = parseInt(costElem.textContent);
        costElem.textContent = cost - itemCost;

        const popupMessage = document.querySelector(".popup-message");
        popupMessage.textContent = `This table has ${
          count - 1
        } items, costing Rs.${cost - itemCost}`;
      }
    });
    const removeButton = document.createElement("button");
    removeButton.innerHTML = "<i class='fa fa-trash-o'></i>";
    removeButton.addEventListener("click", () => {
      childrow.remove()

      const noOfServingsCell = childrow.querySelector("[type='no_servings']");
      const noOfServings = parseInt(noOfServingsCell.textContent)

      const countElem = document.getElementById(`${table.id}-count`);
      const count = parseInt(countElem.textContent);
      countElem.textContent = count - noOfServings;

      const costElem = document.getElementById(`${table.id}-cost`);
      const cost = parseInt(costElem.textContent);
      costElem.textContent = cost - itemCost*noOfServings;


      const popupMessage = document.querySelector(".popup-message");
      popupMessage.textContent = `This table has ${
        count - noOfServings
      } items, costing Rs.${cost - itemCost*noOfServings}`;





    });
    

    const childcolumn4 = document.createElement("td");
    childcolumn4.setAttribute("type", "buttons");
    childrow.appendChild(childcolumn4);
    childcolumn4.appendChild(plusButton);
    childcolumn4.appendChild(minusButton);
    childcolumn4.appendChild(removeButton);
  }
}

function closeTablePopup() {
  const popup = document.getElementById("table-popup");
  popup.style.display = "none";
}

const tableSearchInput = document.querySelector(".tables .table-search input");
const tableSearchBtn = document.querySelector(".tables .table-search button");

const menuSearchInput = document.querySelector(".menu .menu-search input");
const menuSearchBtn = document.querySelector(".menu .menu-search button");

tableSearchBtn.addEventListener("click", function () {
  searchTable();
});
tableSearchInput.addEventListener("keyup", function () {
  searchTable();
});

menuSearchBtn.addEventListener("click", function () {
  searchMenu();
});
menuSearchInput.addEventListener("keyup", function () {
  searchMenu();
});






function searchTable() {
  const searchTerm = tableSearchInput.value.toLowerCase();
  const tables = document.querySelectorAll(".table");

  tables.forEach(function (table) {
    const tableName = table
      .querySelector(".itemname")
      .textContent.toLowerCase();
    if (tableName.includes(searchTerm)) {
      table.style.display = "block";
    } else {
      table.style.display = "none";
    }
  });
}
function searchMenu() {
  const input = document.querySelector("#menu-search input");
  const filter = input.value.toUpperCase();
  const items = document.querySelectorAll(".item");

  items.forEach((item) => {
    const foodtype = item.querySelector(".itemname").getAttribute("foodtype");
    const name = item.querySelector(".itemname").textContent.toUpperCase();
    if (name.includes(filter) || foodtype.toUpperCase() === filter) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}




function sortMenu() {
  const items = Array.from(document.querySelectorAll(".item"));
  items.sort((a, b) =>
    a
      .querySelector(".itemname")
      .textContent.localeCompare(b.querySelector(".itemname").textContent)
  );
  const menu = document.querySelector(".menusort");
  menu.innerHTML = "";
  items.forEach((item) => menu.appendChild(item));
  
}

function sortcostMenu() {
  const menuSort = document.querySelector('.menusort');
  const items = document.querySelectorAll('.item');
  const sortedItems = Array.from(items).sort((a, b) => {
    const priceA = parseFloat(a.querySelector('p').textContent.slice(3));
    const priceB = parseFloat(b.querySelector('p').textContent.slice(3));
    return priceA - priceB;
  });
  sortedItems.forEach(item => {
    menuSort.appendChild(item);
  });
  
}


const generateBillButton = document.querySelector("#table-popup button");
generateBillButton.addEventListener("click", generateBill);
function generateBill() {
const table = document.querySelector('.billsummary');
req=selectedTableId;
const rowsToRemove = table.querySelectorAll(`[tableno="${req}"]`);
rowsToRemove.forEach(row => {
  row.remove();
});

const countElem = document.getElementById(`${req}-count`);
countElem.textContent = 0
count=0


const costElem = document.getElementById(`${req}-cost`);
cost=0
costElem.textContent = 0

const popupMessage = document.querySelector(".popup-message");
popupMessage.textContent = `This table has ${count} items, costing Rs.${cost}`;
}

