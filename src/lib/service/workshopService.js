import { collection, addDoc, doc, getDoc, updateDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/config';
import { ensureAdmin } from '@/lib/helper';
import { cloudinaryConfig } from '@/lib/cloudinaryConfig';

const WORKSHOPS_COLLECTION = 'workshops';
 
export async function addWorkshop(workshopData) {
  try {
    const user = await ensureAdmin();
    const now = new Date().toISOString();

    let imageUrl = workshopData.image || null;

    if (workshopData.image instanceof File) {
      imageUrl = await cloudinaryConfig(workshopData.image, "workshops-covers");
    }

    const workshop = {
      title: workshopData.title,
      description: workshopData.description,
      date: workshopData.date,
      startTime: workshopData.startTime,
      endTime: workshopData.endTime,
      category: workshopData.category,
      capacity: Number(workshopData.capacity),
      bookedSeats: 0,
      price: Number(workshopData.price),
      status: workshopData.status || 'draft',
      image: imageUrl,
      createdAt: now,
      updatedAt: now,
    };

    const requiredFields = ['title', 'description', 'date', 'startTime', 'endTime', 'category', 'capacity', 'price'];
    const missingFields = requiredFields.filter(field => {
      const value = workshop[field];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const workshopsCollection = collection(db, WORKSHOPS_COLLECTION);
    const docRef = await addDoc(workshopsCollection, workshop);

    return {
      id: docRef.id,
      ...workshop,
    };
  } catch (error) {
    if (error.message.includes('Access denied') || 
        error.message.includes('User must be authenticated') ||
        error.message.includes('Missing required fields') ||
        error.message.includes('Cloudinary')) { 
      throw error;
    }
    throw new Error(`Failed to add workshop: ${error.message}`);
  }
}

export async function updateWorkshop(workshopId, updateData) {
  try {
    const user = await ensureAdmin();
    if (!user) {
      throw new Error('User must be authenticated to update workshops');
    }

    const workshopDocRef = doc(db, WORKSHOPS_COLLECTION, workshopId);
    const workshopDocSnap = await getDoc(workshopDocRef);

    if (!workshopDocSnap.exists()) {
      throw new Error('Workshop not found.');
    }

    const updateObject = {};
    if (updateData.image) {
      if (updateData.image instanceof File) {
        // If it's a new file, upload to Cloudinary
        updateObject.image = await cloudinaryConfig(updateData.image, "workshops-covers");
      } else {
        // If it's already a URL (string), just pass it through
        updateObject.image = updateData.image;
      }
    }
    const allowedFields = ['title', 'description', 'date', 'startTime', 'endTime', 'category', 'capacity', 'bookedSeats', 'price', 'status', 'image'];
    
    allowedFields.forEach(field => {
      if (updateData.hasOwnProperty(field)) {
        if (field === 'capacity' || field === 'price' || field === 'bookedSeats') {
          updateObject[field] = Number(updateData[field]);
        } else {
          updateObject[field] = updateData[field];
        }
      }
    });

    updateObject.updatedAt = new Date().toISOString();

    if (Object.keys(updateObject).length === 1 && updateObject.updatedAt) {
      throw new Error('No valid fields to update.');
    }

    await updateDoc(workshopDocRef, updateObject);

    const updatedDocSnap = await getDoc(workshopDocRef);
    const updatedData = updatedDocSnap.data();

    return {
      id: workshopId,
      ...updatedData,
    };
  } catch (error) {
    if (error.message.includes('Access denied') || 
        error.message.includes('User must be authenticated') ||
        error.message.includes('Workshop not found') ||
        error.message.includes('No valid fields to update')) {
      throw error;
    }
    throw new Error(`Failed to update workshop: ${error.message}`);
  }
}


export async function deleteWorkshop(workshopId) {
  try {
    const user = await ensureAdmin();

    const workshopDocRef = doc(db, WORKSHOPS_COLLECTION, workshopId);
    const workshopDocSnap = await getDoc(workshopDocRef);

    if (!workshopDocSnap.exists()) {
      throw new Error('Workshop not found.');
    }

    await deleteDoc(workshopDocRef);

    return { success: true, id: workshopId };
  } catch (error) {
    if (error.message.includes('Access denied') || 
        error.message.includes('User must be authenticated') ||
        error.message.includes('Workshop not found')) {
      throw error;
    }
    throw new Error(`Failed to delete workshop: ${error.message}`);
  }
}

export async function getWorkshops() {
  try {
    const workshopsCollection = collection(db, WORKSHOPS_COLLECTION);
    const workshopsSnapshot = await getDocs(workshopsCollection);

    const workshops = workshopsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
console.log("workshops in bck:",workshops);
    return workshops;
  } catch (error) {
    throw new Error(`Failed to fetch workshops: ${error.message}`);
  }
}
 
export async function confirmationEmail(emailData) {
  try {
    const brevoApiKey = process.env.NEXT_PUBLIC_BREVO_API_KEY;
    
    if (!brevoApiKey) {
      console.warn('Brevo API key not found. Email will not be sent.');
      return;
    }

    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      } catch {
        return dateString;
      }
    };

    const formatTime = (timeString) => {
      if (!timeString) return '';
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    const formattedDate = formatDate(emailData.workshopDate);
    const formattedTime = formatTime(emailData.workshopTime);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #6b7280; }
            .value { color: #111827; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmation</h1>
            </div>
            <div class="content">
              <p>Dear ${emailData.toName},</p>
              <p>Thank you for booking a workshop with Broderie by Bel! Your booking has been confirmed.</p>

              <div class="details">
                <h2 style="margin-top: 0;">Workshop Details</h2>
                <div class="detail-row">
                  <span class="label">Workshop:</span> <span class="value">${emailData.workshopTitle}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Date:</span> <span class="value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Time:</span> <span class="value">${formattedTime}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Price:</span> <span class="value">${emailData.workshopPrice} DH</span>
                </div>
              </div>

              <p>We look forward to seeing you at the workshop!</p>
              
              <div class="footer">
                <p>Best regards,<br>The Broderie by Bel Team</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
Booking Confirmation

Dear ${emailData.toName},

Thank you for booking a workshop with Broderie by Bel! Your booking has been confirmed.

Workshop Details:
- Workshop: ${emailData.workshopTitle}
- Date: ${formattedDate}
- Time: ${formattedTime}
- Price: ${emailData.workshopPrice} DH

We look forward to seeing you at the workshop!

Best regards,
The Broderie by Bel Team
    `;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Broderie by Bel',
          email: process.env.NEXT_PUBLIC_BREVO_SENDER_EMAIL || 'noreply@broderiebybel.com',
        },
        to: [
          {
            email: emailData.toEmail,
            name: emailData.toName,
          },
        ],
        subject: `Booking Confirmation: ${emailData.workshopTitle}`,
        htmlContent: htmlContent,
        textContent: textContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Brevo API error:', errorData);
      return;
    }

    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Failed to send confirmation email:', error.message);
  }
}
