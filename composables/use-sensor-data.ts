import { ref } from 'vue';
import type { Ref } from 'vue';
import { ref as dbRef, onValue, DataSnapshot, Database } from 'firebase/database';

interface SensorData {
  currentHumidity: number;
  currentTemperature: number;
  sensorBelowStatus: boolean;
  sensorAboveStatus: boolean;
}

export function useSensorData(): { message: Ref<string> } {
  const message = ref<string>('');

  // Initialize Firebase Database
  const nuxtApp = useNuxtApp();
  const database = nuxtApp.$firebaseDatabase;

  // Define a function to update the message based on sensor data
  function updateMessage(data: SensorData): void {
    const {
      currentHumidity,
      currentTemperature,
      sensorBelowStatus,
      sensorAboveStatus,
    } = data;

    if (currentHumidity < 40 && !sensorBelowStatus) {
      message.value = 'Humidity is on low levels, pumping will start';
    } else if (currentTemperature >= 36 && !sensorBelowStatus) {
      message.value = 'Temperature is high, pumping will start';
    } else if (currentHumidity >= 40 && currentTemperature < 36 && sensorBelowStatus) {
      message.value = 'Humidity/Temperature conditions are met, pumping has stopped';
    } else if (currentHumidity >= 40 && currentTemperature < 36 && !sensorBelowStatus) {
      message.value = 'Water level is lower than threshold (15 cm below the surface), pumping has started';
    } else if (currentHumidity >= 40 && currentTemperature < 36 && sensorAboveStatus) {
      message.value = 'Conditions are met, pumping has stopped';
    } else {
      message.value = ''; // Default message or handle other cases as needed
    }
  }

  // Set up Firebase listeners for each sensor value
  // const sensorPaths: string[] = ['currentTemperature', 'currentHumidity', 'sensorBelowStatus', 'sensorAboveStatus', 'relayStatus'];
  // sensorPaths.forEach((path) => {
  //   const sensorRef = dbRef(database, path);
  //   onValue(sensorRef, (snapshot: DataSnapshot) => {
  //     const data = snapshot.val() as SensorData;
  //     // Assuming all sensor data are stored in the same structure
  //     console.log(data);
  //     updateMessage(data);
  //   });
  // });

  // const sensorRef = dbRef(database, 'currentHumidity');
  // onValue(sensorRef, (snapshot: DataSnapshot) => {
  //   const data = snapshot.val() as SensorData;
  //   // Assuming all sensor data are stored in the same structure
  //   console.log(data);
  //   message.value = 'test';
  // });

  const sensorRef = dbRef(database as Database, 'currentTemperature');
  onValue(sensorRef, (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    console.log(data);
  });

  return {
    message,
  };
}
