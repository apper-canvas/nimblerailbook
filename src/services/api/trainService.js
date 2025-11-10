import { getApperClient } from "@/services/apperClient";
const trainService = {
  async searchTrains(searchParams) {
    const { origin, destination, journeyDate, travelClass } = searchParams;
    
    if (!origin || !destination) {
      return [];
    }

    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const whereConditions = [
        {"FieldName": "origin_c", "Operator": "EqualTo", "Values": [origin]},
        {"FieldName": "destination_c", "Operator": "EqualTo", "Values": [destination]}
      ];

      const response = await apperClient.fetchRecords('train_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "train_number_c"}},
          {"field": {"Name": "train_name_c"}},
          {"field": {"Name": "origin_c"}},
          {"field": {"Name": "destination_c"}},
          {"field": {"Name": "departure_time_c"}},
          {"field": {"Name": "arrival_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "available_seats_1a_c"}},
          {"field": {"Name": "available_seats_2a_c"}},
          {"field": {"Name": "available_seats_3a_c"}},
          {"field": {"Name": "available_seats_sl_c"}},
          {"field": {"Name": "available_seats_cc_c"}},
          {"field": {"Name": "available_seats_ec_c"}},
          {"field": {"Name": "fare_1a_c"}},
          {"field": {"Name": "fare_2a_c"}},
          {"field": {"Name": "fare_3a_c"}},
          {"field": {"Name": "fare_sl_c"}},
          {"field": {"Name": "fare_cc_c"}},
          {"field": {"Name": "fare_ec_c"}}
        ],
        where: whereConditions
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(train => this.transformTrainData(train));
    } catch (error) {
      console.error("Error searching trains:", error?.response?.data?.message || error);
      return [];
    }
  },

  transformTrainData(train) {
    return {
      Id: train.Id,
      trainNumber: train.train_number_c,
      trainName: train.train_name_c,
      origin: train.origin_c,
      destination: train.destination_c,
      departureTime: train.departure_time_c,
      arrivalTime: train.arrival_time_c,
      duration: train.duration_c,
      availableSeats: {
        '1A': train.available_seats_1a_c || 0,
        '2A': train.available_seats_2a_c || 0,
        '3A': train.available_seats_3a_c || 0,
        'SL': train.available_seats_sl_c || 0,
        'CC': train.available_seats_cc_c || 0,
        'EC': train.available_seats_ec_c || 0
      },
      fare: {
        '1A': train.fare_1a_c || 0,
        '2A': train.fare_2a_c || 0,
        '3A': train.fare_3a_c || 0,
        'SL': train.fare_sl_c || 0,
        'CC': train.fare_cc_c || 0,
        'EC': train.fare_ec_c || 0
      },
      classes: this.getAvailableClasses(train)
    };
  },

  getAvailableClasses(train) {
    const classes = [];
    const seatMap = {
      '1A': train.available_seats_1a_c,
      '2A': train.available_seats_2a_c,
      '3A': train.available_seats_3a_c,
      'SL': train.available_seats_sl_c,
      'CC': train.available_seats_cc_c,
      'EC': train.available_seats_ec_c
    };

    for (const [className, seats] of Object.entries(seatMap)) {
      if (seats && seats > 0) {
        classes.push(className);
      }
    }

    return classes;
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.getRecordById('train_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "train_number_c"}},
          {"field": {"Name": "train_name_c"}},
          {"field": {"Name": "origin_c"}},
          {"field": {"Name": "destination_c"}},
          {"field": {"Name": "departure_time_c"}},
          {"field": {"Name": "arrival_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "available_seats_1a_c"}},
          {"field": {"Name": "available_seats_2a_c"}},
          {"field": {"Name": "available_seats_3a_c"}},
          {"field": {"Name": "available_seats_sl_c"}},
          {"field": {"Name": "available_seats_cc_c"}},
          {"field": {"Name": "available_seats_ec_c"}},
          {"field": {"Name": "fare_1a_c"}},
          {"field": {"Name": "fare_2a_c"}},
          {"field": {"Name": "fare_3a_c"}},
          {"field": {"Name": "fare_sl_c"}},
          {"field": {"Name": "fare_cc_c"}},
          {"field": {"Name": "fare_ec_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data ? this.transformTrainData(response.data) : null;
    } catch (error) {
      console.error(`Error fetching train ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByTrainNumber(trainNumber) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.fetchRecords('train_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "train_number_c"}},
          {"field": {"Name": "train_name_c"}},
          {"field": {"Name": "origin_c"}},
          {"field": {"Name": "destination_c"}},
          {"field": {"Name": "departure_time_c"}},
          {"field": {"Name": "arrival_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "available_seats_1a_c"}},
          {"field": {"Name": "available_seats_2a_c"}},
          {"field": {"Name": "available_seats_3a_c"}},
          {"field": {"Name": "available_seats_sl_c"}},
          {"field": {"Name": "available_seats_cc_c"}},
          {"field": {"Name": "available_seats_ec_c"}},
          {"field": {"Name": "fare_1a_c"}},
          {"field": {"Name": "fare_2a_c"}},
          {"field": {"Name": "fare_3a_c"}},
          {"field": {"Name": "fare_sl_c"}},
          {"field": {"Name": "fare_cc_c"}},
          {"field": {"Name": "fare_ec_c"}}
        ],
        where: [{
          "FieldName": "train_number_c",
          "Operator": "EqualTo",
          "Values": [trainNumber]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const data = response.data && response.data.length > 0 ? response.data[0] : null;
      return data ? this.transformTrainData(data) : null;
    } catch (error) {
      console.error(`Error fetching train by number ${trainNumber}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getSeatLayout(trainId, travelClass) {
    const train = await this.getById(trainId);
    if (!train || !train.classes.includes(travelClass)) {
      return null;
    }

    const layouts = {
      '1A': this.generateSeatLayout('1A', 4, 6),
      '2A': this.generateSeatLayout('2A', 6, 8),  
      '3A': this.generateSeatLayout('3A', 8, 9),
      'SL': this.generateSeatLayout('SL', 12, 8),
      'CC': this.generateSeatLayout('CC', 4, 12),
      'EC': this.generateSeatLayout('EC', 2, 12)
    };

    return layouts[travelClass] || null;
  },

  generateSeatLayout(travelClass, coachCount, seatsPerCoach) {
    const coaches = [];
    
    for (let i = 1; i <= coachCount; i++) {
      const coachName = `${travelClass.charAt(0)}${i}`;
      const seats = [];
      
      for (let j = 1; j <= seatsPerCoach; j++) {
        seats.push({
          seatNumber: `${coachName}-${j}`,
          status: Math.random() > 0.3 ? 'available' : 'occupied',
          type: this.getSeatType(travelClass, j)
        });
      }
      
      coaches.push({
        coachName,
        seats
      });
    }
    
    return coaches;
  },

  getSeatType(travelClass, seatNumber) {
    if (travelClass === 'CC' || travelClass === 'EC') {
      return 'chair';
    }
    
    const berths = ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'];
    return berths[seatNumber % berths.length];
  },

  async getTrainStatus(trainNumber) {
    try {
      const train = await this.getByTrainNumber(trainNumber);
      if (!train) return null;

      const statuses = ['On Time', 'Delayed by 15 min', 'Delayed by 30 min', 'Delayed by 1 hr', 'Cancelled'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      return {
        ...train,
        currentStatus: randomStatus,
        lastUpdated: new Date().toISOString(),
        nextStation: 'Intermediate Station',
        platform: Math.floor(Math.random() * 10) + 1
      };
    } catch (error) {
      console.error(`Error getting train status for ${trainNumber}:`, error?.response?.data?.message || error);
      return null;
return null;
    }
  },

  async getRouteDetails(trainId) {
    try {
      if (!train) return null;

      // Generate realistic intermediate stations between origin and destination
      const intermediateStations = this.generateIntermediateStations(train.origin, train.destination);
      
      return {
        trainId: trainId,
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        origin: train.origin,
        destination: train.destination,
        totalDistance: this.calculateDistance(train.origin, train.destination),
        totalDuration: train.duration,
        stoppages: intermediateStations.map((station, index) => ({
          stationName: station.name,
          stationCode: station.code,
          arrivalTime: this.calculateStationTime(train.departureTime, index + 1, intermediateStations.length + 1),
          departureTime: this.calculateStationTime(train.departureTime, index + 1, intermediateStations.length + 1, 2),
          stopDuration: index === 0 || index === intermediateStations.length - 1 ? "0 min" : "2 min",
          distance: Math.round((index + 1) * this.calculateDistance(train.origin, train.destination) / (intermediateStations.length + 1)),
          platform: Math.floor(Math.random() * 8) + 1
        }))
      };
    } catch (error) {
      console.error(`Error getting route details for train ${trainId}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  generateIntermediateStations(origin, destination) {
    const commonStations = [
      { name: "Junction Station", code: "JST" },
      { name: "Central Station", code: "CNT" },
      { name: "Railway Junction", code: "RLJ" },
      { name: "Main Station", code: "MST" },
      { name: "Terminal Station", code: "TRM" },
      { name: "Express Station", code: "EXP" }
    ];

    const stationCount = Math.floor(Math.random() * 4) + 2; // 2-5 intermediate stations
    const selectedStations = [];
    
    for (let i = 0; i < stationCount; i++) {
      const station = commonStations[Math.floor(Math.random() * commonStations.length)];
      selectedStations.push({
        name: `${station.name} ${i + 1}`,
        code: `${station.code}${i + 1}`
      });
    }

    return selectedStations;
  },

  calculateDistance(origin, destination) {
    // Generate realistic distance based on station names (mock calculation)
    const baseDistance = Math.floor(Math.random() * 800) + 200; // 200-1000 km
    return baseDistance;
  },

  calculateStationTime(departureTime, stationIndex, totalStations, additionalMinutes = 0) {
    const [hours, minutes] = departureTime.split(':').map(Number);
    const departureMinutes = hours * 60 + minutes;
    
    // Calculate proportional time for this station
    const journeyMinutes = Math.floor(Math.random() * 480) + 120; // 2-8 hours journey
    const stationMinutes = departureMinutes + (journeyMinutes * stationIndex / totalStations) + additionalMinutes;
    
    const finalHours = Math.floor(stationMinutes / 60) % 24;
    const finalMins = Math.floor(stationMinutes % 60);
    
    return `${finalHours.toString().padStart(2, '0')}:${finalMins.toString().padStart(2, '0')}`;
  },

  async refreshAvailability(trainId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      // Fetch fresh data from database
      const response = await apperClient.getRecordById('train_c', parseInt(trainId), {
        fields: [
          {"field": {"Name": "available_seats_1a_c"}},
          {"field": {"Name": "available_seats_2a_c"}},
          {"field": {"Name": "available_seats_3a_c"}},
          {"field": {"Name": "available_seats_sl_c"}},
          {"field": {"Name": "available_seats_cc_c"}},
          {"field": {"Name": "available_seats_ec_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.data) {
        return {
          '1A': response.data.available_seats_1a_c || 0,
          '2A': response.data.available_seats_2a_c || 0,
          '3A': response.data.available_seats_3a_c || 0,
          'SL': response.data.available_seats_sl_c || 0,
          'CC': response.data.available_seats_cc_c || 0,
          'EC': response.data.available_seats_ec_c || 0
        };
      }

      return null;
    } catch (error) {
      console.error(`Error refreshing availability for train ${trainId}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getFareBreakdown(trainId, travelClass, passengerCount = 1) {
    try {
      const train = await this.getById(trainId);
      if (!train || !train.fare[travelClass]) {
        return null;
      }

      const baseFare = train.fare[travelClass];
      const reservationFee = travelClass === 'SL' ? 20 : 40;
      const serviceTax = Math.round(baseFare * 0.05);
      const totalPerPassenger = baseFare + reservationFee + serviceTax;

      return {
        baseFare,
        reservationFee,
        serviceTax,
        totalPerPassenger,
        totalAmount: totalPerPassenger * passengerCount,
        breakdown: {
          'Base Fare': baseFare * passengerCount,
          'Reservation Fee': reservationFee * passengerCount,
          'Service Tax (5%)': serviceTax * passengerCount
        }
      };
    } catch (error) {
      console.error(`Error getting fare breakdown:`, error?.response?.data?.message || error);
      return null;
    }
  }
};

export default trainService;