exports.setupFarm = async (req, res) => {
  try {
    const { pincode, cropCycle } = req.body;
    const farmerId = req.user.id; // Assuming you have authentication middleware

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    farmer.farmDetails = {
      pincode,
      cropCycle
    };

    await farmer.save();

    res.status(200).json({
      success: true,
      message: 'Farm setup completed successfully',
      data: farmer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error setting up farm',
      error: error.message
    });
  }
}; 