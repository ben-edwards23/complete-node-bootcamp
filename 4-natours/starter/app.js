const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();
const PORT = 3000 || process.env.PORT;

let tourData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());

// ROUTES
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    count: tourData.length,
    data: {
      tours: tourData,
    },
  });
};

app.get('/api/v1/tours', getAllTours);

app.get('/api/v1/tours/:id', (req, res) => {
  const tourId = Number(req.params.id);
  const tour = tourData.find((obj) => obj.id === tourId);

  if (!tour) {
    return res
      .status(404)
      .json({ status: 'failed', message: 'Invalid Tour ID' });
  }
  if (tourId <= tourData.length)
    res.status(200).json({
      status: 'success',
      data: {
        tours: tour,
      },
    });
  esl;
});

app.patch('/api/v1/tours/:id', (req, res) => {});

app.post('/api/v1/tours', (req, res) => {
  // Work out the last ID and increment by 1
  const newId = tourData[tourData.length - 1].id + 1;

  // Add the new ID to the request JSON
  const newTour = Object.assign({ id: newId }, req.body);

  // Add to the tourData array
  tourData.push(newTour);

  // Write back out to file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tourData),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}.`);
});
