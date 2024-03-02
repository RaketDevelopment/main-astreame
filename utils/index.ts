export const validateEmail = (email: string) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const formatDate = (dateInput: Date | string): string => {
  // Ensure the input is converted to a Date object
  const date = new Date(dateInput);

  // Define options for date formatting
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  // Return the formatted date string
  return date.toLocaleDateString('en-US', options);
}

export const formatTimestamp = (timestampStr: string): string => {
  // Convert the string to a Date object
  const date = new Date(timestampStr);

  // Options to control the output format
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long', // e.g., "Monday"
    year: 'numeric', // e.g., "2024"
    month: 'long', // e.g., "March"
    day: 'numeric', // e.g., "02"
    hour: '2-digit', // e.g., "01"
    minute: '2-digit', // e.g., "33"
    second: '2-digit', // e.g., "00"
    hour12: true // Use AM/PM
  };

  // Format the date to a more human-readable form
  return date.toLocaleString('en-US', options);
}

// Example usage:
const timestampStr = "2024-03-02T13:33:00.495Z";
const humanReadable = formatTimestamp(timestampStr);
console.log(humanReadable);
