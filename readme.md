# Battery Health Monitor

We have done this project as a part of B.Tech Mini Project (BMP) under Prof. Rahul Mishra. Its about Battery Health Monitoring by collection information about Battery Voltage and perform analysis based on the past data.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Description](#project-description)
- [How It Works](#how-it-works)
- [Features](#features)
  <!--- [Contributing](#contributing)-->
  <!--- [License](#license)-->

## Installation

To install and run this project, follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/harshmetkel24/BMP-Battery-health-monitory.git
   ```

2. Change to the project directory:

   ```bash
   cd backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Usage

To use this project, follow these steps:

- To start the development server:

  ```bash
  npm run dev
  ```

- Access the project in your web browser at <a>http://localhost:3000</a>.

<!--## Project Description-->

## How It Works

- The project consists of Modules like _HomeController_, _MonitorController_, _PostBatteries_, _GetBatteries_ and _SaveDataToFiles_.
- Data flows through the system in the following way:
  - Firstly Index files are fed into arduino.
  - Then in response we get **ip address** sending the voltage data of each batteries connected to particular Arduino.
  - Then Backend serves all such pages in frontend based on the number of urls provided to our project.

## Features

List the main features of your project. For example:

- Feature 1: Any battery device can be integrated to our project by connecting to Arduino devices.
- Feature 2: Data about each of batteries will be stored in .csv files so that can be used for analysis purpose.
- Feature 3: Saving of data is performed periodically at every 60 seconds.
- Feaure 4: Page resets every 10 minutes so that user see only required amount of information at one time.

<!--## Contributing-->

<!--Explain how others can contribute to your project, including guidelines for submitting issues, feature requests, and pull requests.-->

<!--## License-->

<!--This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this software.-->

<!------->

<!--Feel free to customize this template to fit your project's specific needs. Additionally, you can include sections like "Testing," "Deployment," or "Acknowledgments" if they are relevant to your project. Remember to keep your README clear and well-organized to make it easier for others to understand and contribute to your project.-->
