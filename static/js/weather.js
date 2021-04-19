



d3.selectAll("#storm").on("change", handler);

function handler() {

    
    const data = d3.select("#storm").property("value")
    const delay = []
    console.log(data)
    
    
    
    if (data === "0-60") {
        delay.push("607")
    }
    else if (data === "61-120") {
        delay.push("1476")
    }
    else if (data === "121-180") {
        delay.push("1471")
    }
    else if (data === "181-240") {
        delay.push("1343")
    }
    else if (data === "241-300") {
        delay.push("1353")
    }
    else if (data === "301-360") {
        delay.push("1236")
    }
    else if (data === "361-420") {
        delay.push("No Delay")
    }
    else if (data === "421-480") {
        delay.push("1457")
    }
    else if (data === "481-540") {
        delay.push("1464")
    }
    else if (data === "541-600") {
        delay.push("No Delay")
    }
    else if (data === "601-660") {
        delay.push("1512")
    }
    else if (data === "661-720") {
        delay.push("1633")
    }
    else if (data === "721-780") {
        delay.push("No Delay")
    }
    else if (data === "781-840") {
        delay.push("1808")
    }
    else if (data === "841-900") {
        delay.push("1678")
    }
    else if (data === "901-960") {
        delay.push("1274")
    }
    else if (data === "961-1020") {
        delay.push("No Delay")
    }
    else if (data === "1021-1080") {
        delay.push("No Delay")
    }
    else if (data === "1081-1140") {
        delay.push("No Delay")
    }
    else if (data === "1141-1200") {
        delay.push("No Delay")
    }
    else if (data === "1201-1260") {
        delay.push("No Delay")
    }
    else 
        delay.push("1745")
    
    
    console.log(delay)

    const display = d3.select("#delay");
    display.html("")
    display.append("h6").text(`Your predicted delay will be: ${delay}.`);

}

