import { getApperClient } from "@/services/apperClient";

const bookingService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.fetchRecords('booking_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "pnr_c"}},
          {"field": {"Name": "train_number_c"}},
          {"field": {"Name": "train_name_c"}},
          {"field": {"Name": "origin_c"}},
          {"field": {"Name": "destination_c"}},
          {"field": {"Name": "departure_time_c"}},
          {"field": {"Name": "arrival_time_c"}},
          {"field": {"Name": "journey_date_c"}},
          {"field": {"Name": "booking_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "class_c"}},
          {"field": {"Name": "fare_c"}},
          {"field": {"Name": "passengers_c"}},
          {"field": {"Name": "seat_numbers_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(booking => this.transformBookingData(booking));
    } catch (error) {
      console.error("Error fetching bookings:", error?.response?.data?.message || error);
      return [];
    }
  },

  transformBookingData(booking) {
    return {
      Id: booking.Id,
      pnr: booking.pnr_c,
      trainNumber: booking.train_number_c,
      trainName: booking.train_name_c,
      origin: booking.origin_c,
      destination: booking.destination_c,
      departureTime: booking.departure_time_c,
      arrivalTime: booking.arrival_time_c,
      journeyDate: booking.journey_date_c,
      bookingDate: booking.booking_date_c,
      status: booking.status_c,
      class: booking.class_c,
      fare: booking.fare_c,
      passengers: this.parsePassengers(booking.passengers_c),
      seatNumbers: this.parseSeatNumbers(booking.seat_numbers_c)
    };
  },

  parsePassengers(passengersString) {
    try {
      return passengersString ? JSON.parse(passengersString) : [];
    } catch (error) {
      console.error("Error parsing passengers:", error);
      return [];
    }
  },

  parseSeatNumbers(seatNumbersString) {
    try {
      return seatNumbersString ? JSON.parse(seatNumbersString) : [];
    } catch (error) {
      console.error("Error parsing seat numbers:", error);
      return [];
    }
  },

  async getByPnr(pnr) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.fetchRecords('booking_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "pnr_c"}},
          {"field": {"Name": "train_number_c"}},
          {"field": {"Name": "train_name_c"}},
          {"field": {"Name": "origin_c"}},
          {"field": {"Name": "destination_c"}},
          {"field": {"Name": "departure_time_c"}},
          {"field": {"Name": "arrival_time_c"}},
          {"field": {"Name": "journey_date_c"}},
          {"field": {"Name": "booking_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "class_c"}},
          {"field": {"Name": "fare_c"}},
          {"field": {"Name": "passengers_c"}},
          {"field": {"Name": "seat_numbers_c"}}
        ],
        where: [{
          "FieldName": "pnr_c",
          "Operator": "EqualTo",
          "Values": [pnr]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const data = response.data && response.data.length > 0 ? response.data[0] : null;
      return data ? this.transformBookingData(data) : null;
    } catch (error) {
      console.error(`Error fetching booking by PNR ${pnr}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async downloadTicketPdf(booking) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const result = await apperClient.functions.invoke(import.meta.env.VITE_GENERATE_TICKET_PDF, {
        body: JSON.stringify(booking),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!result.success) {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_GENERATE_TICKET_PDF}. The response body is: ${JSON.stringify(result)}.`);
        throw new Error(result.error || 'Failed to generate PDF');
      }

      const link = document.createElement('a');
      link.href = result.pdfData;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return result;
    } catch (error) {
      console.info(`apper_info: Got this error an this function: ${import.meta.env.VITE_GENERATE_TICKET_PDF}. The error is: ${error.message}`);
      throw error;
    }
  },

  async getUserBookings() {
    return this.getAll();
  },

  async createBooking(bookingData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const pnr = this.generatePnr();
      const bookingDate = new Date().toISOString().split('T')[0];

      const response = await apperClient.createRecord('booking_c', {
        records: [{
          Name: `Booking ${pnr}`,
          pnr_c: pnr,
          train_number_c: bookingData.trainNumber,
          train_name_c: bookingData.trainName,
          origin_c: bookingData.origin,
          destination_c: bookingData.destination,
          departure_time_c: bookingData.departureTime,
          arrival_time_c: bookingData.arrivalTime,
          journey_date_c: bookingData.journeyDate,
          booking_date_c: bookingDate,
          status_c: 'Confirmed',
          class_c: bookingData.class,
          fare_c: bookingData.fare,
          passengers_c: JSON.stringify(bookingData.passengers),
          seat_numbers_c: JSON.stringify(bookingData.seatNumbers)
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return this.transformBookingData({
            ...result.data,
            pnr_c: pnr,
            train_number_c: bookingData.trainNumber,
            train_name_c: bookingData.trainName,
            origin_c: bookingData.origin,
            destination_c: bookingData.destination,
            departure_time_c: bookingData.departureTime,
            arrival_time_c: bookingData.arrivalTime,
            journey_date_c: bookingData.journeyDate,
            booking_date_c: bookingDate,
            status_c: 'Confirmed',
            class_c: bookingData.class,
            fare_c: bookingData.fare,
            passengers_c: JSON.stringify(bookingData.passengers),
            seat_numbers_c: JSON.stringify(bookingData.seatNumbers)
          });
        } else {
          throw new Error(result.message || 'Failed to create booking');
        }
      }

      throw new Error('No response data received');
    } catch (error) {
      console.error("Error creating booking:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async cancelBooking(pnr) {
    try {
      const booking = await this.getByPnr(pnr);
      if (!booking) {
        throw new Error('Booking not found');
      }

      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.updateRecord('booking_c', {
        records: [{
          Id: booking.Id,
          status_c: 'Cancelled'
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const refundAmount = this.calculateRefund(booking);
      
      return {
        booking: { ...booking, status: 'Cancelled' },
        refundAmount
      };
    } catch (error) {
      console.error("Error cancelling booking:", error?.response?.data?.message || error);
      throw error;
    }
  },

  generatePnr() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  },

  calculateRefund(booking) {
    const journeyDate = new Date(booking.journeyDate);
    const today = new Date();
    const daysUntilJourney = Math.ceil((journeyDate - today) / (1000 * 60 * 60 * 24));
    
    let refundPercentage = 0;
    if (daysUntilJourney >= 1) {
      refundPercentage = 0.9;
    } else if (daysUntilJourney >= 0) {
      refundPercentage = 0.5;
    } else {
      refundPercentage = 0;
    }
    
    return Math.floor(booking.fare * refundPercentage);
  }
};

export default bookingService;