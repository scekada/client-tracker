document.addEventListener("DOMContentLoaded",() => {
    let clients = JSON.parse(localStorage.getItem("clients")) || [];


    let clientCounts = {};
    clients.forEach(client => {
        let date = new Date(client.timestamp);
        let monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        clientCounts[monthYear] = (clientCounts[monthYear] || 0 ) + 1;
    });

    const clientsChart = new Chart(document.getElementById("clientsChart"), {
        type: "bar",
        data: {
            labels: Object.keys(clientCounts),
            datasets: [{
                label: "Clients Added",
                data: Object.values(clientCounts),
                backgroundColor: "rgba(10,100,50,0.6)"
            }]
        }
    });


    let incomeCounts = {};
    clients.forEach(client => {
        if (client.tasks ) {
            client.tasks.forEach(task => {
                if ( task.paymentStatus === "paid" && task.paymentDate) {
                let date = new Date(task.paymentDate);
                let monthYear = `${date.getMonth() + 1 }/${date.getFullYear()}`;
                incomeCounts[monthYear] = (incomeCounts[monthYear] || 0) + Number(task.payment || 0);
                }
            });
        }
    });

    const incomeChart = new Chart(document.getElementById("incomeChart"), {
        type: "bar",
        data: {
            labels: Object.keys(incomeCounts),
            datasets: [{
                label: "Income ($)",
                data: Object.values(incomeCounts),
                borderColor: "green",
                backgroundColor: "rgba(10,100,50,0.6)",
                fill: true
            }]
        }
    });


    let progressData = {};
    let progressCounts = {};

    clients.forEach(client => {
        if(client.tasks) {
            client.tasks.forEach(task => {
                let date = new Date(task.timeStamp);
                let monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
                progressData[monthYear] = (progressData[monthYear] || 0) + Number(task.progress || 0 );
                progressCounts[monthYear] = (progressCounts[monthYear] || 0 ) + 1;
            });
        }
    });

    let avgProgress = {};
    for ( let key in progressData) {
        avgProgress[key] = Math.round(progressData[key] / progressCounts[key]);
    }

    const progressChart = new Chart(document.getElementById("progressChart"), {
        type: "bar",
        data: {
            labels: Object.keys(avgProgress),
            datasets: [{
                label: "Average Progress (%)",
                data: Object.values(avgProgress),
                backgroundColor: "rgba(10,100,50,0.6)"
            }]
        }
    });

});
