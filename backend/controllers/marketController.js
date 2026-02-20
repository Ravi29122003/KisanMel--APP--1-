const Marketconnect = require('../models/marketconnect');

// Get market offers with filtering and sorting
exports.getMarketOffers = async (req, res) => {
  try {
    // Extract query parameters
    const { crop, type, maxDistance } = req.query;
    
    // Build filter object
    const filter = {
      status: 'Active' // Only show active offers
    };

    // Add crop filter if provided
    if (crop) {
      filter.crop = { $regex: crop, $options: 'i' }; // Case-insensitive search
    }

    // Add market type filter if provided
    if (type) {
      filter.market_type = type;
    }

    // Add distance filter if provided
    if (maxDistance) {
      const maxDist = parseFloat(maxDistance);
      if (!isNaN(maxDist) && maxDist > 0) {
        filter.distance_km = { $lte: maxDist };
      }
    }

    // Query the database with filters, sorting, and limit
    const offers = await Marketconnect.find(filter)
      .sort({ listed_on: -1 }) // Sort by listed_on in descending order (newest first)
      .limit(20) // Limit to 20 offers
      .lean(); // Use lean() for better performance since we don't need Mongoose documents

    res.status(200).json({
      status: 'success',
      results: offers.length,
      data: offers
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get latest contract for saved crops (one per crop)
exports.getLatestCropContracts = async (req, res) => {
  try {
    const { crops } = req.body; // Expecting array of crop names from "My Crop Plan"
    
    if (!crops || !Array.isArray(crops) || crops.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide an array of crop names'
      });
    }

    // Normalize crop names for better matching
    const normalizedCrops = crops.map(crop => {
      const cropName = typeof crop === 'string' ? crop : crop.name;
      return cropName.toLowerCase().trim();
    });

    // Create a mapping for common crop name variations
    const cropMapping = {
      'paddy': 'rice',
      'maize': 'corn',
      'brinjal': 'eggplant',
      'chilli': 'chili',
      'groundnut': 'peanut'
    };

    // Extend crop search to include variations
    const searchCrops = [...normalizedCrops];
    normalizedCrops.forEach(crop => {
      const mapped = cropMapping[crop];
      if (mapped && !searchCrops.includes(mapped)) {
        searchCrops.push(mapped);
      }
      // Also search reverse mapping
      const reverseKey = Object.keys(cropMapping).find(key => cropMapping[key] === crop);
      if (reverseKey && !searchCrops.includes(reverseKey)) {
        searchCrops.push(reverseKey);
      }
    });

    // Build aggregation pipeline to get only the latest contract per crop
    const pipeline = [
      {
        $match: {
          crop: { 
            $in: searchCrops.map(crop => new RegExp(crop, 'i'))
          },
          status: 'Active'
        }
      },
      {
        $sort: { 
          updatedAt: -1, // Sort by most recently updated first
          createdAt: -1,  // Then by creation date
          price_per_kg: -1 // Finally by price for consistency
        }
      },
      {
        $group: {
          _id: '$crop',
          latestContract: { $first: '$$ROOT' }, // Get the first (latest) contract for each crop
          totalAvailable: { $sum: 1 } // Count total contracts available for this crop
        }
      },
      {
        $project: {
          crop: '$_id',
          contract: '$latestContract',
          totalAvailable: 1
        }
      }
    ];

    const contractData = await Marketconnect.aggregate(pipeline);

    // Format the response to match frontend expectations
    const formattedData = contractData.reduce((acc, cropData) => {
      const cropKey = cropData.crop.toLowerCase();
      acc[cropKey] = {
        crop: cropData.crop,
        contract: cropData.contract,
        totalAvailable: cropData.totalAvailable,
        lastUpdated: cropData.contract.updatedAt || cropData.contract.createdAt
      };
      return acc;
    }, {});

    res.status(200).json({
      status: 'success',
      requestedCrops: crops,
      foundCrops: Object.keys(formattedData),
      contractsFound: Object.keys(formattedData).length,
      data: formattedData
    });

  } catch (error) {
    console.error('Error fetching latest crop contracts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch latest crop contracts'
    });
  }
};

// Search for latest contract by crop name
exports.searchLatestContract = async (req, res) => {
  try {
    const { cropName } = req.body;
    
    if (!cropName || typeof cropName !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a crop name to search'
      });
    }

    const normalizedCrop = cropName.toLowerCase().trim();

    // Create a mapping for common crop name variations
    const cropMapping = {
      'paddy': 'rice',
      'maize': 'corn',
      'brinjal': 'eggplant',
      'chilli': 'chili',
      'groundnut': 'peanut'
    };

    // Include crop variations in search
    const searchTerms = [normalizedCrop];
    const mapped = cropMapping[normalizedCrop];
    if (mapped) searchTerms.push(mapped);
    
    const reverseKey = Object.keys(cropMapping).find(key => cropMapping[key] === normalizedCrop);
    if (reverseKey) searchTerms.push(reverseKey);

    // Find the latest contract for this crop
    const latestContract = await Marketconnect.findOne({
      crop: { 
        $in: searchTerms.map(term => new RegExp(term, 'i'))
      },
      status: 'Active'
    })
    .sort({ 
      updatedAt: -1, 
      createdAt: -1,
      price_per_kg: -1 
    })
    .lean();

    if (!latestContract) {
      return res.status(200).json({
        status: 'success',
        message: `No contract available for "${cropName}" yet.`,
        searchedCrop: cropName,
        found: false,
        data: null
      });
    }

    // Get total count of contracts available for this crop
    const totalCount = await Marketconnect.countDocuments({
      crop: { 
        $in: searchTerms.map(term => new RegExp(term, 'i'))
      },
      status: 'Active'
    });

    res.status(200).json({
      status: 'success',
      message: `Latest contract found for "${cropName}"`,
      searchedCrop: cropName,
      found: true,
      totalAvailable: totalCount,
      lastUpdated: latestContract.updatedAt || latestContract.createdAt,
      data: latestContract
    });

  } catch (error) {
    console.error('Error searching for latest contract:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search for contract'
    });
  }
};

