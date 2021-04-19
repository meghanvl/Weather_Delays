



d3.selectAll("#storm").on("change", handler);

function handler() {

    
    const data = d3.select("#storm").property("value")
    const delay = []
    console.log(data)
    
    
    
    if (data === "0-60") {
        delay.push("607")
    }
    else if (data === "61-120") {
        delay.push("1,476")
    }
    else if (data === "121-180") {
        delay.push("1,471")
    }
    else if (data === "181-240") {
        delay.push("1,343")
    }
    else if (data === "241-300") {
        delay.push("1,353")
    }
    else if (data === "301-360") {
        delay.push("1,236")
    }
    else if (data === "361-420") {
        delay.push("No Delay")
    }
    else if (data === "421-480") {
        delay.push("1,457")
    }
    else if (data === "481-540") {
        delay.push("1,464")
    }
    else if (data === "541-600") {
        delay.push("No Delay")
    }
    else if (data === "601-660") {
        delay.push("1,512")
    }
    else if (data === "661-720") {
        delay.push("1,633")
    }
    else if (data === "721-780") {
        delay.push("No Delay")
    }
    else if (data === "781-840") {
        delay.push("1,808")
    }
    else if (data === "841-900") {
        delay.push("1,678")
    }
    else if (data === "901-960") {
        delay.push("1,274")
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
        delay.push("1,745")
    
    
    console.log(delay)

    const display = d3.select("#delay");
    display.html("")
    display.append("h6").text(`Airline predicted delay is: ${delay} minutes.`);

}

