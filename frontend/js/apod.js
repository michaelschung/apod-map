export function fetchAPOD(startDate=null, endDate=null) {
    const url = new URL("/api/apod", window.location.origin);
    if (startDate) url.searchParams.append("start_date", startDate);
    if (endDate) url.searchParams.append("end_date", endDate);

    fetch(url, { method: "GET" })
        .then(response => response.json())
        .then((data) => console.log(data))
        .catch(error => console.error("Error:", error));
}