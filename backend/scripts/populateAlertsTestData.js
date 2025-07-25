const mongoose = require('mongoose');
const Weather = require('../models/weather');
const FarmLog = require('../models/farmLog');
const Farmer = require('../models/farmerModel');
const smartAlertService = require('../services/smartAlertService');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kisan-mel', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const populateTestData = async () => {
    try {
        console.log('🌟 Starting Smart Alerts Test Data Population...\n');

        // Clear existing test data
        console.log('🧹 Clearing existing test data...');
        await Weather.deleteMany({ pincode: { $in: [302004, 302005, 302006] } });
        console.log('✅ Cleared existing weather data\n');

        // 1. Populate weather data that will trigger alerts
        console.log('🌤️ Populating weather data for smart alerts...');
        
        const alertTriggeringWeatherData = [
            // Heavy rainfall data for pincode 302004 (current month)
            {
                district: 'Jaipur',
                pincode: 302004,
                month: new Date().getMonth() + 1,
                avg_min_temp_c: 28.5,
                avg_max_temp_c: 42.2, // High temperature
                avg_rainfall_mm: 85.5, // Heavy rainfall
                avg_humidity_percent: 88, // High humidity
                avg_sunlight_hours: 6.2,
                year_recorded: 2024
            },
            // Normal data for comparison
            {
                district: 'Jaipur',
                pincode: 302004,
                month: new Date().getMonth() + 2 > 12 ? 1 : new Date().getMonth() + 2,
                avg_min_temp_c: 25.2,
                avg_max_temp_c: 35.8,
                avg_rainfall_mm: 25.3,
                avg_humidity_percent: 65,
                avg_sunlight_hours: 8.1,
                year_recorded: 2024
            },
            // Data for nearby areas
            {
                district: 'Jaipur',
                pincode: 302005,
                month: new Date().getMonth() + 1,
                avg_min_temp_c: 27.8,
                avg_max_temp_c: 41.5,
                avg_rainfall_mm: 78.2,
                avg_humidity_percent: 86,
                avg_sunlight_hours: 6.5,
                year_recorded: 2024
            }
        ];

        await Weather.insertMany(alertTriggeringWeatherData);
        console.log('✅ Weather data populated successfully\n');

        // 2. Find or create test farmers in the area
        console.log('👨‍🌾 Setting up test farmers...');
        
        let testFarmers = await Farmer.find({
            'farmDetails.pincode': { $in: ['302004', '302005'] }
        }).limit(3);

        if (testFarmers.length === 0) {
            console.log('📝 Creating test farmers...');
            const farmerData = [
                {
                    name: 'Test Farmer 1',
                    mobileNumber: '9876543210',
                    email: 'testfarmer1@example.com',
                    password: '$2a$10$test.hash.1',
                    farmDetails: {
                        pincode: '302004',
                        area: 5.5,
                        location: {
                            type: 'Point',
                            coordinates: [75.7873, 26.9124]
                        }
                    }
                },
                {
                    name: 'Test Farmer 2',
                    mobileNumber: '9876543211',
                    email: 'testfarmer2@example.com',
                    password: '$2a$10$test.hash.2',
                    farmDetails: {
                        pincode: '302005',
                        area: 8.2,
                        location: {
                            type: 'Point',
                            coordinates: [75.7901, 26.9150]
                        }
                    }
                },
                {
                    name: 'Test Farmer 3',
                    mobileNumber: '9876543212',
                    email: 'testfarmer3@example.com',
                    password: '$2a$10$test.hash.3',
                    farmDetails: {
                        pincode: '302004',
                        area: 3.8,
                        location: {
                            type: 'Point',
                            coordinates: [75.7850, 26.9100]
                        }
                    }
                }
            ];

            testFarmers = await Farmer.insertMany(farmerData);
            console.log('✅ Test farmers created successfully');
        } else {
            console.log('✅ Using existing test farmers');
        }

        console.log(`📍 Found ${testFarmers.length} test farmers in target area\n`);

        // 3. Create farm logs that will trigger pest/disease alerts
        console.log('🐛 Creating farm logs with pest/disease reports...');
        
        const pestDiseaseLogs = [
            {
                farmerId: testFarmers[0]._id,
                cropName: 'Rice',
                logType: 'manual_observation',
                title: 'Aphid Infestation Spotted',
                description: 'Noticed aphid colonies on young rice leaves in the northern section of the field. The infestation appears to be spreading.',
                observation: {
                    notes: 'Aphids found on approximately 20% of plants. Some leaves showing yellowing and curling. Need immediate attention.',
                    location: {
                        type: 'Point',
                        coordinates: [75.7873, 26.9124]
                    }
                },
                metadata: {
                    weatherConditions: {
                        temperature: 32,
                        humidity: 75,
                        rainfall: 5
                    }
                }
            },
            {
                farmerId: testFarmers[1]._id,
                cropName: 'Wheat',
                logType: 'manual_observation',
                title: 'Aphid Attack on Wheat Crop',
                description: 'Heavy aphid infestation observed on wheat plants. Urgent treatment required.',
                observation: {
                    notes: 'Severe aphid attack detected. Plants showing stress symptoms. Contacted local agriculture officer for guidance.',
                    location: {
                        type: 'Point',
                        coordinates: [75.7901, 26.9150]
                    }
                },
                metadata: {
                    weatherConditions: {
                        temperature: 33,
                        humidity: 78,
                        rainfall: 3
                    }
                }
            },
            {
                farmerId: testFarmers[2]._id,
                cropName: 'Rice',
                logType: 'manual_observation',
                title: 'Leaf Blight Disease Found',
                description: 'Brown spots appearing on rice leaves, suspected to be leaf blight disease.',
                observation: {
                    notes: 'Blight symptoms visible on multiple plants. High humidity conditions seem to be promoting disease spread.',
                    location: {
                        type: 'Point',
                        coordinates: [75.7850, 26.9100]
                    }
                },
                metadata: {
                    weatherConditions: {
                        temperature: 30,
                        humidity: 82,
                        rainfall: 8
                    }
                }
            },
            {
                farmerId: testFarmers[0]._id,
                cropName: 'Rice',
                logType: 'manual_observation',
                title: 'Stem Borer Damage Noticed',
                description: 'Found stem borer larvae in rice stems. Some plants showing dead heart symptoms.',
                observation: {
                    notes: 'Stem borer infestation in early stage. Need to apply appropriate insecticide immediately.',
                    location: {
                        type: 'Point',
                        coordinates: [75.7875, 26.9125]
                    }
                }
            }
        ];

        await FarmLog.insertMany(pestDiseaseLogs);
        console.log('✅ Pest/disease farm logs created successfully\n');

        // 4. Generate alerts for the first test farmer
        console.log('🚨 Generating smart alerts for test farmer...');
        
        if (testFarmers.length > 0) {
            const alerts = await smartAlertService.generateAlertsForFarmer(testFarmers[0]._id);
            console.log(`✅ Generated ${alerts.length} smart alerts for farmer: ${testFarmers[0].name}\n`);
            
            // Display generated alerts
            alerts.forEach((alert, index) => {
                console.log(`🔔 Alert ${index + 1}:`);
                console.log(`   Type: ${alert.alertType}`);
                console.log(`   Priority: ${alert.priority}`);
                console.log(`   Title: ${alert.title}`);
                console.log(`   Message: ${alert.message.substring(0, 100)}...`);
                console.log(`   Valid Until: ${alert.validUntil}`);
                console.log('');
            });
        }

        console.log('🎉 Smart Alerts Test Data Population Complete!\n');
        console.log('📋 Summary:');
        console.log(`   • Weather data: ${alertTriggeringWeatherData.length} records`);
        console.log(`   • Test farmers: ${testFarmers.length} farmers`);
        console.log(`   • Farm logs: ${pestDiseaseLogs.length} logs`);
        console.log(`   • Generated alerts: For farmer "${testFarmers[0]?.name}"`);
        console.log('\n💡 Tips:');
        console.log('   • Log in as a farmer with pincode 302004 to see alerts');
        console.log('   • Use the "Refresh Alerts" button to generate new alerts');
        console.log('   • Check the Cultivation Guide to see the Smart Alerts section');

    } catch (error) {
        console.error('❌ Error populating test data:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the script
populateTestData();

module.exports = { populateTestData }; 