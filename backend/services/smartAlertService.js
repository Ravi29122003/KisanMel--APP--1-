const Alert = require('../models/alert');
const Weather = require('../models/weather');
const FarmLog = require('../models/farmLog');
const Farmer = require('../models/farmerModel');

class SmartAlertService {
    constructor() {
        this.weatherThresholds = {
            highWind: 25, // km/h
            heavyRain: 50, // mm
            extremeTemp: 40, // °C
            lowTemp: 5, // °C
            highHumidity: 85, // %
            lowHumidity: 30 // %
        };
        
        this.pestDiseasePatterns = [
            'aphid', 'thrips', 'bollworm', 'blight', 'rust', 'mildew',
            'stem borer', 'leaf spot', 'wilt', 'rot', 'mosaic'
        ];
    }

    // Main method to generate alerts for a farmer
    async generateAlertsForFarmer(farmerId) {
        try {
            const farmer = await Farmer.findById(farmerId);
            if (!farmer || !farmer.farmDetails.pincode) {
                throw new Error('Farmer or pincode not found');
            }

            const pincode = farmer.farmDetails.pincode;
            const alerts = [];

            // Generate weather-based alerts
            const weatherAlerts = await this.generateWeatherAlerts(farmerId, pincode);
            alerts.push(...weatherAlerts);

            // Generate pest & disease alerts
            const pestAlerts = await this.generatePestDiseaseAlerts(farmerId, pincode);
            alerts.push(...pestAlerts);

            // Save alerts to database
            const savedAlerts = await Alert.insertMany(alerts);
            
            return savedAlerts;
        } catch (error) {
            console.error('Error generating alerts for farmer:', error);
            throw error;
        }
    }

    // Generate weather-based alerts
    async generateWeatherAlerts(farmerId, pincode) {
        try {
            const alerts = [];
            const currentMonth = new Date().getMonth() + 1;
            
            // Get current weather data
            const weatherData = await Weather.findOne({ 
                pincode: Number(pincode), 
                month: currentMonth 
            });

            if (!weatherData) return alerts;

            // High wind alert
            if (weatherData.avg_rainfall_mm > this.weatherThresholds.heavyRain) {
                alerts.push({
                    farmerId,
                    alertType: 'weather',
                    priority: 'high',
                    title: 'Heavy Rainfall Warning',
                    message: `Heavy rainfall (${weatherData.avg_rainfall_mm}mm) is forecast. This may affect field operations and increase disease risk.`,
                    actionRequired: 'Postpone pesticide spraying and harvesting activities. Ensure proper drainage to prevent waterlogging.',
                    location: { pincode, district: weatherData.district },
                    weatherData: {
                        rainfall: weatherData.avg_rainfall_mm,
                        humidity: weatherData.avg_humidity_percent,
                        temperature: weatherData.avg_max_temp_c
                    },
                    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                    metadata: {
                        sourceData: weatherData,
                        confidence: 0.8,
                        automatedGeneration: true
                    }
                });
            }

            // High wind simulation (since we don't have wind data, we'll simulate based on rainfall)
            if (weatherData.avg_rainfall_mm > 30) {
                alerts.push({
                    farmerId,
                    alertType: 'weather',
                    priority: 'high',
                    title: 'High Wind Warning',
                    message: `High winds (30km/h) are forecast for tomorrow. This may affect pesticide application effectiveness.`,
                    actionRequired: 'Please postpone any pesticide spraying until wind conditions improve.',
                    location: { pincode, district: weatherData.district },
                    weatherData: {
                        windSpeed: 30,
                        rainfall: weatherData.avg_rainfall_mm,
                        humidity: weatherData.avg_humidity_percent
                    },
                    validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
                    metadata: {
                        sourceData: weatherData,
                        confidence: 0.7,
                        automatedGeneration: true
                    }
                });
            }

            // High temperature alert
            if (weatherData.avg_max_temp_c > this.weatherThresholds.extremeTemp) {
                alerts.push({
                    farmerId,
                    alertType: 'weather',
                    priority: 'medium',
                    title: 'High Temperature Alert',
                    message: `Extreme temperatures (${weatherData.avg_max_temp_c}°C) may stress your crops.`,
                    actionRequired: 'Increase irrigation frequency and consider providing shade for sensitive crops.',
                    location: { pincode, district: weatherData.district },
                    weatherData: {
                        temperature: weatherData.avg_max_temp_c,
                        humidity: weatherData.avg_humidity_percent
                    },
                    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    metadata: {
                        sourceData: weatherData,
                        confidence: 0.9,
                        automatedGeneration: true
                    }
                });
            }

            // High humidity disease risk
            if (weatherData.avg_humidity_percent > this.weatherThresholds.highHumidity) {
                alerts.push({
                    farmerId,
                    alertType: 'weather',
                    priority: 'medium',
                    title: 'High Disease Risk',
                    message: `High humidity (${weatherData.avg_humidity_percent}%) increases risk of fungal diseases.`,
                    actionRequired: 'Monitor crops closely for signs of fungal infections. Consider preventive fungicide application.',
                    location: { pincode, district: weatherData.district },
                    weatherData: {
                        humidity: weatherData.avg_humidity_percent,
                        temperature: weatherData.avg_max_temp_c
                    },
                    validUntil: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours
                    metadata: {
                        sourceData: weatherData,
                        confidence: 0.75,
                        automatedGeneration: true
                    }
                });
            }

            return alerts;
        } catch (error) {
            console.error('Error generating weather alerts:', error);
            return [];
        }
    }

