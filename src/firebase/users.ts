import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Assuming you have your Firebase instance here
import type { DriverModel } from "../models/driver_model";

/**
 * Queries the 'users' collection for a driver with a specific plate number.
 * @param plateNumber The plate number to search for.
 * @returns A promise that resolves to a DriverModel, or null if no matching driver is found.
 */
export const getDriverByPlateNumber = async (
  plateNumber: string
): Promise<DriverModel | null> => {
  if (!plateNumber) {
    console.error("Plate number is required for the query.");
    return null;
  }

  try {
    // 1. Create a reference to the 'users' collection.
    const usersCollection = collection(db, "users");

    // 2. Build the query. We're looking for documents where the 'plateNumber' field
    // is exactly equal to the provided plateNumber string.
    const q = query(usersCollection, where("plateNumber", "==", plateNumber));

    // 3. Execute the query and get the documents.
    const querySnapshot = await getDocs(q);

    // 4. Check if any documents were found.
    if (querySnapshot.empty) {
      console.log("No matching driver found with that plate number.");
      return null;
    }

    // 5. Get the first document from the result.
    const doc = querySnapshot.docs[0];
    const data = doc.data() as DriverModel;

    // 6. Map the Firestore document data to your DriverModel, including the document ID.
    const driver: DriverModel = {
      //   documentId: doc.id,
      ...data,
    };
    driver.documentId = doc.id;

    return driver;
  } catch (e) {
    console.error("Error getting driver by plate number: ", e);
    return null;
  }
};
