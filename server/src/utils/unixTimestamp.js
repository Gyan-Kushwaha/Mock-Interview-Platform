function getUnixTimestampForNextDay() {
 
const currentDate = new Date();

  currentDate.setDate(currentDate.getDate() + 1);

  return Math.floor(currentDate.getTime() / 1000);
}

const timestamp = getUnixTimestampForNextDay();
console.log("Unix timestamp for next day:", timestamp);

module.exports = getUnixTimestampForNextDay;
