

let myLeads = []

let errorMessage = null;
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const leadsFromLocalStorage = JSON.parse( localStorage.getItem("myLeads") )
const tabBtn = document.getElementById("tab-btn")

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

tabBtn.addEventListener("click", function(){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        myLeads.push(tabs[0].url)
        localStorage.setItem("myLeads", JSON.stringify(myLeads) )
        render(myLeads)
    })
})

function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems
}

deleteBtn.addEventListener("click", function() {
    localStorage.clear()
    myLeads = []
    render(myLeads)
})

inputBtn.addEventListener("click", function() {
    myLeads.push(inputEl.value)
    inputEl.value = ""
    localStorage.setItem("myLeads", JSON.stringify(myLeads) )
    render(myLeads)
    errorMessage = ""
})


// Sript to add Download CSV button


function downloadCSV() {
  if (myLeads.length === 0) {
    if (!errorMessage) {
      errorMessage = document.createElement("p");
      errorMessage.textContent = "No links found. Please save some links before downloading.";
      document.body.appendChild(errorMessage);
    }
    return;
  }

  if (errorMessage) {
    document.body.removeChild(errorMessage);
    errorMessage = null;
  }

  const csvContent = "data:text/csv;charset=utf-8," + myLeads.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "leads.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const downloadBtn = document.createElement("button");
downloadBtn.textContent = "DOWNLOAD AS CSV";
downloadBtn.addEventListener("click", downloadCSV);
document.body.appendChild(downloadBtn);



  
  
  
  

