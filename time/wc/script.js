const defaultTimeElement = document.getElementById("default-time");
const defaultDayDateElement = document.getElementById("default-day-date");
const locationElement = document.getElementById("location");
const resultTimeElement = document.getElementById("result-time");
const resultDayDateElement = document.getElementById("result-day-date");
const timezoneSelect = document.getElementById("timezone-select");
const searchButton = document.getElementById("search-btn");

// Update IST time as default
function updateDefaultTime() {
    const istDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const date = new Date(istDate);
    const time = date.toLocaleTimeString();
    const dayDate = date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    defaultTimeElement.textContent = time;
    defaultDayDateElement.textContent = dayDate;
}

// Update the selected time zone time
function updateSelectedTime() {
    const selectedTimeZone = timezoneSelect.value;
    const date = new Date();
    const time = date.toLocaleTimeString("en-US", { timeZone: selectedTimeZone });
    const dayDate = date.toLocaleDateString("en-US", {
        timeZone: selectedTimeZone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    locationElement.textContent = `Time Zone: ${timezoneSelect.options[timezoneSelect.selectedIndex].text}`;
    resultTimeElement.textContent = time;
    resultDayDateElement.textContent = dayDate;
}

// Initialize IST time and set up event listener
setInterval(updateDefaultTime, 1000);
updateDefaultTime();

searchButton.addEventListener("click", updateSelectedTime);