// Legacy function - keeping for backward compatibility (renamed to avoid confusion)
exports.getCropContracts = exports.getLatestCropContracts;

// Get all contracts for a specific crop (with pagination)
exports.getAllContractsForCrop = async (req, res) => {
  try {
    const { cropName } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    if (!cropName || !cropName.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Crop name is required'
      });
    }

    console.log(`[Market Controller] Fetching all contracts for crop: ${cropName}`);

    // Crop name mapping for better matching
    const cropMapping = {
      'paddy': 'rice',
      'maize': 'corn',
      'sugarcane': 'sugar cane'
    };

    const searchCrop = cropName.toLowerCase().trim();
    const normalizedCrop = cropMapping[searchCrop] || searchCrop;
    const searchCrops = [searchCrop, normalizedCrop];

    // Remove duplicates
    const uniqueSearchCrops = [...new Set(searchCrops)];

    // Build aggregation pipeline for finding all contracts
    const pipeline = [
      {
        $match: {
          crop: { $in: uniqueSearchCrops.map(crop => new RegExp(crop, 'i')) },
          status: 'Active'
        }
      },
      {
        $sort: { 
          updatedAt: -1,
          createdAt: -1,
          price_per_kg: -1 
        }
      },
      {
        $facet: {
          contracts: [
            { $skip: skip },
            { $limit: limit }
          ],
          totalCount: [
            { $count: "count" }
          ],
          cropStats: [
            {
              $group: {
                _id: null,
                totalContracts: { $sum: 1 },
                avgPrice: { $avg: "$price_per_kg" },
                maxPrice: { $max: "$price_per_kg" },
                minPrice: { $min: "$price_per_kg" },
                uniqueBuyers: { $addToSet: "$buyer_details.company_name" }
              }
            }
          ]
        }
      }
    ];

    const result = await Marketconnect.aggregate(pipeline);
    const contracts = result[0].contracts || [];
    const totalCount = result[0].totalCount[0]?.count || 0;
    const stats = result[0].cropStats[0] || {};

    if (contracts.length === 0) {
      return res.status(200).json({
        status: 'success',
        found: false,
        message: `No market contracts found for "${cropName}" currently.`,
        searchedCrop: cropName,
        data: {
          contracts: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalContracts: 0,
            hasNextPage: false,
            hasPreviousPage: false
          },
          stats: {
            totalContracts: 0,
            avgPrice: 0,
            priceRange: { min: 0, max: 0 },
            uniqueBuyers: 0
          }
        }
      });
    }

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Format response
    const response = {
      status: 'success',
      found: true,
      message: `Found ${totalCount} contract${totalCount > 1 ? 's' : ''} for "${cropName}"`,
      searchedCrop: cropName,
      data: {
        contracts: contracts,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalContracts: totalCount,
          hasNextPage: hasNextPage,
          hasPreviousPage: hasPreviousPage,
          limit: limit
        },
        stats: {
          totalContracts: stats.totalContracts || 0,
          avgPrice: Math.round((stats.avgPrice || 0) * 100) / 100,
          priceRange: {
            min: stats.minPrice || 0,
            max: stats.maxPrice || 0
          },
          uniqueBuyers: (stats.uniqueBuyers || []).length
        }
      }
    };

    console.log(`[Market Controller] Found ${totalCount} contracts for ${cropName} (page ${page}/${totalPages})`);
    res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching all contracts for crop:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch contracts for crop'
    });
  }
};

// Get contract details by ID
exports.getContractById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contract = await Marketconnect.findById(id).lean();
    
    if (!contract) {
      return res.status(404).json({
        status: 'error',
        message: 'Contract not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: contract
    });

  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}; 