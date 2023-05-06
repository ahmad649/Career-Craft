import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from keras.models import load_model
from keras import regularizers

def getCareerPaths(skills,data):
    # Load the Keras model
    model = load_model('modelx.h5')

    # Load the data

    if data is None:
        try:
            data = pd.read_csv('Zero_free.csv')
        except Exception as e:
            print(f"Error reading CSV file: {e}")
            return
    le = LabelEncoder()
    le.fit_transform(data['JOB TITLE'])

    # Create a new dataframe with the input skills
    df = pd.DataFrame.from_dict({ **{skill: [1 if skill in skills else 0] for skill in data}}, orient='columns')
    df.drop(df.iloc[:,0:2],inplace=True,axis=1)

    y_pred = model.predict(df)

    top_10_classes = np.argsort(y_pred, axis=1)[:, -10:][:, ::-1]

    top_10_labels = []
    for i in range(len(top_10_classes)):
        labels = [le.inverse_transform([j])[0] for j in top_10_classes[i]]
        top_10_labels.append(labels)

    pathData = []
    for i in top_10_labels[0]:
        pathData.append({'path':i,'info':''})
    return pathData