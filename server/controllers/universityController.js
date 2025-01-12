exports.getUniversities = (req, res) => {
    const universities = [
      { id: 1, name: 'United International University' },
      { id: 2, name: 'Dhaka International University' },
    ];
    res.json(universities);
  };
  