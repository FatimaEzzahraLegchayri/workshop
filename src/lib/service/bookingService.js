import { collection, addDoc, doc, getDoc, updateDoc, 
  getDocs, runTransaction } from 'firebase/firestore';
import { auth, db } from '@/lib/config';
// import { confirmationEmail } from '@/lib/service/workshopService';
import { ensureAdmin } from '@/lib/helper';

const WORKSHOP_BOOKINGS_COLLECTION = 'workshopBookings';
const WORKSHOPS_COLLECTION = 'workshops';

export async function newBooking(bookingData) {
  try {
    const requiredFields = ['workshopId', 'name', 'phone'];
    const missingFields = requiredFields.filter(field => !bookingData[field]?.trim());

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    let formattedEmail = null;
    if (bookingData.email && bookingData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(bookingData.email)) {
        throw new Error('Invalid email format');
      }
      formattedEmail = bookingData.email.trim().toLowerCase();
    }

    const workshopDocRef = doc(db, WORKSHOPS_COLLECTION, bookingData.workshopId);
    const bookingsCollection = collection(db, WORKSHOP_BOOKINGS_COLLECTION);
    const now = new Date().toISOString();

    const finalBooking = await runTransaction(db, async (transaction) => {
      const workshopSnap = await transaction.get(workshopDocRef);

      if (!workshopSnap.exists()) {
        throw new Error('Workshop not found.');
      }

      const workshop = workshopSnap.data();

      if (workshop.status !== 'PUBLISHED') {
        throw new Error('This workshop is not available for booking.');
      }

      const currentBooked = workshop.bookedSeats || 0;
      if (currentBooked >= workshop.capacity) {
        throw new Error('Workshop is fully booked.');
      }

      const newBookingRef = doc(bookingsCollection); 
      const booking = {
        workshopId: bookingData.workshopId,
        workshopTitle: workshop.title,
        name: bookingData.name.trim(),
        email: formattedEmail,
        phone: bookingData.phone.trim(),
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      };

      transaction.set(newBookingRef, booking);
      transaction.update(workshopDocRef, {
        bookedSeats: currentBooked + 1,
        updatedAt: now,
      });

      return { id: newBookingRef.id, ...booking };
    });

   
    return finalBooking;

  } catch (error) {
    if (error.message.includes('Missing') || 
        error.message.includes('format') || 
        error.message.includes('not found') || 
        error.message.includes('available') || 
        error.message.includes('booked')) {
      throw error;
    }
    throw new Error(`Failed to create booking: ${error.message}`);
  }
}

export async function getBookings() {
  try {
    const user = await ensureAdmin();

    const bookingsCollection = collection(db, WORKSHOP_BOOKINGS_COLLECTION);
    const bookingsSnapshot = await getDocs(bookingsCollection);

    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return bookings;
  } catch (error) {
    if (error.message.includes('Access denied') || 
        error.message.includes('User must be authenticated')) {
      throw error;
    }
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }
}
 
export async function updateWorkshopBookingStatus(bookingId, newStatus) {
  const validStatuses = ['pending', 'confirmed', 'canceled'];
  
  if (!validStatuses.includes(newStatus)) {
    throw new Error("Invalid status. Use 'pending', 'confirmed', or 'canceled'.");
  }

  try {
    await runTransaction(db, async (transaction) => {
      const bookingRef = doc(db, WORKSHOP_BOOKINGS_COLLECTION, bookingId);
      const bookingSnap = await transaction.get(bookingRef);

      if (!bookingSnap.exists()) {
        throw new Error("Booking not found.");
      }

      const bookingData = bookingSnap.data();
      const oldStatus = bookingData.status;
      const workshopId = bookingData.workshopId;
      const workshopRef = doc(db, WORKSHOPS_COLLECTION, workshopId);
      const workshopSnap = await transaction.get(workshopRef);

      if (!workshopSnap.exists()) {
        throw new Error("Associated workshop not found.");
      }

      const workshopData = workshopSnap.data();
      let seatAdjustment = 0;

      if (newStatus === 'canceled' && oldStatus !== 'canceled') {
        seatAdjustment = -1;
      } 
      else if (oldStatus === 'canceled' && newStatus !== 'canceled') {
        seatAdjustment = 1;
      }

      transaction.update(bookingRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      if (seatAdjustment !== 0) {
        const newCount = (workshopData.bookedSeats || 0) + seatAdjustment;
        
        transaction.update(workshopRef, {
          bookedSeats: Math.max(0, newCount),
          updatedAt: new Date().toISOString()
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Status update transaction failed:", error);
    throw error;
  }
}