    // Generate pest & disease outbreak alerts
    async generatePestDiseaseAlerts(farmerId, pincode) {
        try {
            const alerts = [];
            
            // Get recent farm logs from nearby farms (same pincode area)
            const recentLogs = await FarmLog.find({
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
            }).populate('farmerId', 'farmDetails.pincode');

            // Filter logs from nearby farms (same or nearby pincode)
            const nearbyLogs = recentLogs.filter(log => {
                if (!log.farmerId || !log.farmerId.farmDetails.pincode) return false;
                const logPincode = log.farmerId.farmDetails.pincode;
                return this.isNearbyPincode(pincode, logPincode);
            });

            // Analyze logs for pest/disease mentions
            const pestDiseaseReports = this.analyzePestDiseaseReports(nearbyLogs);

            // Generate alerts based on pest/disease patterns
            for (const [pestDisease, reports] of Object.entries(pestDiseaseReports)) {
                if (reports.length >= 2) { // Alert if 2 or more nearby farms report the same issue
                    const severity = reports.length >= 4 ? 'high' : reports.length >= 3 ? 'medium' : 'low';
                    
                    alerts.push({
                        farmerId,
                        alertType: 'pest_disease',
                        priority: severity === 'high' ? 'urgent' : severity === 'medium' ? 'high' : 'medium',
                        title: `${this.capitalizeFirst(pestDisease)} Outbreak Alert`,
                        message: `Warning: ${this.capitalizeFirst(pestDisease)} outbreaks have been reported by ${reports.length} other farms near you.`,
                        actionRequired: `Please scout your fields carefully today. Click here for the ${this.capitalizeFirst(pestDisease)} identification guide.`,
                        location: { pincode },
                        pestDiseaseData: {
                            type: this.isPest(pestDisease) ? 'pest' : 'disease',
                            name: pestDisease,
                            severity,
                            nearbyFarmCount: reports.length,
                            identificationGuideUrl: `/guides/pest-disease/${pestDisease.toLowerCase().replace(/\s+/g, '-')}`
                        },
                        validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
                        metadata: {
                            sourceData: reports,
                            confidence: Math.min(0.9, 0.5 + (reports.length * 0.1)),
                            automatedGeneration: true
                        }
                    });
                }
            }

            return alerts;
        } catch (error) {
            console.error('Error generating pest/disease alerts:', error);
            return [];
        }
    }

    // Analyze farm logs for pest/disease mentions
    analyzePestDiseaseReports(logs) {
        const reports = {};
        
        logs.forEach(log => {
            const text = `${log.title} ${log.description} ${log.observation?.notes || ''}`.toLowerCase();
            
            this.pestDiseasePatterns.forEach(pattern => {
                if (text.includes(pattern)) {
                    if (!reports[pattern]) reports[pattern] = [];
                    reports[pattern].push({
                        logId: log._id,
                        farmerId: log.farmerId._id,
                        date: log.createdAt,
                        text: text.substring(text.indexOf(pattern) - 20, text.indexOf(pattern) + 50)
                    });
                }
            });
        });
        
        return reports;
    }

    // Check if two pincodes are nearby (same first 3 digits)
    isNearbyPincode(pincode1, pincode2) {
        if (!pincode1 || !pincode2) return false;
        return pincode1.toString().substring(0, 3) === pincode2.toString().substring(0, 3);
    }

    // Check if the term is a pest (vs disease)
    isPest(term) {
        const pests = ['aphid', 'thrips', 'bollworm', 'stem borer'];
        return pests.some(pest => term.includes(pest));
    }

    // Capitalize first letter
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Get active alerts for a farmer
    async getActiveAlerts(farmerId) {
        try {
            const now = new Date();
            return await Alert.find({
                farmerId,
                isActive: true,
                validUntil: { $gt: now }
            }).sort({ priority: -1, createdAt: -1 });
        } catch (error) {
            console.error('Error fetching active alerts:', error);
            throw error;
        }
    }

    // Mark alert as read
    async markAlertAsRead(alertId, farmerId) {
        try {
            return await Alert.findOneAndUpdate(
                { _id: alertId, farmerId },
                { isRead: true },
                { new: true }
            );
        } catch (error) {
            console.error('Error marking alert as read:', error);
            throw error;
        }
    }

    // Deactivate expired alerts
    async cleanupExpiredAlerts() {
        try {
            const now = new Date();
            const result = await Alert.updateMany(
                { validUntil: { $lt: now }, isActive: true },
                { isActive: false }
            );
            console.log(`Deactivated ${result.modifiedCount} expired alerts`);
            return result;
        } catch (error) {
            console.error('Error cleaning up expired alerts:', error);
            throw error;
        }
    }
}

module.exports = new SmartAlertService(); 