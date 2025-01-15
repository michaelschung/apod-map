export async function getFromDB(year, month) {
    return await fetch("/api/mongo/get-month", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "year": year,
            "month": month
        })
    })
        .then((response) => response.ok ? response.json() : null)
        .then((data) => data)
        .catch((error) => console.error(error));
}

export async function writeToDB(year, month, data) {
    return fetch("/api/mongo/add-month", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "year": year,
            "month": month,
            "data": data
        })
    })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
}

// Fetches OpenAI completion from backend, using provided prompt
async function openaiReqWithPrompt(sysPrompt, apodData) {
    return await fetch("/api/openai/completion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify([
            {"role": "system", "content": sysPrompt},
            {"role": "user", "content": apodData}
        ]),
    })
        .then((response) => response.json())
        .then((data) => JSON.parse(data))
        .catch((error) => console.error(error));
}

/*
Note to self:
- Every single item will have (date, location, url)
- Images taken from earth will also have (coords)
- Videos will also have (thumb)
*/
export async function openaiReq(apodData) {
    const sysPrompt = `
        You are about to receive a JSON array containing data from NASA's
        Astronomy Picture of the Day archive, covering a range of dates.
        Please extract the following information from each object in the
        array, and return the collated result as a single raw JSON blob. Do
        not include markdown formatting or any other formatting.
            - copyright: credit for the photo
            - date: date of the photo/video
            - location: location from which the photo/video was taken
            - url: URL to actual photo/video
            - thumb: URL to thumbnail of photo/video
        If the original "media_type" is "video", then use the "thumbnail_url"
        for "thumb" in your output. If the original "media_type" is "image",
        then leave out the "thumb" attribute entirely.
        The "location" is a little tricky. Here's how to break that down.
            1. If the object has no "copyright" attribute, then this is an
            official NASA image, taken from space. Please list the location
            simply as "Space", and ignore "copyright" in the output.
            2. If there is a "copyright" attribute, then this photo was NOT
            taken from space. Here's what to check next:
                2a. If the "explanation" blurb mentions where the photo was
                taken from, then use that as the "location", even if it's not
                very specific (i.e., an entire country).
                2b. If the "explanation" blurb does not mention where the
                photo was taken from, then list the location as "Unknown".
            Note: The location should never be reported as "Space" if the
            original object has a "copyright" attribute.
        Once you have determined a "location", then add one more attribute:
            - coords: latitude and longitude of the location from which the
            photo/video was taken, in the format "latitude,longitude"
        Here is a bit of extra guidance for how to get the "coords":
            1. If the "location" attribute is a specific place on Earth, then
            your job is simple: just give the latitude and longitude of that
            location, using a web search if necessary. It's okay to use a
            single set of coordinates for an entire country or city.
            2. If the "location" attribute is "Space", then leave out the
            "coords" attribute entirely.
            3. If the "location" attribute is "Unknown", then take a look at
            the "copyright" attribute:
                3a. If the "copyright" attribute contains the name of an
                observatory, then use the coordinates of that observatory.
                3b. If the "copyright" attribute contains the name of the
                photographer, then use a web search to find the coordinates
                of where that photographer is based.
            If all of the above fails, then leave out the "coords" attribute.
    `
    return openaiReqWithPrompt(sysPrompt, JSON.stringify(apodData))
        .then((data) => data);
}

// Fetches APOD data from backend, optionally filtered by date range
export async function apodReq(startDate=null, endDate=null) {
    const url = new URL("/api/apod", window.location.origin);
    if (startDate) url.searchParams.append("start_date", startDate);
    if (endDate) url.searchParams.append("end_date", endDate);

    return fetch(url, { method: "GET" })
        .then(response => response.json())
        .then((data) => data)
        .catch(error => console.error("Error:", error));
}