# Olympics Data Visualization Dashboard

An interactive dashboard built with Angular that displays historical Olympic Games data, including medals per country and detailed country statistics.

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Git

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/a-melouk/oc-1-olympics.git
   ```

2. Navigate to the project directory
   ```bash
   cd oc-1-olympics
   ```

3. Install dependencies
   ```bash
   npm install
   ```

## Running the Application

To start the development server:
   ```bash
   ng serve
   ```

The application will be available at `http://localhost:4200`. The app will automatically reload if you change any of the source files.

## Building for Production

To create a production build:
   ```bash
   ng build
   ```

The build artifacts will be stored in the `dist/` directory.

## Features

- Responsive design that works on both desktop and mobile devices
- Interactive dashboard showing medals per country
- Detailed country view with:
- Number of Olympic participations
- Total medals won
- Total number of athletes
- Timeline graph showing medal count across different Olympic editions

## Project Structure

- `components/`: Reusable UI components
- `pages/`: Main route components
- `core/`: Business logic
- `services/`: Angular services
- `models/`: TypeScript interfaces

## Technologies Used

- Angular
- TypeScript
- RxJS
- NgxCharts for data visualization
- SCSS for styling

## License

This project is licensed under the MIT License.