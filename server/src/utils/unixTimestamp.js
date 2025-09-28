function getUnixTimestampForNextDay() {
  // Fetch the current date and time
  const currentDate = new Date();

  // Add one day (24 hours) to the current date
  currentDate.setDate(currentDate.getDate() + 1);

  // Convert to Unix timestamp (seconds)
  return Math.floor(currentDate.getTime() / 1000);
}

// Example usage:
const timestamp = getUnixTimestampForNextDay();
console.log("Unix timestamp for next day:", timestamp);

module.exports = getUnixTimestampForNextDay;
