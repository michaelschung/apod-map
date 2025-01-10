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
            - date: date of the photo/video
            - location: location where photo/video was taken
            - coords: coordinates of the location in the format "lat,long"
            - url: URL to actual photo/video
            - thumb: URL to thumbnail of photo/video
        If the original "media_type" is "video", then use the "thumbnail_url"
        for "thumb" in your output. If the original "media_type" is "image",
        then leave out the "thumb" attribute entirely.
        The "location" is a little tricky. Here's an ordered list of steps
        to break that down. Treat these steps as a series of "if-elif-else"
        statements - in other words, once one applies to a given object,
        then you do not need to continue checking; move on to the next
        object.
            1. If there is no "copyright" attribute, then this is an official
            NASA image, taken from space. Please list the location simply as
            "Space" and leave out the "coords" attribute entirely.
            2. If there is a "copyright" attribute, and the "explanation"
            blurb mentions where the photo was taken, then format the
            "location" and "coords". If the location is not very specific -
            a.k.a. an entire country - then give an approximate coordinates
            anyway.
            3. If there is a "copyright" attribute, then the "copyright"
            value may include important information, such as an observatory.
            If there's an observatory mentioned, then list it as the location
            and do a web search for the observatory's coordinates.
            4. If there is a "copyright" attribute with the name of the
            photographer, and the "explanation" blurb does not mention where
            the photo was taken, then do a web search for "[photographer]
            astrophotographer location", and find the location and coordinate
            information that way.
            5. If all of the above fail, then simply list the location as
            "Unknown" and ignore the coordinates.
        Please note that as long as there is a "copyright" attribute, you
        must not list "Space" as the location. If there is no "copyright"
        attribute, you must list "Space" as the location.
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