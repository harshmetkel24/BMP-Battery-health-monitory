import pandas as pd
from sklearn import linear_model
from flask import Flask, request, jsonify
from datetime import datetime
from flask_cors import CORS

df = pd.read_csv("battery_data.csv")

# Convert the datetime string column to datetime objects
df["datetime"] = pd.to_datetime(df["date"] + " " + df["time"])
df["time"] = pd.to_datetime(df["time"])

# Extract relevant date and time features
df["year"] = df["datetime"].dt.year
df["month"] = df["datetime"].dt.month
df["day"] = df["datetime"].dt.day

df["hour"] = df["datetime"].dt.hour
df["minute"] = df["datetime"].dt.minute
df["second"] = df["datetime"].dt.second

# print(df)

# Now, you can use these numerical features in your linear regression model
# For example, if 'ADC' is your target column:
X = df[["year", "month", "day", "hour", "minute", "second"]]


y = df["adc"]

regr = linear_model.LinearRegression()
regr.fit(X, y)

# wirte a function to give array like this from date and time


def parse_datetime_string(datetime_str):
    try:
        # Parse the input string into a datetime object
        dt = datetime.strptime(datetime_str, "%Y-%m-%d %I:%M:%S %p")

        # Extract year, month, day, hour, minute, and second from the datetime object
        date_time_array = [dt.year, dt.month, dt.day, dt.hour, dt.minute, dt.second]

        return date_time_array
    except ValueError:
        # Handle invalid date/time format
        return None


predictedADC = regr.predict([parse_datetime_string("2019-10-01 12:00:00 AM")])

# print(predictedADC)

app = Flask(__name__)
CORS(app)


@app.route("/predict", methods=["GET"])
def predict():
    time = request.args.get("time")
    date = request.args.get("date")
    parsed_datetime = parse_datetime_string(date + " " + time)
    # print(parsed_datetime)

    if parsed_datetime is None:
        return jsonify({"error": "Invalid date/time format"})

    # Make predictions using your ML model (assuming 'regr' is loaded correctly)
    prediction = regr.predict([parsed_datetime])

    # Ensure the prediction is in a JSON-serializable format, e.g., convert it to a float or int
    prediction = float(prediction)  # Adjust the data type if needed

    return jsonify({"prediction": prediction})


if __name__ == "__main__":
    app.run(debug=True)
