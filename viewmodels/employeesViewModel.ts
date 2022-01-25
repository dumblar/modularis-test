const table: HTMLElement | any = document.querySelector("#lstEmployees tbody")
const divEmployee: HTMLElement | any = document.getElementById("lstEmployees")
const divNewEmployee: HTMLElement | any = document.getElementById("newEmployee")
const divTryDeleteEmployee: HTMLElement | any = document.getElementById("tryDelete")
const txFirstName: HTMLElement | any = document.getElementById("firstName")
const txLastName: HTMLElement | any = document.getElementById("lastName")
const txId: HTMLElement | any = document.getElementById("id")
const ckActive: HTMLElement | any = document.getElementById("active")


let requestHeaders: any = { 'APIKey': 'ieQqpVfPKuzvr1Pqjc4LRK7drXo5te9pIsoVs8', "CustomerID": "C93F949C-41B8-4C9E-95AA-B030B31F6F3F" };
let url: string = 'https://gateway.modularis.com/HRDemo/RESTActivityWebService/HRDemo.Example/Employees';
var lstEmployees: Array<any>;
var selectedEmployee: any = null;

const loadEmployees = async (): Promise<void> => {

    const response = await fetch(url , {
        method: 'GET',
        headers: requestHeaders
    });

    let allEmployes = await response.json();

    lstEmployees = allEmployes;

    let tableHTML = allEmployes.map((row, index) => {
        let active = row.Status === 0 ? "INACTIVE" : "ACTIVE";
        return `<tr>
            <td class="card--id"><span>${row.EmployeeNo}</span></td>
            <td class="card--id"><span>${row.FirstName}</span></td>
            <td class="card--id"><span>${row.LastName}</span></td>
            <td class="card--id"><span class="status ${active.toLowerCase()}">${active}</span></td>
            <td class="card--id"><i class="far fa-edit control" onclick="editEmployee(${index})"></i><i class="far fa-trash-alt control" onclick="tryDeleteEmployee(${index})"></i></td>
        </tr>`;
    });

    table.innerHTML = "<tbody>" + tableHTML.join('') + "</tbody>";
}

const saveEmployee = async () => {

    let employee = {
        "PersonID": selectedEmployee === null ? getGuid() : selectedEmployee.PersonID,
        "FirstName": txFirstName.value,
        "LastName": txLastName.value,
        "LastUpdatedBy": "admin",
        "LastUpdatedDate": new Date(),
        "SSN": Math.floor(Math.random() * 9999999),
        "EmployeeNo": txId.value,
        "EmploymentEndDate": null,
        "EmploymentStartDate": new Date(),
        "Status": ckActive.checked ? 1 : 0
    }

    console.log(employee);

    const response = await fetch(url , {
        method: selectedEmployee === null ? 'POST' : 'PUT',
        headers: requestHeaders,
        body: JSON.stringify(employee)
    }).then(data => {
        console.log(data);

        clearForm();

        newEmployee();
        loadEmployees();
    }).catch(data => {
        console.log(data);
        alert("Error");
    });

}

const newEmployee = () => {
    divNewEmployee.classList.toggle("visible");
}

const editEmployee = (position: number) => {
    selectedEmployee = lstEmployees[position];
    txFirstName.value = selectedEmployee.FirstName;
    txLastName.value = selectedEmployee.LastName;
    txId.value = selectedEmployee.EmployeeNo;
    ckActive.checked = selectedEmployee.Status == 1 ? true : false;
    newEmployee();
}

const tryDeleteEmployee = (position: number) => {
    selectedEmployee = lstEmployees[position];
    divTryDeleteEmployee.classList.toggle("visible");
}

const cancelDeleteEmployee = () => {
    selectedEmployee = null;
    divTryDeleteEmployee.classList.toggle("visible");
}

const deleteEmployee = async () => {
    const response = await fetch(url + "(" + selectedEmployee.PersonID + ")" , {
        method: 'DELETE',
        headers: requestHeaders
    }).then(data => {
        console.log(data);
        cancelDeleteEmployee();
        loadEmployees();
    }).catch(data => {
        console.log(data);
        alert("Error");
    });
}

const clearForm = () => {
    txFirstName.value = "";
    txLastName.value = "";
    txId.value = "";
    ckActive.checked = "";
    selectedEmployee = null;
}

const getGuid = () => {
    var u = '', i = 0;
    while (i++ < 36) {
        var c = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'[i - 1], r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        u += (c == '-' || c == '4') ? c : v.toString(16)
    }
    return u;
}


loadEmployees();