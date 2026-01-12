import { collection, addDoc, doc, getDoc, updateDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/config';
import { confirmationEmail } from '@/lib/service/workshopService';


export async function newBooking(bookingData) {
  try {
    // Validate required fields
    const requiredFields = ['workshopId', 'name', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => {
      const value = bookingData[field];
      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      throw new Error('Invalid email format');
    }

    // Check if workshop exists
    const workshopDocRef = doc(db, 'workshops', bookingData.workshopId);
    const workshopDocSnap = await getDoc(workshopDocRef);

    if (!workshopDocSnap.exists()) {
      throw new Error('Workshop not found.');
    }

    const workshop = workshopDocSnap.data();
    
    // Check if workshop is available for booking
    if (workshop.status !== 'PUBLISHED') {
      throw new Error('This workshop is not available for booking.');
    }

    // Check if workshop has available seats
    const availableSeats = workshop.capacity - (workshop.bookedSeats || 0);
    if (availableSeats <= 0) {
      throw new Error('Workshop is fully booked.');
    }

    // Prepare booking document
    const now = new Date().toISOString();
    const booking = {
      workshopId: bookingData.workshopId,
      workshopTitle: workshop.title, // Store workshop title for easier queries
      name: bookingData.name.trim(),
      email: bookingData.email.trim().toLowerCase(),
      phone: bookingData.phone.trim(),
      status: 'pending', // Booking status: pending, confirmed, cancelled
      createdAt: now,
      updatedAt: now,
    };

    // Add booking to Firestore
    const bookingsCollection = collection(db, 'bookings');
    const docRef = await addDoc(bookingsCollection, booking);

    // Update workshop's bookedSeats count
    // Note: This is a simple increment. In production, you might want to use a transaction
    // to ensure atomicity when multiple bookings happen simultaneously
    await updateDoc(workshopDocRef, {
      bookedSeats: (workshop.bookedSeats || 0) + 1,
      updatedAt: now,
    });

    // Send confirmation email (don't wait for it to complete)
    confirmationEmail({
      toEmail: booking.email,
      toName: booking.name,
      workshopTitle: workshop.title,
      workshopDate: workshop.date,
      workshopTime: workshop.startTime + (workshop.endTime ? ` - ${workshop.endTime}` : ''),
      workshopPrice: workshop.price,
    }).catch(error => {
      // Email sending errors are logged but don't affect the booking
      console.error('Email sending failed:', error);
    });

    // Return the created booking with id
    return {
      id: docRef.id,
      ...booking,
    };
  } catch (error) {
    // Re-throw validation errors
    if (error.message.includes('Missing required fields') ||
        error.message.includes('Invalid email format') ||
        error.message.includes('Workshop not found') ||
        error.message.includes('not available for booking') ||
        error.message.includes('fully booked')) {
      throw error;
    }
    throw new Error(`Failed to create booking: ${error.message}`);
  }
}

export async function getBookings() {
  try {
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to view bookings');
    }

    // Check if user has admin role
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error('User not found. Access denied.');
    }

    const userData = userDocSnap.data();
    const userRole = userData.role;

    if (userRole !== 'admin') {
      throw new Error('Access denied. Admin role required to view bookings.');
    }

    // Get all bookings from Firestore
    const bookingsCollection = collection(db, 'bookings');
    const bookingsSnapshot = await getDocs(bookingsCollection);

    // Map the documents to include id
    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return bookings;
  } catch (error) {
    // Re-throw validation errors
    if (error.message.includes('Access denied') || 
        error.message.includes('User must be authenticated')) {
      throw error;
    }
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }
}
